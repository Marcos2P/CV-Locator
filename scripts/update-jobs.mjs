#!/usr/bin/env node
/**
 * Fusiona las ofertas nuevas de la búsqueda diaria con public/data/jobs.json.
 *
 *   node scripts/update-jobs.mjs <candidatas.json>
 *
 * - Valida los campos obligatorios de cada oferta.
 * - Genera un id estable a partir de la URL (misma oferta = mismo id).
 * - Ignora duplicados (misma URL, o mismo título + empresa).
 * - Borra las ofertas publicadas hace más de 7 días.
 * - Actualiza `updatedAt` aunque no haya ofertas nuevas.
 */
import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const MAX_AGE_DAYS = 7
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const JOBS_PATH = join(ROOT, 'public/data/jobs.json')
const SEARCHES_PATH = join(ROOT, 'public/data/searches.json')
const REQUIRED = ['searchId', 'title', 'company', 'location', 'postedAt', 'source', 'url', 'summary']

const candidatesPath = process.argv[2]
if (!candidatesPath) {
  console.error('Uso: node scripts/update-jobs.mjs <candidatas.json>')
  process.exit(1)
}

const readJson = (p) => JSON.parse(readFileSync(p, 'utf8'))

/** Quita parámetros de tracking y la barra final para comparar URLs */
function normalizeUrl(raw) {
  const u = new URL(raw)
  for (const key of [...u.searchParams.keys()]) {
    if (/^(utm_|ref|source|trk|tracking)/i.test(key)) u.searchParams.delete(key)
  }
  u.hash = ''
  return u.toString().replace(/\/$/, '')
}

const idFor = (url) => createHash('sha1').update(normalizeUrl(url)).digest('hex').slice(0, 12)
const dupKey = (j) => `${j.title}|${j.company}`.toLowerCase().replace(/\s+/g, ' ').trim()

function ageInDays(dateStr, now) {
  const d = new Date(`${dateStr.slice(0, 10)}T00:00:00Z`)
  const today = new Date(`${now.toISOString().slice(0, 10)}T00:00:00Z`)
  return Math.round((today - d) / 86_400_000)
}

const now = new Date()
const current = readJson(JOBS_PATH)
const searchIds = new Set(readJson(SEARCHES_PATH).map((s) => s.id))
const candidates = readJson(candidatesPath)

if (!Array.isArray(candidates)) {
  console.error('El archivo de candidatas debe ser un array JSON de ofertas.')
  process.exit(1)
}

// 1. Limpiar lo que ya había: fuera las de más de 7 días.
const kept = current.jobs.filter((j) => ageInDays(j.postedAt, now) <= MAX_AGE_DAYS)
const removed = current.jobs.length - kept.length

const byId = new Map(kept.map((j) => [j.id, j]))
const seenKeys = new Set(kept.map(dupKey))
const report = { added: 0, duplicate: 0, tooOld: 0, invalid: [] }

// 2. Añadir las candidatas válidas y nuevas.
for (const c of candidates) {
  const missing = REQUIRED.filter((f) => typeof c[f] !== 'string' || c[f].trim() === '')
  if (missing.length) {
    report.invalid.push(`${c.title ?? '(sin título)'}: faltan ${missing.join(', ')}`)
    continue
  }
  if (!searchIds.has(c.searchId)) {
    report.invalid.push(`${c.title}: searchId desconocido "${c.searchId}"`)
    continue
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(c.postedAt)) {
    report.invalid.push(`${c.title}: postedAt debe ser YYYY-MM-DD`)
    continue
  }
  let id
  try {
    id = idFor(c.url)
  } catch {
    report.invalid.push(`${c.title}: URL no válida`)
    continue
  }
  const age = ageInDays(c.postedAt, now)
  if (age > MAX_AGE_DAYS || age < -1) {
    report.tooOld++
    continue
  }
  if (byId.has(id) || seenKeys.has(dupKey(c))) {
    report.duplicate++
    continue
  }
  const job = { ...c, id, url: normalizeUrl(c.url), foundAt: now.toISOString() }
  byId.set(id, job)
  seenKeys.add(dupKey(job))
  report.added++
}

// 3. Guardar ordenado: lo más reciente primero.
const jobs = [...byId.values()].sort(
  (a, b) => b.postedAt.localeCompare(a.postedAt) || b.foundAt.localeCompare(a.foundAt),
)
writeFileSync(JOBS_PATH, JSON.stringify({ updatedAt: now.toISOString(), jobs }, null, 2) + '\n')

console.log(
  `Añadidas: ${report.added} · Duplicadas: ${report.duplicate} · ` +
    `Demasiado antiguas: ${report.tooOld} · Caducadas borradas: ${removed} · Total: ${jobs.length}`,
)
if (report.invalid.length) {
  console.log(`Inválidas (${report.invalid.length}):\n  - ${report.invalid.join('\n  - ')}`)
}

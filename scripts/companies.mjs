#!/usr/bin/env node
/**
 * Registro acumulado de empresas que publican ofertas (public/data/companies.json).
 *
 * jobs.json borra las ofertas a los 7–14 días; este archivo NO borra nada: cada empresa
 * se queda con todas las ofertas que se le han visto, cuándo apareció por primera vez
 * y cuándo por última. update-jobs.mjs lo actualiza en cada búsqueda.
 *
 *   node scripts/companies.mjs          → añade las ofertas de jobs.json actual
 *   node scripts/companies.mjs --history → además recorre el historial de git de jobs.json
 */
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
export const COMPANIES_PATH = join(ROOT, 'public/data/companies.json')

/** Agencias de empleo temporal / headhunters: se marcan para poder separarlas de los empleadores */
const AGENCIES = [
  'adecco', 'randstad', 'manpower', 'experis', 'kelly', 'interiman', 'persona service', 'gi group',
  'express personal', 'coople', 'hays', 'michael page', 'page personnel', 'robert half', 'universal job',
  'careerplus', 'yellowshark', 'art of work', 'rockstar recruiting', 'impact recruitment', 'prime21',
  'jobline', 'personal sigma', 'tempo-team', 'tempo team', 'valjob', 'workselection',
  'job solution', 'jobsolution', 'consult & pepper', 'nemensis', 'myitjob', 'swisslinx', 'recruit',
  'personalberatung', 'personaldienst', 'staffing', 'headhunt', 'rocken', 'jobgether', 'stepstone',
  'academic work', 'lhh', ' personal ag', 'employ me', 'kforce', 'oneday', 'lionstep',
]

const LEGAL = /\b(ag|gmbh|sa|sàrl|sarl|ltd|llc|inc|kg|co|plc|bv|holding|group|gruppe|schweiz|suisse|svizzera|switzerland)\b/g

/** Clave para reconocer la misma empresa aunque se escriba distinto ("Randstad (Schweiz) AG" = "Randstad") */
/** Quita notas entre paréntesis añadidas por la búsqueda: "Manpower (cliente no nombrado)" → "Manpower" */
export const cleanName = (name) =>
  name.replace(/\s*\((cliente|empresa|sin |no |via |vía )[^)]*\)/gi, '').trim() || name

export function companyKey(name) {
  const base = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\(.*?\)/g, ' ')
    .replace(/[^a-z0-9& ]+/g, ' ')
  const stripped = base.replace(LEGAL, ' ').replace(/\s+/g, ' ').trim()
  return stripped || base.replace(/\s+/g, ' ').trim()
}

export const isAgency = (name) => {
  const n = name.toLowerCase()
  return AGENCIES.some((a) => n.includes(a))
}

const readJson = (p) => JSON.parse(readFileSync(p, 'utf8'))

/** Añade las ofertas al registro (las que ya estaban no se cuentan dos veces) y lo guarda */
export function updateCompanies(jobs, now = new Date()) {
  const file = existsSync(COMPANIES_PATH) ? readJson(COMPANIES_PATH) : { companies: [] }
  const byKey = new Map(file.companies.map((c) => [c.key, c]))
  let added = 0

  for (const j of jobs) {
    const key = companyKey(j.company)
    if (!key) continue
    let c = byKey.get(key)
    if (!c) {
      c = { key, name: cleanName(j.company), agency: isAgency(j.company), firstSeen: j.postedAt, lastSeen: j.postedAt, searchIds: [], locations: [], jobs: [] }
      byKey.set(key, c)
      added++
    }
    if (c.jobs.some((x) => x.id === j.id)) continue
    c.jobs.push({ id: j.id, title: j.titleEs ?? j.title, searchId: j.searchId, postedAt: j.postedAt, location: j.location, url: j.url, ...(j.englishOk !== undefined && { englishOk: j.englishOk }) })
    if (j.postedAt < c.firstSeen) c.firstSeen = j.postedAt
    if (j.postedAt >= c.lastSeen) {
      c.lastSeen = j.postedAt
      c.name = cleanName(j.company) // el nombre más reciente
    }
    if (!c.searchIds.includes(j.searchId)) c.searchIds.push(j.searchId)
    if (!c.locations.includes(j.location)) c.locations.push(j.location)
    c.agency ||= isAgency(j.company)
  }

  const companies = [...byKey.values()]
  for (const c of companies) c.jobs.sort((a, b) => b.postedAt.localeCompare(a.postedAt))
  companies.sort((a, b) => b.lastSeen.localeCompare(a.lastSeen) || a.name.localeCompare(b.name))
  writeFileSync(COMPANIES_PATH, JSON.stringify({ updatedAt: now.toISOString(), companies }, null, 2) + '\n')
  return { added, total: companies.length }
}

// Ejecución directa
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const jobs = []
  if (process.argv.includes('--history')) {
    const commits = execFileSync('git', ['log', '--format=%H', '--', 'public/data/jobs.json'], { cwd: ROOT, encoding: 'utf8' })
      .split('\n')
      .filter(Boolean)
      .reverse()
    for (const sha of commits) {
      try {
        const txt = execFileSync('git', ['show', `${sha}:public/data/jobs.json`], { cwd: ROOT, encoding: 'utf8' })
        jobs.push(...(JSON.parse(txt).jobs ?? []))
      } catch {
        // versión sin jobs.json o JSON roto: se ignora
      }
    }
  }
  jobs.push(...readJson(join(ROOT, 'public/data/jobs.json')).jobs)
  const { added, total } = updateCompanies(jobs.filter((j) => j.id && j.company && j.postedAt))
  console.log(`Empresas nuevas: ${added} · Total: ${total}`)
}

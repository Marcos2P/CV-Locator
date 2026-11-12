/**
 * Registro de cobertura de la búsqueda diaria.
 *
 * Demuestra que se ha revisado CADA web (`sources`, o los portales por defecto) y CADA empresa
 * (`companies`) de CADA búsqueda activa. update-jobs.mjs se niega a guardar si falta algo.
 *
 * Formato (/tmp/cobertura.json):
 * {
 *   "searches": {
 *     "<searchId>": {
 *       "sources":   { "<web>":     { "status": "ok", "url": "...", "offersReviewed": 12, "offersAdded": 1 } },
 *       "companies": { "<empresa>": { "status": "blocked", "url": "...", "note": "403 Forbidden" } }
 *     }
 *   }
 * }
 *
 * status:
 *   ok        → página revisada. Obligatorios: url y offersReviewed (nº de ofertas miradas, puede ser 0).
 *   blocked   → la web no deja leer (403, captcha…). Obligatorio: note.
 *   not_found → no se encontró página de empleo. Obligatorio: note.
 *   error     → otro fallo (404, timeout…). Obligatorio: note.
 *   pending   → sin revisar todavía (es lo que genera la plantilla). Nunca se acepta.
 */

/** Portales que se usan cuando una búsqueda no tiene `sources` */
export const DEFAULT_SOURCES = ['jobs.ch', 'linkedin.com/jobs', 'jobscout24.ch', 'job-room.ch']

const STATUSES = new Set(['ok', 'blocked', 'not_found', 'error'])

/** Webs que hay que revisar para una búsqueda */
export function sourcesFor(search) {
  return search.sources?.length ? search.sources : DEFAULT_SOURCES
}

/** Plantilla con todo en "pending", para que la tarea la vaya rellenando */
export function coverageTemplate(searches) {
  const entry = () => ({ status: 'pending', url: '', offersReviewed: 0, offersAdded: 0, note: '' })
  const out = { searches: {} }
  for (const s of searches.filter((x) => x.active)) {
    out.searches[s.id] = {
      sources: Object.fromEntries(sourcesFor(s).map((src) => [src, entry()])),
      companies: Object.fromEntries((s.companies ?? []).map((c) => [c, entry()])),
    }
  }
  return out
}

/** Devuelve la lista de problemas (vacía = cobertura completa) */
export function validateCoverage(coverage, searches) {
  const problems = []
  const bySearch = coverage?.searches ?? {}

  for (const s of searches.filter((x) => x.active)) {
    const cov = bySearch[s.id]
    if (!cov) {
      problems.push(`${s.id}: falta la búsqueda entera en la cobertura`)
      continue
    }
    const groups = [
      ['web', sourcesFor(s), cov.sources ?? {}],
      ['empresa', s.companies ?? [], cov.companies ?? {}],
    ]
    for (const [kind, required, entries] of groups) {
      for (const name of required) {
        const e = entries[name]
        const where = `${s.id} → ${kind} "${name}"`
        if (!e) {
          problems.push(`${where}: no aparece`)
        } else if (!STATUSES.has(e.status)) {
          problems.push(`${where}: estado "${e.status}" (hay que revisarla)`)
        } else if (e.status === 'ok') {
          if (!e.url) problems.push(`${where}: falta la url revisada`)
          if (!Number.isInteger(e.offersReviewed) || e.offersReviewed < 0) {
            problems.push(`${where}: offersReviewed debe ser un número entero ≥ 0`)
          }
        } else if (!e.note) {
          problems.push(`${where}: estado "${e.status}" sin explicación en note`)
        }
      }
    }
  }
  return problems
}

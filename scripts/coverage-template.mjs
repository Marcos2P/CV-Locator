#!/usr/bin/env node
/**
 * Crea la plantilla de cobertura con TODAS las webs y empresas de las búsquedas activas en "pending".
 *
 *   node scripts/coverage-template.mjs <it|general> > /tmp/cobertura.json
 */
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { GROUPS, coverageTemplate } from './coverage.mjs'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const searches = JSON.parse(readFileSync(join(ROOT, 'public/data/searches.json'), 'utf8'))
const group = process.argv[2]
if (!GROUPS.includes(group)) {
  console.error(`Uso: node scripts/coverage-template.mjs <${GROUPS.join('|')}>`)
  process.exit(1)
}
console.log(JSON.stringify(coverageTemplate(searches, group), null, 2))

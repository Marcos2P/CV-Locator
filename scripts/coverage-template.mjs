#!/usr/bin/env node
/**
 * Crea la plantilla de cobertura con TODAS las webs y empresas de las búsquedas activas en "pending".
 *
 *   node scripts/coverage-template.mjs > /tmp/cobertura.json
 */
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { coverageTemplate } from './coverage.mjs'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const searches = JSON.parse(readFileSync(join(ROOT, 'public/data/searches.json'), 'utf8'))
console.log(JSON.stringify(coverageTemplate(searches), null, 2))

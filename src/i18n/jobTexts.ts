import type { Job } from '../types'
import type { Language } from './languages'

export interface LocalizedJobTexts {
  title: string
  summary: string
  description?: string
  requirements?: string[]
  workload?: string
  employmentType?: string
  language?: string
}

/**
 * Textos de una oferta en el idioma elegido.
 * - ES: los campos principales (+ `titleEs`). DE: el bloque `de`.
 * - Si falta una traducción, se usa el texto que haya (el título original como último recurso).
 */
export function jobTexts(job: Job, lang: Language): LocalizedJobTexts {
  const es: LocalizedJobTexts = {
    title: job.titleEs ?? job.title,
    summary: job.summary,
    description: job.description,
    requirements: job.requirements,
    workload: job.workload,
    employmentType: job.employmentType,
    language: job.language,
  }
  if (lang === 'es') return es

  const de = job.de ?? {}
  return {
    title: de.title ?? job.title,
    summary: de.summary ?? es.summary,
    description: de.description ?? es.description,
    requirements: de.requirements ?? es.requirements,
    workload: de.workload ?? es.workload,
    employmentType: de.employmentType ?? es.employmentType,
    language: de.language ?? es.language,
  }
}

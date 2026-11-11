import type { Job } from '../types'
import type { Language } from './languages'

export interface LocalizedJobTexts {
  title: string
  summary: string
  description?: string
  requirements?: string[]
}

/**
 * Título, resumen, descripción y requisitos de una oferta en el idioma elegido.
 * - ES: los campos principales (+ `titleEs`). DE: el bloque `de`.
 * - Si falta una traducción, se usa el texto que haya (el título original como último recurso).
 */
export function jobTexts(job: Job, lang: Language): LocalizedJobTexts {
  const es: LocalizedJobTexts = {
    title: job.titleEs ?? job.title,
    summary: job.summary,
    description: job.description,
    requirements: job.requirements,
  }
  if (lang === 'es') return es
  return {
    title: job.de?.title ?? job.title,
    summary: job.de?.summary ?? es.summary,
    description: job.de?.description ?? es.description,
    requirements: job.de?.requirements ?? es.requirements,
  }
}

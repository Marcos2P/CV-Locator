import type { Job, JobTexts } from '../types'
import type { Language } from './languages'

/** Resumen, descripción y requisitos de una oferta en el idioma elegido (si no hay, en español) */
export function jobTexts(job: Job, lang: Language): Required<Pick<JobTexts, 'summary'>> & JobTexts {
  const es = { summary: job.summary, description: job.description, requirements: job.requirements }
  if (lang !== 'de' || !job.de) return es
  return {
    summary: job.de.summary ?? es.summary,
    description: job.de.description ?? es.description,
    requirements: job.de.requirements ?? es.requirements,
  }
}

/** Una búsqueda guardada en public/data/searches.json */
export interface Search {
  id: string
  /** Puesto que buscas, p. ej. "Frontend Developer" */
  title: string
  /** Palabras clave que deben aparecer en la oferta */
  keywords: string[]
  /** Ubicación, p. ej. "Zürich" o "Sirnach TG" */
  location: string
  /** Radio alrededor de la ubicación, en km */
  radiusKm?: number
  /** Si es false, la búsqueda diaria la ignora */
  active: boolean
}

/** Una oferta encontrada por la búsqueda diaria (public/data/jobs.json) */
export interface Job {
  /** Identificador estable, generado a partir de la URL */
  id: string
  /** Búsqueda que la encontró */
  searchId: string
  title: string
  company: string
  location: string
  /** Fecha de publicación de la oferta (YYYY-MM-DD) */
  postedAt: string
  /** Momento en que la encontró la búsqueda diaria (ISO 8601) */
  foundAt: string
  /** Portal o web donde está publicada, p. ej. "jobs.ch" */
  source: string
  /** Enlace para solicitar */
  url: string
  /** Resumen de 1–2 frases para la tarjeta */
  summary: string
  /** Descripción más larga para el detalle */
  description?: string
  requirements?: string[]
  /** Pensum, p. ej. "80–100 %" */
  workload?: string
  /** Tipo de contrato, p. ej. "Festanstellung" */
  employmentType?: string
  salary?: string
  /** Idioma de la oferta o requerido, p. ej. "Deutsch B1" */
  language?: string
}

export interface JobsFile {
  /** Última ejecución de la búsqueda diaria (ISO 8601) */
  updatedAt: string | null
  jobs: Job[]
}

/** Una oferta marcada como solicitada (se guarda en el navegador) */
export interface AppliedJob {
  job: Job
  appliedAt: string
}

export type Tab = 'new' | 'applied'

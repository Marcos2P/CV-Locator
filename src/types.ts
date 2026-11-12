/** Una búsqueda guardada en public/data/searches.json */
export interface Search {
  id: string
  /** Puesto que buscas, p. ej. "Frontend Developer" (lo usa la búsqueda diaria) */
  title: string
  /** Nombre que se enseña en la app en cada idioma */
  labels?: { es?: string; de?: string }
  /** Palabras clave que deben aparecer en la oferta */
  keywords: string[]
  /** Ubicación, p. ej. "Zürich" o "Sirnach TG" */
  location: string
  /** Radio alrededor de la ubicación, en km */
  radiusKm?: number
  /**
   * Webs donde buscar (p. ej. "jobs.ch", "gastrojob.ch" o la web de empleo de una empresa).
   * Si no se indica, la búsqueda diaria usa los portales por defecto de ROUTINE.md.
   */
  sources?: string[]
  /** Si es false, la búsqueda diaria la ignora */
  active: boolean
}

/** Una oferta encontrada por la búsqueda diaria (public/data/jobs.json) */
export interface Job {
  /** Identificador estable, generado a partir de la URL */
  id: string
  /** Búsqueda que la encontró */
  searchId: string
  /** Título tal cual aparece en la oferta original (suele estar en alemán) */
  title: string
  /** Título traducido al español */
  titleEs?: string
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
  /** Los mismos textos en alemán (summary, description y requirements en español van arriba) */
  de?: JobTexts
}

export interface JobTexts {
  title?: string
  summary?: string
  description?: string
  requirements?: string[]
  workload?: string
  employmentType?: string
  language?: string
}

export interface JobsFile {
  /** Última ejecución de la búsqueda diaria (ISO 8601) */
  updatedAt: string | null
  jobs: Job[]
}

/** Lo que has decidido sobre una oferta */
export type JobStatus = 'applied' | 'dismissed'

/** Oferta con estado (se guarda en el navegador, con la oferta completa) */
export interface SavedJob {
  job: Job
  status: JobStatus
  /** Cuándo la marcaste (ISO 8601) */
  at: string
}

export type Tab = 'new' | JobStatus

import { useCallback, useEffect, useState } from 'react'
import type { Job, JobStatus, SavedJob } from '../types'

const STORAGE_KEY = 'cv-locator:status'
/** Clave de la versión anterior (solo "solicitados"); se migra una vez */
const LEGACY_APPLIED_KEY = 'cv-locator:applied'

type StatusMap = Record<string, SavedJob>

function load(): StatusMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as StatusMap

    // Migración: lo marcado como solicitado en la versión anterior no se pierde.
    const legacy = localStorage.getItem(LEGACY_APPLIED_KEY)
    if (legacy) {
      const old = JSON.parse(legacy) as Record<string, { job: Job; appliedAt: string }>
      const migrated: StatusMap = {}
      for (const [id, { job, appliedAt }] of Object.entries(old)) {
        migrated[id] = { job, status: 'applied', at: appliedAt }
      }
      return migrated
    }
  } catch {
    // Navegación privada o datos corruptos: empezamos de cero.
  }
  return {}
}

/**
 * Estado de cada oferta: solicitada o descartada ("no me interesa").
 * Se guarda la oferta completa en localStorage para que siga en su pestaña
 * aunque a los 7 días desaparezca de jobs.json.
 */
export function useJobStatus() {
  // Inicialización perezosa: load() solo se ejecuta en el primer render.
  const [statuses, setStatuses] = useState<StatusMap>(load)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(statuses))
      localStorage.removeItem(LEGACY_APPLIED_KEY)
    } catch {
      /* sin almacenamiento disponible: la app sigue funcionando en memoria */
    }
  }, [statuses])

  /** Marca una oferta como solicitada o descartada (sustituye el estado anterior) */
  const setStatus = useCallback((job: Job, status: JobStatus) => {
    setStatuses((prev) => ({ ...prev, [job.id]: { job, status, at: new Date().toISOString() } }))
  }, [])

  /** Devuelve la oferta a "Nuevos puestos" */
  const clearStatus = useCallback((id: string) => {
    setStatuses((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
  }, [])

  return { statuses, setStatus, clearStatus }
}

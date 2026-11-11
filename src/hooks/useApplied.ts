import { useCallback, useEffect, useState } from 'react'
import type { AppliedJob, Job } from '../types'

const STORAGE_KEY = 'cv-locator:applied'

type AppliedMap = Record<string, AppliedJob>

function load(): AppliedMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as AppliedMap) : {}
  } catch {
    // Navegación privada o datos corruptos: empezamos de cero.
    return {}
  }
}

/**
 * Ofertas marcadas como solicitadas, guardadas en localStorage.
 * Guardamos la oferta completa (no solo el id) para que siga en
 * "Solicitados" aunque a los 7 días desaparezca de jobs.json.
 */
export function useApplied() {
  // Inicialización perezosa: load() solo se ejecuta en el primer render.
  const [applied, setApplied] = useState<AppliedMap>(load)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(applied))
    } catch {
      /* sin almacenamiento disponible: la app sigue funcionando en memoria */
    }
  }, [applied])

  const markApplied = useCallback((job: Job) => {
    setApplied((prev) => ({ ...prev, [job.id]: { job, appliedAt: new Date().toISOString() } }))
  }, [])

  const unmarkApplied = useCallback((id: string) => {
    setApplied((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
  }, [])

  return { applied, markApplied, unmarkApplied }
}

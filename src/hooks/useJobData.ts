import { useCallback, useEffect, useState } from 'react'
import type { JobsFile, Search } from '../types'

interface JobData {
  searches: Search[]
  jobs: JobsFile
}

export type JobDataState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; data: JobData }

async function fetchJson<T>(path: string): Promise<T> {
  // BASE_URL hace que funcione igual en local y en GitHub Pages.
  // `cache: 'no-store'` evita ver un jobs.json antiguo.
  const res = await fetch(`${import.meta.env.BASE_URL}data/${path}`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`No se pudo cargar ${path} (${res.status})`)
  return res.json() as Promise<T>
}

/**
 * Carga searches.json y jobs.json al abrir la app.
 * `reload()` vuelve a pedirlos sin mostrar "Cargando…" (se usa al esperar una búsqueda).
 */
export function useJobData() {
  const [state, setState] = useState<JobDataState>({ status: 'loading' })
  // Cada vez que cambia `version`, el efecto vuelve a descargar los datos.
  const [version, setVersion] = useState(0)

  useEffect(() => {
    let cancelled = false
    Promise.all([fetchJson<Search[]>('searches.json'), fetchJson<JobsFile>('jobs.json')])
      .then(([searches, jobs]) => {
        if (!cancelled) setState({ status: 'ready', data: { searches, jobs } })
      })
      .catch((err: unknown) => {
        if (cancelled) return
        // En una recarga silenciosa que falla, mantenemos los datos que ya había.
        setState((prev) =>
          prev.status === 'ready'
            ? prev
            : { status: 'error', message: err instanceof Error ? err.message : String(err) },
        )
      })
    // Si el componente se desmonta (o llega otra recarga) antes de la respuesta,
    // ignoramos esta respuesta.
    return () => {
      cancelled = true
    }
  }, [version])

  const reload = useCallback(() => setVersion((v) => v + 1), [])

  return { state, reload }
}

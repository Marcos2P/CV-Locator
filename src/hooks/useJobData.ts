import { useEffect, useState } from 'react'
import type { JobsFile, Search } from '../types'

interface JobData {
  searches: Search[]
  jobs: JobsFile
}

type State =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; data: JobData }

async function fetchJson<T>(path: string): Promise<T> {
  // BASE_URL hace que funcione igual en local y en GitHub Pages.
  // `cache: 'no-store'` evita ver el jobs.json de ayer.
  const res = await fetch(`${import.meta.env.BASE_URL}data/${path}`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`No se pudo cargar ${path} (${res.status})`)
  return res.json() as Promise<T>
}

/** Carga searches.json y jobs.json una vez al abrir la app */
export function useJobData(): State {
  const [state, setState] = useState<State>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false
    Promise.all([fetchJson<Search[]>('searches.json'), fetchJson<JobsFile>('jobs.json')])
      .then(([searches, jobs]) => {
        if (!cancelled) setState({ status: 'ready', data: { searches, jobs } })
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setState({ status: 'error', message: err instanceof Error ? err.message : String(err) })
        }
      })
    // Si el componente se desmonta antes de que llegue la respuesta,
    // no intentamos actualizar el estado.
    return () => {
      cancelled = true
    }
  }, [])

  return state
}

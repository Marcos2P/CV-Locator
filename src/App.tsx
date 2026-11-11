import { useMemo, useState } from 'react'
import Header from './components/Header/Header'
import JobCard from './components/JobCard/JobCard'
import JobDetail from './components/JobDetail/JobDetail'
import JobGrid from './components/JobGrid/JobGrid'
import SearchFilter from './components/SearchFilter/SearchFilter'
import { useApplied } from './hooks/useApplied'
import { useJobData } from './hooks/useJobData'
import type { Job, Search, Tab } from './types'
import { isFresh } from './utils/date'
import styles from './App.module.css'

// Constantes fuera del componente: mismo array en cada render,
// así useMemo no se recalcula sin motivo.
const NO_JOBS: Job[] = []
const NO_SEARCHES: Search[] = []

function App() {
  const state = useJobData()
  const { applied, markApplied, unmarkApplied } = useApplied()

  const [tab, setTab] = useState<Tab>('new')
  const [searchId, setSearchId] = useState<string | null>(null)
  const [openJob, setOpenJob] = useState<Job | null>(null)

  const searches = state.status === 'ready' ? state.data.searches : NO_SEARCHES
  const allJobs = state.status === 'ready' ? state.data.jobs.jobs : NO_JOBS

  // "Nuevos": de la última semana y aún no solicitados, los más recientes primero.
  // useMemo evita recalcular la lista en cada render si los datos no cambian.
  const newJobs = useMemo(
    () =>
      allJobs
        .filter((j) => isFresh(j.postedAt) && !applied[j.id])
        .sort((a, b) => b.postedAt.localeCompare(a.postedAt)),
    [allJobs, applied],
  )

  // "Solicitados": salen de localStorage, aunque ya no estén en jobs.json.
  const appliedJobs = useMemo(
    () => Object.values(applied).sort((a, b) => b.appliedAt.localeCompare(a.appliedAt)),
    [applied],
  )

  const visibleNew = searchId ? newJobs.filter((j) => j.searchId === searchId) : newJobs
  const visibleApplied = searchId
    ? appliedJobs.filter((a) => a.job.searchId === searchId)
    : appliedJobs

  return (
    <>
      <Header
        tab={tab}
        onTabChange={setTab}
        newCount={newJobs.length}
        appliedCount={appliedJobs.length}
        updatedAt={state.status === 'ready' ? state.data.jobs.updatedAt : null}
      />

      <main className={styles.main}>
        {state.status === 'loading' && <p className={styles.status}>Cargando ofertas…</p>}
        {state.status === 'error' && (
          <p className={styles.status} role="alert">
            {state.message}
          </p>
        )}

        {state.status === 'ready' && (
          <>
            <SearchFilter searches={searches} selected={searchId} onSelect={setSearchId} />

            {tab === 'new' ? (
              <JobGrid
                isEmpty={visibleNew.length === 0}
                emptyMessage="No hay ofertas nuevas. La próxima búsqueda es mañana a las 8:00."
              >
                {visibleNew.map((job) => (
                  <JobCard key={job.id} job={job} onOpen={setOpenJob} />
                ))}
              </JobGrid>
            ) : (
              <JobGrid
                isEmpty={visibleApplied.length === 0}
                emptyMessage="Todavía no has marcado ninguna oferta como solicitada."
              >
                {visibleApplied.map(({ job, appliedAt }) => (
                  <JobCard key={job.id} job={job} appliedAt={appliedAt} onOpen={setOpenJob} />
                ))}
              </JobGrid>
            )}
          </>
        )}
      </main>

      <JobDetail
        job={openJob}
        appliedAt={openJob ? applied[openJob.id]?.appliedAt : undefined}
        onClose={() => setOpenJob(null)}
        onMarkApplied={markApplied}
        onUnmarkApplied={unmarkApplied}
      />
    </>
  )
}

export default App

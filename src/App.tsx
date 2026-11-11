import { useEffect, useMemo, useState } from 'react'
import Header from './components/Header/Header'
import JobCard from './components/JobCard/JobCard'
import JobDetail from './components/JobDetail/JobDetail'
import JobGrid from './components/JobGrid/JobGrid'
import SearchButton from './components/SearchButton/SearchButton'
import SearchFilter from './components/SearchFilter/SearchFilter'
import { useLanguage } from './i18n/LanguageContext'
import { useJobData } from './hooks/useJobData'
import { useJobStatus } from './hooks/useJobStatus'
import type { Job, JobStatus, SavedJob, Search, Tab } from './types'
import { isFresh } from './utils/date'
import styles from './App.module.css'

// Constantes fuera del componente: mismo array en cada render,
// así useMemo no se recalcula sin motivo.
const NO_JOBS: Job[] = []
const NO_SEARCHES: Search[] = []

/** Mientras se busca, comprobamos jobs.json cada minuto, durante 30 min como máximo */
const POLL_MS = 60_000
const POLL_MAX_MS = 30 * 60_000

function App() {
  const { t } = useLanguage()
  const { state, reload } = useJobData()
  const { statuses, setStatus, clearStatus } = useJobStatus()

  const [tab, setTab] = useState<Tab>('new')
  const [searchId, setSearchId] = useState<string | null>(null)
  const [openJob, setOpenJob] = useState<Job | null>(null)

  const searches = state.status === 'ready' ? state.data.searches : NO_SEARCHES
  const allJobs = state.status === 'ready' ? state.data.jobs.jobs : NO_JOBS
  const updatedAt = state.status === 'ready' ? state.data.jobs.updatedAt : null

  // Búsqueda manual en curso: guardamos el `updatedAt` que había al pulsar el botón.
  // Cuando jobs.json trae otro distinto, la búsqueda ha terminado.
  const [pending, setPending] = useState<{ since: number; baseline: string | null } | null>(null)
  const searching = pending !== null && updatedAt === pending.baseline

  useEffect(() => {
    if (!pending || !searching) return
    const id = setInterval(() => {
      if (Date.now() - pending.since > POLL_MAX_MS) setPending(null)
      else reload()
    }, POLL_MS)
    return () => clearInterval(id)
  }, [pending, searching, reload])

  // "Nuevos": de la última semana y sin decidir todavía, los más recientes primero.
  // useMemo evita recalcular la lista en cada render si los datos no cambian.
  const newJobs = useMemo(
    () =>
      allJobs
        .filter((j) => isFresh(j.postedAt) && !statuses[j.id])
        .sort((a, b) => b.postedAt.localeCompare(a.postedAt)),
    [allJobs, statuses],
  )

  // "Solicitados" y "No me interesan": salen de localStorage, aunque ya no estén en jobs.json.
  const savedByStatus = useMemo(() => {
    const byStatus: Record<JobStatus, SavedJob[]> = { applied: [], dismissed: [] }
    for (const saved of Object.values(statuses)) byStatus[saved.status].push(saved)
    for (const list of Object.values(byStatus)) list.sort((a, b) => b.at.localeCompare(a.at))
    return byStatus
  }, [statuses])

  const counts: Record<Tab, number> = {
    new: newJobs.length,
    applied: savedByStatus.applied.length,
    dismissed: savedByStatus.dismissed.length,
  }

  const visibleNew = searchId ? newJobs.filter((j) => j.searchId === searchId) : newJobs
  const visibleSaved =
    tab === 'new'
      ? []
      : savedByStatus[tab].filter((s) => !searchId || s.job.searchId === searchId)

  return (
    <>
      <Header
        tab={tab}
        onTabChange={setTab}
        counts={counts}
        updatedAt={updatedAt}
        action={
          <SearchButton
            searching={searching}
            onStarted={() => setPending({ since: Date.now(), baseline: updatedAt })}
          />
        }
      />

      <main className={styles.main}>
        {state.status === 'loading' && <p className={styles.status}>{t.loading}</p>}
        {state.status === 'error' && (
          <p className={styles.status} role="alert">
            {t.loadError}
          </p>
        )}

        {state.status === 'ready' && (
          <>
            <SearchFilter searches={searches} selected={searchId} onSelect={setSearchId} />

            {tab === 'new' ? (
              <JobGrid
                isEmpty={visibleNew.length === 0}
                emptyMessage={t.emptyNew}
              >
                {visibleNew.map((job) => (
                  <JobCard key={job.id} job={job} onOpen={setOpenJob} />
                ))}
              </JobGrid>
            ) : (
              <JobGrid
                isEmpty={visibleSaved.length === 0}
                emptyMessage={tab === 'applied' ? t.emptyApplied : t.emptyDismissed}
              >
                {visibleSaved.map((saved) => (
                  <JobCard key={saved.job.id} job={saved.job} saved={saved} onOpen={setOpenJob} />
                ))}
              </JobGrid>
            )}
          </>
        )}
      </main>

      <JobDetail
        job={openJob}
        saved={openJob ? statuses[openJob.id] : undefined}
        onClose={() => setOpenJob(null)}
        onSetStatus={setStatus}
        onClearStatus={clearStatus}
      />
    </>
  )
}

export default App

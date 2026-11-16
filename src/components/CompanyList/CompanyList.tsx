import { useMemo, useState } from 'react'
import { useLanguage } from '../../i18n/LanguageContext'
import type { CompanyEntry, Job, Search } from '../../types'
import { formatDate, relativeDay } from '../../utils/date'
import styles from './CompanyList.module.css'

type Sort = 'recent' | 'active' | 'total' | 'name'

interface Props {
  companies: CompanyEntry[]
  searches: Search[]
  /** Ofertas que siguen en jobs.json (para saber cuáles están activas y abrir su detalle) */
  jobs: Job[]
  /** Filtro de búsqueda elegido en los chips (null = todas) */
  searchId: string | null
  englishOnly: boolean
  onOpenJob: (job: Job) => void
}

/**
 * Todas las empresas que han publicado ofertas en tus búsquedas, aunque las ofertas ya hayan caducado.
 * Sirve para ver de un vistazo quién está contratando e investigarlas por tu cuenta.
 */
function CompanyList({ companies, searches, jobs, searchId, englishOnly, onOpenJob }: Props) {
  const { t, lang } = useLanguage()
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<Sort>('recent')
  const [hideAgencies, setHideAgencies] = useState(false)

  const jobsById = useMemo(() => new Map(jobs.map((j) => [j.id, j])), [jobs])
  const searchLabel = useMemo(
    () => new Map(searches.map((s) => [s.id, s.labels?.[lang] ?? s.title])),
    [searches, lang],
  )

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return companies
      .map((c) => {
        // Solo cuentan las ofertas que pasan los filtros de arriba
        const seen = c.jobs.filter(
          (j) => (!searchId || j.searchId === searchId) && (!englishOnly || j.englishOk === true),
        )
        return { company: c, seen, active: seen.filter((j) => jobsById.has(j.id)).length }
      })
      .filter(({ company, seen }) => {
        if (seen.length === 0) return false
        if (hideAgencies && company.agency) return false
        if (!q) return true
        return (
          company.name.toLowerCase().includes(q) ||
          company.locations.some((l) => l.toLowerCase().includes(q)) ||
          seen.some((j) => j.title.toLowerCase().includes(q))
        )
      })
      .sort((a, b) => {
        if (sort === 'name') return a.company.name.localeCompare(b.company.name, t.locale)
        if (sort === 'active') return b.active - a.active || b.seen.length - a.seen.length
        if (sort === 'total') return b.seen.length - a.seen.length || b.active - a.active
        return b.seen[0].postedAt.localeCompare(a.seen[0].postedAt) || b.active - a.active
      })
  }, [companies, searchId, englishOnly, hideAgencies, query, sort, jobsById, t.locale])

  const activeCount = rows.filter((r) => r.active > 0).length

  return (
    <section>
      <div className={styles.toolbar}>
        <input
          type="search"
          className={styles.search}
          placeholder={t.companySearch}
          aria-label={t.companySearch}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className={styles.select}
          aria-label={t.companySortLabel}
          value={sort}
          onChange={(e) => setSort(e.target.value as Sort)}
        >
          <option value="recent">{t.companySort.recent}</option>
          <option value="active">{t.companySort.active}</option>
          <option value="total">{t.companySort.total}</option>
          <option value="name">{t.companySort.name}</option>
        </select>
        <label className={styles.check}>
          <input type="checkbox" checked={hideAgencies} onChange={(e) => setHideAgencies(e.target.checked)} />
          {t.hideAgencies}
        </label>
      </div>

      <p className={styles.summary}>{t.companiesSummary(rows.length, activeCount)}</p>

      {rows.length === 0 ? (
        <p className={styles.empty}>{t.emptyCompanies}</p>
      ) : (
        <ul className={styles.list}>
          {rows.map(({ company: c, seen, active }) => {
            const search = encodeURIComponent(c.name)
            return (
              <li key={c.key} className={active > 0 ? styles.item : `${styles.item} ${styles.inactive}`}>
                <div className={styles.head}>
                  <h2 className={styles.name}>{c.name}</h2>
                  {c.agency && <span className={styles.agency}>{t.agencyBadge}</span>}
                  <span className={active > 0 ? styles.active : styles.count}>
                    {active > 0 ? t.companyActive(active) : t.companyNoActive}
                  </span>
                </div>

                <p className={styles.meta}>
                  {t.companySeen(seen.length)} · {t.companyLast(relativeDay(seen[0].postedAt, t))}
                  {' · '}
                  {t.companyFirst(formatDate(seen[seen.length - 1].postedAt, t.locale))}
                </p>
                <p className={styles.meta}>
                  {[...new Set(seen.map((j) => searchLabel.get(j.searchId) ?? j.searchId))].join(' · ')}
                  {' — '}
                  {[...new Set(seen.map((j) => j.location))].slice(0, 3).join(' / ')}
                </p>

                <details className={styles.details}>
                  <summary>{t.companyJobs(seen.length)}</summary>
                  <ul className={styles.jobs}>
                    {seen.map((j) => {
                      const live = jobsById.get(j.id)
                      return (
                        <li key={j.id}>
                          {live ? (
                            <button className={styles.jobLink} onClick={() => onOpenJob(live)}>
                              {j.title}
                            </button>
                          ) : (
                            <a href={j.url} target="_blank" rel="noreferrer">
                              {j.title}
                            </a>
                          )}{' '}
                          <span className={styles.jobDate}>
                            {formatDate(j.postedAt, t.locale)}
                            {!live && ` · ${t.companyExpired}`}
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                </details>

                <div className={styles.links}>
                  <a href={`https://www.google.com/search?q=${search}`} target="_blank" rel="noreferrer">
                    Google ↗
                  </a>
                  <a href={`https://www.linkedin.com/search/results/companies/?keywords=${search}`} target="_blank" rel="noreferrer">
                    LinkedIn ↗
                  </a>
                  <a href={`https://www.kununu.com/ch/search#/?q=${search}`} target="_blank" rel="noreferrer">
                    kununu ↗
                  </a>
                  <a href={`https://www.jobs.ch/de/stellenangebote/?term=${search}`} target="_blank" rel="noreferrer">
                    jobs.ch ↗
                  </a>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}

export default CompanyList

import { jobTexts } from '../../i18n/jobTexts'
import { useLanguage } from '../../i18n/LanguageContext'
import type { Job, SavedJob } from '../../types'
import { daysAgo, relativeDay } from '../../utils/date'
import styles from './JobCard.module.css'

interface Props {
  job: Job
  onOpen: (job: Job) => void
  /** Estado guardado (solicitada / descartada), si lo tiene */
  saved?: SavedJob
}

function JobCard({ job, onOpen, saved }: Props) {
  const { t, lang } = useLanguage()
  const texts = jobTexts(job, lang)
  const isNewToday = !saved && daysAgo(job.foundAt) === 0
  const dismissed = saved?.status === 'dismissed'

  return (
    // Toda la tarjeta es un <button>: se puede abrir con ratón, Enter o Espacio.
    <button
      className={dismissed ? `${styles.card} ${styles.dismissed}` : styles.card}
      onClick={() => onOpen(job)}
    >
      <div className={styles.head}>
        <span className={styles.company}>{job.company}</span>
        {isNewToday && <span className={styles.badge}>{t.badgeNew}</span>}
        {saved?.status === 'applied' && (
          <span className={styles.applied}>{t.appliedBadge(relativeDay(saved.at, t))}</span>
        )}
        {dismissed && <span className={styles.muted}>{t.dismissedBadge}</span>}
      </div>

      <h3 className={styles.title}>{texts.title}</h3>
      <p className={styles.summary}>{texts.summary}</p>

      <ul className={styles.meta}>
        <li>📍 {job.location}</li>
        {texts.workload && <li>⏱ {texts.workload}</li>}
        <li>🗓 {relativeDay(job.postedAt, t)}</li>
      </ul>

      <span className={styles.source}>{job.source}</span>
    </button>
  )
}

export default JobCard

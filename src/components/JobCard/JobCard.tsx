import { jobTexts } from '../../i18n/jobTexts'
import { useLanguage } from '../../i18n/LanguageContext'
import type { Job } from '../../types'
import { daysAgo, relativeDay } from '../../utils/date'
import styles from './JobCard.module.css'

interface Props {
  job: Job
  onOpen: (job: Job) => void
  /** Si está solicitada, la fecha de solicitud */
  appliedAt?: string
}

function JobCard({ job, onOpen, appliedAt }: Props) {
  const { t, lang } = useLanguage()
  const texts = jobTexts(job, lang)
  const isNewToday = !appliedAt && daysAgo(job.foundAt) === 0

  return (
    // Toda la tarjeta es un <button>: se puede abrir con ratón, Enter o Espacio.
    <button className={styles.card} onClick={() => onOpen(job)}>
      <div className={styles.head}>
        <span className={styles.company}>{job.company}</span>
        {isNewToday && <span className={styles.badge}>{t.badgeNew}</span>}
        {appliedAt && <span className={styles.applied}>{t.appliedBadge(relativeDay(appliedAt, t))}</span>}
      </div>

      <h3 className={styles.title}>{texts.title}</h3>
      <p className={styles.summary}>{texts.summary}</p>

      <ul className={styles.meta}>
        <li>📍 {job.location}</li>
        {job.workload && <li>⏱ {job.workload}</li>}
        <li>🗓 {relativeDay(job.postedAt, t)}</li>
      </ul>

      <span className={styles.source}>{job.source}</span>
    </button>
  )
}

export default JobCard

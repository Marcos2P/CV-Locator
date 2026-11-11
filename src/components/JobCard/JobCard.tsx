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
  const isNewToday = !appliedAt && daysAgo(job.foundAt) === 0

  return (
    // Toda la tarjeta es un <button>: se puede abrir con ratón, Enter o Espacio.
    <button className={styles.card} onClick={() => onOpen(job)}>
      <div className={styles.head}>
        <span className={styles.company}>{job.company}</span>
        {isNewToday && <span className={styles.badge}>Nuevo</span>}
        {appliedAt && <span className={styles.applied}>✓ Solicitado {relativeDay(appliedAt)}</span>}
      </div>

      <h3 className={styles.title}>{job.title}</h3>
      <p className={styles.summary}>{job.summary}</p>

      <ul className={styles.meta}>
        <li>📍 {job.location}</li>
        {job.workload && <li>⏱ {job.workload}</li>}
        <li>🗓 {relativeDay(job.postedAt)}</li>
      </ul>

      <span className={styles.source}>{job.source}</span>
    </button>
  )
}

export default JobCard

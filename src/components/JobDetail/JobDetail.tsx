import { useEffect, useRef } from 'react'
import type { Job } from '../../types'
import { formatDateTime, relativeDay } from '../../utils/date'
import styles from './JobDetail.module.css'

interface Props {
  job: Job | null
  appliedAt?: string
  onClose: () => void
  onMarkApplied: (job: Job) => void
  onUnmarkApplied: (id: string) => void
}

/**
 * Detalle de una oferta en un <dialog> nativo:
 * el navegador ya gestiona el foco, la tecla Escape y el fondo oscuro.
 */
function JobDetail({ job, appliedAt, onClose, onMarkApplied, onUnmarkApplied }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  // Sincroniza el estado de React (job != null) con el <dialog> del DOM.
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (job && !dialog.open) dialog.showModal()
    if (!job && dialog.open) dialog.close()
  }, [job])

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      onClose={onClose}
      // Clic fuera del contenido (sobre el fondo) = cerrar
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose()
      }}
      aria-labelledby="job-detail-title"
    >
      {job && (
        <article className={styles.content}>
          <button className={styles.close} onClick={onClose} aria-label="Cerrar">
            ✕
          </button>

          <p className={styles.company}>{job.company}</p>
          <h2 id="job-detail-title" className={styles.title}>
            {job.title}
          </h2>

          <dl className={styles.facts}>
            <div>
              <dt>Ubicación</dt>
              <dd>{job.location}</dd>
            </div>
            {job.workload && (
              <div>
                <dt>Pensum</dt>
                <dd>{job.workload}</dd>
              </div>
            )}
            {job.employmentType && (
              <div>
                <dt>Contrato</dt>
                <dd>{job.employmentType}</dd>
              </div>
            )}
            {job.salary && (
              <div>
                <dt>Salario</dt>
                <dd>{job.salary}</dd>
              </div>
            )}
            {job.language && (
              <div>
                <dt>Idioma</dt>
                <dd>{job.language}</dd>
              </div>
            )}
            <div>
              <dt>Publicada</dt>
              <dd>
                {relativeDay(job.postedAt)} ({job.postedAt})
              </dd>
            </div>
            <div>
              <dt>Fuente</dt>
              <dd>{job.source}</dd>
            </div>
          </dl>

          <p className={styles.description}>{job.description ?? job.summary}</p>

          {job.requirements && job.requirements.length > 0 && (
            <>
              <h3 className={styles.subtitle}>Requisitos</h3>
              <ul className={styles.requirements}>
                {job.requirements.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </>
          )}

          <div className={styles.actions}>
            <a className={styles.apply} href={job.url} target="_blank" rel="noopener noreferrer">
              Solicitar en {job.source} ↗
            </a>
            {appliedAt ? (
              <button className={styles.secondary} onClick={() => onUnmarkApplied(job.id)}>
                ✓ Solicitado el {formatDateTime(appliedAt)} · deshacer
              </button>
            ) : (
              <button className={styles.secondary} onClick={() => onMarkApplied(job)}>
                Marcar como solicitado
              </button>
            )}
          </div>
        </article>
      )}
    </dialog>
  )
}

export default JobDetail

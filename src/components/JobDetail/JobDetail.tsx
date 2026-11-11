import { useEffect, useRef } from 'react'
import { jobTexts } from '../../i18n/jobTexts'
import { useLanguage } from '../../i18n/LanguageContext'
import type { Job, JobStatus, SavedJob } from '../../types'
import { formatDate, formatDateTime, relativeDay } from '../../utils/date'
import styles from './JobDetail.module.css'

interface Props {
  job: Job | null
  saved?: SavedJob
  onClose: () => void
  onSetStatus: (job: Job, status: JobStatus) => void
  /** Devuelve la oferta a "Nuevos puestos" */
  onClearStatus: (id: string) => void
}

/**
 * Detalle de una oferta en un <dialog> nativo:
 * el navegador ya gestiona el foco, la tecla Escape y el fondo oscuro.
 */
function JobDetail({ job, saved, onClose, onSetStatus, onClearStatus }: Props) {
  const { t, lang } = useLanguage()
  const dialogRef = useRef<HTMLDialogElement>(null)
  // Textos de la oferta en el idioma elegido (resumen, descripción, requisitos)
  const texts = job ? jobTexts(job, lang) : null

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
      {job && texts && (
        <article className={styles.content}>
          <button className={styles.close} onClick={onClose} aria-label={t.close}>
            ✕
          </button>

          <p className={styles.company}>{job.company}</p>
          <h2 id="job-detail-title" className={styles.title}>
            {texts.title}
          </h2>
          {/* Si el título está traducido, enseñamos también el original: es el que hay que usar al solicitar */}
          {texts.title !== job.title && (
            <p className={styles.original}>
              {t.originalTitle}: <span lang="de">{job.title}</span>
            </p>
          )}

          <dl className={styles.facts}>
            <div>
              <dt>{t.fieldLocation}</dt>
              <dd>{job.location}</dd>
            </div>
            {texts.workload && (
              <div>
                <dt>{t.fieldWorkload}</dt>
                <dd>{texts.workload}</dd>
              </div>
            )}
            {texts.employmentType && (
              <div>
                <dt>{t.fieldContract}</dt>
                <dd>{texts.employmentType}</dd>
              </div>
            )}
            {job.salary && (
              <div>
                <dt>{t.fieldSalary}</dt>
                <dd>{job.salary}</dd>
              </div>
            )}
            {texts.language && (
              <div>
                <dt>{t.fieldLanguage}</dt>
                <dd>{texts.language}</dd>
              </div>
            )}
            <div>
              <dt>{t.fieldPosted}</dt>
              <dd>
                {relativeDay(job.postedAt, t)} ({formatDate(job.postedAt, t.locale)})
              </dd>
            </div>
            <div>
              <dt>{t.fieldSource}</dt>
              <dd>{job.source}</dd>
            </div>
          </dl>

          <p className={styles.description}>{texts.description ?? texts.summary}</p>

          {texts.requirements && texts.requirements.length > 0 && (
            <>
              <h3 className={styles.subtitle}>{t.requirements}</h3>
              <ul className={styles.requirements}>
                {texts.requirements.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </>
          )}

          <div className={styles.actions}>
            <a className={styles.apply} href={job.url} target="_blank" rel="noopener noreferrer">
              {t.applyOn(job.source)}
            </a>
            {saved?.status === 'applied' && (
              <button className={styles.secondary} onClick={() => onClearStatus(job.id)}>
                {t.appliedOn(formatDateTime(saved.at, t.locale))}
              </button>
            )}
            {saved?.status === 'dismissed' && (
              <button className={styles.secondary} onClick={() => onClearStatus(job.id)}>
                {t.dismissedOn(formatDateTime(saved.at, t.locale))}
              </button>
            )}
            {!saved && (
              <>
                <button className={styles.secondary} onClick={() => onSetStatus(job, 'applied')}>
                  {t.markApplied}
                </button>
                <button
                  className={`${styles.secondary} ${styles.ghost}`}
                  onClick={() => {
                    onSetStatus(job, 'dismissed')
                    onClose()
                  }}
                >
                  {t.markDismissed}
                </button>
              </>
            )}
          </div>
        </article>
      )}
    </dialog>
  )
}

export default JobDetail

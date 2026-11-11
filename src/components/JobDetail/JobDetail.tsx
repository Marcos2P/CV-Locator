import { useEffect, useRef } from 'react'
import { jobTexts } from '../../i18n/jobTexts'
import { useLanguage } from '../../i18n/LanguageContext'
import type { Job } from '../../types'
import { formatDate, formatDateTime, relativeDay } from '../../utils/date'
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
            {job.workload && (
              <div>
                <dt>{t.fieldWorkload}</dt>
                <dd>{job.workload}</dd>
              </div>
            )}
            {job.employmentType && (
              <div>
                <dt>{t.fieldContract}</dt>
                <dd>{job.employmentType}</dd>
              </div>
            )}
            {job.salary && (
              <div>
                <dt>{t.fieldSalary}</dt>
                <dd>{job.salary}</dd>
              </div>
            )}
            {job.language && (
              <div>
                <dt>{t.fieldLanguage}</dt>
                <dd>{job.language}</dd>
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
            {appliedAt ? (
              <button className={styles.secondary} onClick={() => onUnmarkApplied(job.id)}>
                {t.appliedOn(formatDateTime(appliedAt, t.locale))}
              </button>
            ) : (
              <button className={styles.secondary} onClick={() => onMarkApplied(job)}>
                {t.markApplied}
              </button>
            )}
          </div>
        </article>
      )}
    </dialog>
  )
}

export default JobDetail

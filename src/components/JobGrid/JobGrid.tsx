import type { ReactNode } from 'react'
import styles from './JobGrid.module.css'

interface Props {
  children: ReactNode
  /** Texto que se muestra si no hay tarjetas */
  emptyMessage: string
  isEmpty: boolean
}

/** Rejilla responsive de tarjetas: 1 columna en móvil, hasta 3 en escritorio */
function JobGrid({ children, emptyMessage, isEmpty }: Props) {
  if (isEmpty) return <p className={styles.empty}>{emptyMessage}</p>
  return <div className={styles.grid}>{children}</div>
}

export default JobGrid

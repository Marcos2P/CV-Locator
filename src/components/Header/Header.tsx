import type { ReactNode } from 'react'
import type { Tab } from '../../types'
import { formatDateTime } from '../../utils/date'
import styles from './Header.module.css'

interface Props {
  tab: Tab
  onTabChange: (tab: Tab) => void
  newCount: number
  appliedCount: number
  updatedAt: string | null
  /** Botón de búsqueda (u otra acción) a la derecha */
  action?: ReactNode
}

function Header({ tab, onTabChange, newCount, appliedCount, updatedAt, action }: Props) {
  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: 'new', label: 'Nuevos puestos', count: newCount },
    { id: 'applied', label: 'Solicitados', count: appliedCount },
  ]

  return (
    <header className={styles.header}>
      <div className={styles.top}>
        <h1 className={styles.logo}>
          Cv<span>-Locator</span>
        </h1>
        <div className={styles.right}>
          <p className={styles.updated}>
            {updatedAt ? `Última búsqueda: ${formatDateTime(updatedAt)}` : 'Aún no hay búsquedas'}
          </p>
          {action}
        </div>
      </div>

      <nav className={styles.tabs} role="tablist" aria-label="Vistas">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            className={tab === t.id ? `${styles.tab} ${styles.active}` : styles.tab}
            onClick={() => onTabChange(t.id)}
          >
            {t.label}
            <span className={styles.count}>{t.count}</span>
          </button>
        ))}
      </nav>
    </header>
  )
}

export default Header

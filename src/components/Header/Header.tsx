import type { ReactNode } from 'react'
import type { Tab } from '../../types'
import { useLanguage } from '../../i18n/LanguageContext'
import { formatDateTime } from '../../utils/date'
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher'
import styles from './Header.module.css'

interface Props {
  tab: Tab
  onTabChange: (tab: Tab) => void
  /** Número de ofertas en cada pestaña */
  counts: Record<Tab, number>
  updatedAt: string | null
  /** Botón de búsqueda (u otra acción) a la derecha */
  action?: ReactNode
}

function Header({ tab, onTabChange, counts, updatedAt, action }: Props) {
  const { t } = useLanguage()
  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: 'new', label: t.tabNew, count: counts.new },
    { id: 'applied', label: t.tabApplied, count: counts.applied },
    { id: 'dismissed', label: t.tabDismissed, count: counts.dismissed },
  ]

  return (
    <header className={styles.header}>
      <div className={styles.top}>
        <h1 className={styles.logo}>
          Cv<span>-Locator</span>
        </h1>
        <div className={styles.right}>
          <p className={styles.updated}>
            {updatedAt ? t.lastSearch(formatDateTime(updatedAt, t.locale)) : t.noSearchYet}
          </p>
          {action}
          <LanguageSwitcher />
        </div>
      </div>

      <nav className={styles.tabs} role="tablist" aria-label={t.tabsLabel}>
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

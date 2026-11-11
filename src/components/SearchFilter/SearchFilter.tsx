import { useLanguage } from '../../i18n/LanguageContext'
import type { Search } from '../../types'
import styles from './SearchFilter.module.css'

interface Props {
  searches: Search[]
  /** null = todas las búsquedas */
  selected: string | null
  onSelect: (id: string | null) => void
}

/** Chips con tus búsquedas activas; al pulsar una se filtran las tarjetas */
function SearchFilter({ searches, selected, onSelect }: Props) {
  const { t } = useLanguage()
  const active = searches.filter((s) => s.active)
  if (active.length === 0) return null

  return (
    <div className={styles.filter} aria-label={t.filterLabel}>
      <button
        className={selected === null ? `${styles.chip} ${styles.on}` : styles.chip}
        aria-pressed={selected === null}
        onClick={() => onSelect(null)}
      >
        {t.filterAll}
      </button>
      {active.map((s) => (
        <button
          key={s.id}
          className={selected === s.id ? `${styles.chip} ${styles.on}` : styles.chip}
          aria-pressed={selected === s.id}
          onClick={() => onSelect(s.id)}
          title={t.keywords(s.keywords.join(', '))}
        >
          {s.title} <span className={styles.loc}>· {s.location}</span>
        </button>
      ))}
    </div>
  )
}

export default SearchFilter

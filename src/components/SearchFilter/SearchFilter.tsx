import { useLanguage } from '../../i18n/LanguageContext'
import type { Search } from '../../types'
import styles from './SearchFilter.module.css'

interface Props {
  searches: Search[]
  /** null = todas las búsquedas */
  selected: string | null
  onSelect: (id: string | null) => void
  /** Mostrar solo ofertas en las que basta con inglés */
  englishOnly: boolean
  onEnglishOnlyChange: (value: boolean) => void
}

/** Chips con tus búsquedas activas; al pulsar una se filtran las tarjetas */
function SearchFilter({ searches, selected, onSelect, englishOnly, onEnglishOnlyChange }: Props) {
  const { t, lang } = useLanguage()
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
          title={[
            t.areas(s.areas.map((a) => (a.radiusKm ? `${a.place} +${a.radiusKm} km` : a.place)).join(', ')),
            t.keywords(s.keywords.join(', ')), s.sources && t.sources(s.sources.join(', ')),
            s.companies && t.companies(s.companies.map((c) => c.name).join(', ')),
          ]
            .filter(Boolean)
            .join('\n')}
        >
          {s.labels?.[lang] ?? s.title} <span className={styles.loc}>· {s.areas.map((a) => a.place).join(' / ')}</span>
        </button>
      ))}
      <button
        className={englishOnly ? `${styles.chip} ${styles.toggle} ${styles.on}` : `${styles.chip} ${styles.toggle}`}
        aria-pressed={englishOnly}
        onClick={() => onEnglishOnlyChange(!englishOnly)}
      >
        {t.englishOnly}
      </button>
    </div>
  )
}

export default SearchFilter

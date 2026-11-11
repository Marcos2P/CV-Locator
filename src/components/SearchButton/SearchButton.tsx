import { ROUTINE_URL } from '../../config'
import { useLanguage } from '../../i18n/LanguageContext'
import styles from './SearchButton.module.css'

interface Props {
  /** true mientras esperamos a que la búsqueda termine */
  searching: boolean
  /** Se llama al pulsar: la app empieza a comprobar si llegan ofertas nuevas */
  onStarted: () => void
}

/**
 * Abre la tarea de Claude en claude.ai, donde se pulsa "Run now".
 * Mientras tanto la app espera y se recarga sola cuando llega el nuevo jobs.json.
 */
function SearchButton({ searching, onStarted }: Props) {
  const { t } = useLanguage()

  function handleClick() {
    window.open(ROUTINE_URL, '_blank', 'noopener')
    onStarted()
  }

  return (
    <button
      className={styles.search}
      onClick={handleClick}
      disabled={searching}
      title={t.searchHint}
    >
      {searching ? (
        <>
          <span className={styles.spinner} aria-hidden="true" /> {t.searching}
        </>
      ) : (
        t.searchNow
      )}
    </button>
  )
}

export default SearchButton

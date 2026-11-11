import { useLanguage } from '../../i18n/LanguageContext'
import { LANGUAGES } from '../../i18n/languages'
import styles from './LanguageSwitcher.module.css'

/** Botones ES | DE para cambiar el idioma de la interfaz */
function LanguageSwitcher() {
  const { lang, setLang, t } = useLanguage()

  return (
    <div className={styles.switcher} role="group" aria-label={t.languageLabel}>
      {LANGUAGES.map((l) => (
        <button
          key={l.code}
          className={lang === l.code ? `${styles.option} ${styles.active}` : styles.option}
          aria-pressed={lang === l.code}
          onClick={() => setLang(l.code)}
        >
          {l.label}
        </button>
      ))}
    </div>
  )
}

export default LanguageSwitcher

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { de } from './de'
import { es, type Dictionary } from './es'
import type { Language } from './languages'


const DICTIONARIES: Record<Language, Dictionary> = { es, de }
const STORAGE_KEY = 'cv-locator:language'

/** Idioma guardado; si no hay, el del navegador (alemán → DE, cualquier otro → ES) */
function initialLanguage(): Language {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'es' || saved === 'de') return saved
  } catch {
    /* sin almacenamiento */
  }
  return navigator.language.toLowerCase().startsWith('de') ? 'de' : 'es'
}

interface LanguageContextValue {
  lang: Language
  setLang: (lang: Language) => void
  /** Diccionario del idioma actual: t.tabNew, t.daysAgo(3)… */
  t: Dictionary
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

/**
 * Context de React: cualquier componente puede leer el idioma con useLanguage()
 * sin tener que pasarlo como prop por todos los niveles.
 */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>(initialLanguage)

  useEffect(() => {
    // <html lang="…"> correcto para lectores de pantalla y traductores del navegador
    document.documentElement.lang = lang
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      /* sin almacenamiento */
    }
  }, [lang])

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: DICTIONARIES[lang] }}>
      {children}
    </LanguageContext.Provider>
  )
}

// oxlint-disable-next-line react/only-export-components -- el hook va junto a su Provider
export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage debe usarse dentro de <LanguageProvider>')
  return ctx
}

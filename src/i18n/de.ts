import type { Dictionary } from './es'

/** Deutsche Texte. `Dictionary` garantiza que no falte ninguna clave del español. */
export const de: Dictionary = {
  locale: 'de-CH',

  // Kopfzeile
  tabNew: 'Neue Stellen',
  tabApplied: 'Beworben',
  tabsLabel: 'Ansichten',
  lastSearch: (date) => `Letzte Suche: ${date}`,
  noSearchYet: 'Noch keine Suche',
  languageLabel: 'Sprache',

  // Suchknopf
  searchNow: '🔎 Jetzt suchen',
  searching: 'Suche läuft…',
  searchHint: 'Öffnet die Aufgabe auf claude.ai: «Run now» drücken, um zu suchen',

  // Filter
  filterLabel: 'Nach Suche filtern',
  filterAll: 'Alle',
  keywords: (list) => `Stichwörter: ${list}`,

  // Listenstatus
  loading: 'Stellen werden geladen…',
  loadError: 'Die Stellen konnten nicht geladen werden. Bitte später erneut versuchen.',
  emptyNew: 'Keine neuen Stellen. Die nächste Suche ist morgen um 8:00 Uhr.',
  emptyApplied: 'Du hast dich noch auf keine Stelle beworben.',

  // Karte
  badgeNew: 'Neu',
  appliedBadge: (when) => `✓ Beworben ${when}`,

  // Relative Daten
  today: 'heute',
  yesterday: 'gestern',
  daysAgo: (n) => `vor ${n} Tagen`,

  // Detail
  close: 'Schliessen',
  fieldLocation: 'Arbeitsort',
  fieldWorkload: 'Pensum',
  fieldContract: 'Vertragsart',
  fieldSalary: 'Lohn',
  fieldLanguage: 'Sprache',
  fieldPosted: 'Veröffentlicht',
  fieldSource: 'Quelle',
  requirements: 'Anforderungen',
  originalTitle: 'Originaltitel',
  applyOn: (source) => `Auf ${source} bewerben ↗`,
  markApplied: 'Als beworben markieren',
  appliedOn: (date) => `✓ Beworben am ${date} · rückgängig`,
}

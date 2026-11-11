/**
 * Textos en español. Es el diccionario "de referencia":
 * el alemán (de.ts) tiene que tener exactamente las mismas claves (TypeScript lo comprueba).
 * Los textos con datos variables son funciones.
 */
export const es = {
  locale: 'es-ES',

  // Cabecera
  tabNew: 'Nuevos puestos',
  tabApplied: 'Solicitados',
  tabsLabel: 'Vistas',
  lastSearch: (date: string) => `Última búsqueda: ${date}`,
  noSearchYet: 'Aún no hay búsquedas',
  languageLabel: 'Idioma',

  // Botón de búsqueda
  searchNow: '🔎 Buscar ahora',
  searching: 'Buscando…',
  searchHint: 'Abre la tarea en claude.ai: pulsa «Run now» para buscar',

  // Filtro
  filterLabel: 'Filtrar por búsqueda',
  filterAll: 'Todas',
  keywords: (list: string) => `Palabras clave: ${list}`,

  // Estados de la lista
  loading: 'Cargando ofertas…',
  loadError: 'No se han podido cargar las ofertas. Inténtalo de nuevo más tarde.',
  emptyNew: 'No hay ofertas nuevas. La próxima búsqueda es mañana a las 8:00.',
  emptyApplied: 'Todavía no has marcado ninguna oferta como solicitada.',

  // Tarjeta
  badgeNew: 'Nuevo',
  appliedBadge: (when: string) => `✓ Solicitado ${when}`,

  // Fechas relativas
  today: 'hoy',
  yesterday: 'ayer',
  daysAgo: (n: number) => `hace ${n} días`,

  // Detalle
  close: 'Cerrar',
  fieldLocation: 'Ubicación',
  fieldWorkload: 'Pensum',
  fieldContract: 'Contrato',
  fieldSalary: 'Salario',
  fieldLanguage: 'Idioma',
  fieldPosted: 'Publicada',
  fieldSource: 'Fuente',
  requirements: 'Requisitos',
  applyOn: (source: string) => `Solicitar en ${source} ↗`,
  markApplied: 'Marcar como solicitado',
  appliedOn: (date: string) => `✓ Solicitado el ${date} · deshacer`,
}

export type Dictionary = typeof es

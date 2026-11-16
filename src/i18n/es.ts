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
  tabDismissed: 'No me interesan',
  tabCompanies: 'Empresas',
  tabsLabel: 'Vistas',
  lastSearch: (date: string) => `Última búsqueda: ${date}`,
  noSearchYet: 'Aún no hay búsquedas',
  languageLabel: 'Idioma',

  // Botón de búsqueda
  searchNow: '🔎 Buscar ahora',
  searching: 'Buscando…',
  searchHint: 'Abre tus tareas en claude.ai: elige IT o general y pulsa «Run now»',

  // Filtro
  filterLabel: 'Filtrar por búsqueda',
  filterAll: 'Todas',
  areas: (list: string) => `Zonas: ${list}`,
  keywords: (list: string) => `Palabras clave: ${list}`,
  sources: (list: string) => `Webs: ${list}`,
  companies: (list: string) => `Empresas: ${list}`,
  englishOnly: '🇬🇧 Solo con inglés',
  englishOkBadge: '🇬🇧 Inglés OK',
  seniority: { intern: 'Prácticas', junior: 'Junior', mid: 'Intermedio', senior: 'Senior', lead: 'Lead' },

  // Estados de la lista
  loading: 'Cargando ofertas…',
  loadError: 'No se han podido cargar las ofertas. Inténtalo de nuevo más tarde.',
  emptyNew: 'No hay ofertas nuevas. La próxima búsqueda es mañana a las 8:00.',
  emptyApplied: 'Todavía no has marcado ninguna oferta como solicitada.',
  emptyDismissed: 'Aquí aparecerán las ofertas que marques como «No me interesa».',

  // Empresas
  companySearch: 'Buscar empresa, lugar o puesto…',
  companySortLabel: 'Ordenar',
  companySort: { recent: 'Más recientes', active: 'Más ofertas activas', total: 'Más ofertas en total', name: 'A–Z' },
  hideAgencies: 'Ocultar agencias',
  agencyBadge: 'Agencia',
  companiesSummary: (n: number, active: number) =>
    `${n} empresas · ${active} con ofertas activas ahora. Se guardan todas, aunque sus ofertas caduquen.`,
  emptyCompanies: 'No hay empresas con estos filtros.',
  companyActive: (n: number) => (n === 1 ? '1 oferta activa' : `${n} ofertas activas`),
  companyNoActive: 'Sin ofertas activas',
  companySeen: (n: number) => (n === 1 ? '1 oferta vista' : `${n} ofertas vistas`),
  companyLast: (when: string) => `última ${when}`,
  companyFirst: (date: string) => `desde el ${date}`,
  companyJobs: (n: number) => `Ver ofertas (${n})`,
  companyExpired: 'caducada',

  // Tarjeta
  badgeNew: 'Nuevo',
  appliedBadge: (when: string) => `✓ Solicitado ${when}`,
  dismissedBadge: 'No me interesa',

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
  originalTitle: 'Título original',
  applyOn: (source: string) => `Solicitar en ${source} ↗`,
  markApplied: 'Marcar como solicitado',
  markDismissed: '✕ No me interesa',
  dismissedOn: (date: string) => `✕ Descartada el ${date} · recuperar`,
  appliedOn: (date: string) => `✓ Solicitado el ${date} · deshacer`,
}

export type Dictionary = typeof es

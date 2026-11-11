/** Las ofertas tienen como mucho una semana de vida */
export const MAX_AGE_DAYS = 7

const DAY_MS = 24 * 60 * 60 * 1000

/** Días completos transcurridos desde una fecha (YYYY-MM-DD o ISO) */
export function daysAgo(date: string, now = new Date()): number {
  const then = new Date(date)
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfThen = new Date(then.getFullYear(), then.getMonth(), then.getDate())
  return Math.round((startOfToday.getTime() - startOfThen.getTime()) / DAY_MS)
}

export function isFresh(postedAt: string, now = new Date()): boolean {
  return daysAgo(postedAt, now) <= MAX_AGE_DAYS
}

export function relativeDay(date: string): string {
  const d = daysAgo(date)
  if (d <= 0) return 'hoy'
  if (d === 1) return 'ayer'
  return `hace ${d} días`
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('es-ES', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

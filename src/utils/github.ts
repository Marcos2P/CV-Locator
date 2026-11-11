import { GITHUB_REPO, SEARCH_ISSUE_TITLE } from '../config'

const TOKEN_KEY = 'cv-locator:github-token'

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function saveToken(token: string | null): void {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  } catch {
    /* sin almacenamiento: habrá que usar el modo sin token */
  }
}

function issueBody(): string {
  return `Búsqueda pedida desde Cv-Locator el ${new Date().toLocaleString('es-ES')}.`
}

/** URL de GitHub con el issue ya rellenado (modo sin token: el usuario pulsa "Submit") */
export function newSearchIssueUrl(): string {
  const params = new URLSearchParams({ title: SEARCH_ISSUE_TITLE, body: issueBody() })
  return `https://github.com/${GITHUB_REPO}/issues/new?${params}`
}

/**
 * Crea el issue directamente con la API de GitHub (modo con token).
 * El token solo necesita el permiso "Issues: Read and write" en este repo.
 */
export async function createSearchIssue(token: string): Promise<void> {
  const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/issues`, {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: JSON.stringify({ title: SEARCH_ISSUE_TITLE, body: issueBody() }),
  })
  if (res.status === 401 || res.status === 403) {
    throw new Error('El token no es válido o no tiene permiso para crear issues.')
  }
  if (!res.ok) throw new Error(`GitHub respondió ${res.status}`)
}

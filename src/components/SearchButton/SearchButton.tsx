import { useRef, useState } from 'react'
import { createSearchIssue, getToken, newSearchIssueUrl, saveToken } from '../../utils/github'
import styles from './SearchButton.module.css'

interface Props {
  /** true mientras esperamos a que la búsqueda termine */
  searching: boolean
  /** Se llama cuando la búsqueda se ha pedido correctamente */
  onStarted: () => void
}

type Status = { kind: 'idle' } | { kind: 'sending' } | { kind: 'error'; message: string }

function SearchButton({ searching, onStarted }: Props) {
  const [status, setStatus] = useState<Status>({ kind: 'idle' })
  const [hasToken, setHasToken] = useState(() => getToken() !== null)
  const dialogRef = useRef<HTMLDialogElement>(null)

  async function handleSearch() {
    const token = getToken()
    if (!token) {
      // Sin token: abrimos GitHub con el issue preparado.
      window.open(newSearchIssueUrl(), '_blank', 'noopener')
      onStarted()
      return
    }
    setStatus({ kind: 'sending' })
    try {
      await createSearchIssue(token)
      setStatus({ kind: 'idle' })
      onStarted()
    } catch (err) {
      setStatus({ kind: 'error', message: err instanceof Error ? err.message : String(err) })
    }
  }

  function handleSaveToken(form: HTMLFormElement) {
    const value = new FormData(form).get('token')?.toString().trim() ?? ''
    saveToken(value || null)
    setHasToken(Boolean(value))
    setStatus({ kind: 'idle' })
    dialogRef.current?.close()
  }

  const busy = searching || status.kind === 'sending'

  return (
    <div className={styles.wrap}>
      <button className={styles.search} onClick={handleSearch} disabled={busy}>
        {searching ? (
          <>
            <span className={styles.spinner} aria-hidden="true" /> Buscando…
          </>
        ) : status.kind === 'sending' ? (
          'Enviando…'
        ) : (
          '🔎 Buscar ahora'
        )}
      </button>
      <button
        className={styles.settings}
        onClick={() => dialogRef.current?.showModal()}
        aria-label="Configurar token de GitHub"
        title={hasToken ? 'Token configurado' : 'Configurar token de GitHub'}
      >
        ⚙{hasToken && <span className={styles.dot} aria-hidden="true" />}
      </button>

      {status.kind === 'error' && (
        <p className={styles.error} role="alert">
          {status.message}
        </p>
      )}

      <dialog ref={dialogRef} className={styles.dialog}>
        <form
          method="dialog"
          onSubmit={(e) => {
            e.preventDefault()
            handleSaveToken(e.currentTarget)
          }}
        >
          <h2>Token de GitHub</h2>
          <p>
            Con un token, el botón lanza la búsqueda con un solo clic. Sin token, abre GitHub y
            tienes que pulsar <em>Submit</em>.
          </p>
          <p className={styles.hint}>
            Crea un <strong>fine-grained token</strong> en GitHub → Settings → Developer settings,
            solo para el repo <code>cv-locator</code> y solo con el permiso{' '}
            <strong>Issues: Read and write</strong>. Se guarda únicamente en este navegador.
          </p>
          <input
            name="token"
            type="password"
            placeholder="github_pat_…"
            defaultValue={getToken() ?? ''}
            autoComplete="off"
          />
          <div className={styles.actions}>
            <button type="button" onClick={() => dialogRef.current?.close()}>
              Cancelar
            </button>
            <button type="submit" className={styles.primary}>
              Guardar
            </button>
          </div>
        </form>
      </dialog>
    </div>
  )
}

export default SearchButton

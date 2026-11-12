# Búsqueda diaria de ofertas (instrucciones para Claude)

Instrucciones **obligatorias** de la tarea programada (cada día a las 8:00, Europe/Zurich, o con "Run now").
Sigue los pasos **en orden y sin saltarte ninguno**. Si cambias algo de cómo se busca, cambia este archivo.

> ⚠️ **No hay atajos.** Hay que revisar **todas** las webs y **todas** las empresas de **todas** las búsquedas
> activas. El script final **rechaza guardar** si falta alguna en el registro de cobertura. Una búsqueda
> incompleta no cuenta como hecha: es mejor tardar más que terminar antes.

## Paso 1 · Preparar

1. Lee `public/data/searches.json`. Solo cuentan las búsquedas con `"active": true`.
   (`labels` es solo el nombre que enseña la app; para buscar usa `title` y `keywords`.)
2. Lee `public/data/jobs.json` para saber qué ofertas ya están guardadas.
3. Crea la plantilla de cobertura, que lista **todo** lo que tienes que revisar:

   ```bash
   node scripts/coverage-template.mjs > /tmp/cobertura.json
   ```

   Ábrela: cada búsqueda tiene sus **webs** (`sources`; si una búsqueda no tiene `sources`, los portales por
   defecto: jobs.ch, linkedin.com/jobs y jobscout24.ch) y sus **empresas** (`companies`), todas en `"pending"`.
   **Esa es tu lista de comprobación.**

## Paso 2 · Recorrer la lista, búsqueda por búsqueda

Para **cada búsqueda activa**, haz **todo** esto:

### 2a · Cada web de la búsqueda (una por una)
Abre con WebFetch la **página de resultados** de esa web (no te fíes del buscador web: suele devolver anuncios
viejos que ya dan 404/410). Busca con varios términos (el `title` y las `keywords` más importantes) y lugares
de la zona (para Sirnach TG con radio 30–60 km: Sirnach, Wil SG, Frauenfeld, Winterthur, Münchwilen, Uzwil,
St. Gallen y Zürich si entran en el radio). Direcciones útiles:

- **jobs.ch**: `https://www.jobs.ch/de/stellenangebote/?term=<TÉRMINO>&location=<LUGAR>&sort-by=date` (y `&page=2`, `&page=3`)
- **linkedin.com/jobs**: `https://www.linkedin.com/jobs/search/?keywords=<TÉRMINO>&location=<LUGAR>&f_TPR=r604800`
- **jobscout24.ch**: `https://www.jobscout24.ch/de/jobs/<TÉRMINO>/<LUGAR>/`
- Otras webs (gastrojob.ch, hotelcareer.ch…): usa su buscador o búscalo con WebSearch.

### 2b · Cada empresa de la búsqueda (una por una)
Busca la **página de empleo** de la empresa (WebSearch: `"<empresa> jobs"` o `"<empresa> Stellen"`), ábrela
con WebFetch y revisa **todas** sus ofertas abiertas. Añade las que encajen con la búsqueda y la zona, con
`source` = nombre de la empresa (p. ej. `"Experis"`).

### 2c · Apuntar en la cobertura, nada más terminar cada web o empresa
Actualiza su entrada en `/tmp/cobertura.json`:

| Resultado | Qué poner |
|---|---|
| Revisada | `"status": "ok"`, `"url"` (la página revisada), `"offersReviewed"` (ofertas miradas, puede ser 0), `"offersAdded"` |
| No deja leer (403, captcha…) | `"status": "blocked"` y `"note"` con el motivo |
| No tiene página de empleo | `"status": "not_found"` y `"note"` |
| Otro fallo (404, timeout…) | `"status": "error"` y `"note"` |

Si una web falla, **prueba otra dirección** de esa misma web (otra búsqueda, otra página) antes de marcarla
como `blocked` o `error`. **Nunca** intentes saltarte bloqueos (nada de cambiar el user-agent ni usar proxies).

**Antes de pasar a la siguiente búsqueda**, comprueba que todas sus webs y empresas ya no están en `"pending"`.

## Paso 3 · Comprobar cada oferta candidata

- Debe estar **publicada en los últimos 7 días** (fecha de la página de resultados o de la propia oferta)
  y seguir abierta. Si no hay fecha fiable, descártala.
- Debe estar **en la zona** (`location` ± `radiusKm`).
- No debe estar ya en `jobs.json` (misma URL o mismo puesto + empresa).
- Si la página de la oferta no se abre pero la web la lista hoy con fecha reciente, vale: usa los datos de
  la lista y escribe un `summary` corto basado solo en lo que sabes.

## Paso 4 · Escribir las ofertas nuevas

Escríbelas en `/tmp/candidatas.json` como array JSON (`[]` si no hay ninguna):

```json
{
  "searchId": "frontend-react",
  "title": "Junior Frontend Entwickler (React)",
  "titleEs": "Desarrollador/a Frontend junior (React)",
  "company": "Empresa AG",
  "location": "Winterthur ZH",
  "postedAt": "2026-11-11",
  "source": "jobs.ch",
  "url": "https://www.jobs.ch/...",
  "summary": "1–2 frases en español: qué hace el puesto.",
  "description": "Párrafo en español con las tareas principales.",
  "requirements": ["Requisito 1", "Requisito 2"],
  "workload": "80–100 %",
  "employmentType": "Contrato fijo",
  "salary": "CHF 80'000–95'000",
  "language": "Alemán B2, inglés",
  "de": {
    "title": "Junior Frontend Entwickler (React)",
    "summary": "Dieselbe Zusammenfassung auf Deutsch.",
    "description": "Derselbe Absatz auf Deutsch.",
    "requirements": ["Anforderung 1", "Anforderung 2"],
    "workload": "80–100 %",
    "employmentType": "Festanstellung",
    "language": "Deutsch B2, Englisch"
  }
}
```

- Obligatorios: `searchId`, `title`, `company`, `location`, `postedAt` (YYYY-MM-DD), `source`, `url`, `summary`.
  El resto solo si aparece en la oferta. **No inventes datos.**
- `title` y `company` tal cual aparecen en la oferta. Añade siempre `titleEs` (en español) y `de.title`
  (en alemán; si el original ya está en alemán, el mismo texto).
- `summary`, `description`, `requirements`, `workload`, `employmentType` y `language` **en español** (sin mezclar
  idiomas), y los mismos campos en alemán dentro de `de`.

## Paso 5 · Guardar

```bash
node scripts/update-jobs.mjs /tmp/candidatas.json /tmp/cobertura.json
```

- Si dice **COBERTURA INCOMPLETA**, vuelve al paso 2 y revisa lo que falta. **No sigas hasta que pase.**
- Si hay ofertas inválidas, corrígelas y vuelve a ejecutarlo.
- Guarda `jobs.json` (ofertas) y `coverage.json` (qué se revisó). Luego haz commit y push a `main`, aunque no
  haya ofertas nuevas:

```bash
git add public/data/jobs.json public/data/coverage.json
git commit -m "data: daily job search YYYY-MM-DD (+N)"
git push
```

## Paso 6 · Resumen final

Responde en español con:
1. Ofertas nuevas por búsqueda.
2. Una tabla por búsqueda con **cada web y cada empresa**: estado y ofertas revisadas/añadidas.
3. Las webs o empresas que estaban bloqueadas o sin página de empleo (para que el usuario decida si quitarlas).
4. Si el push se hizo bien.

## Reglas

- Calidad antes que cantidad: máximo ~15 ofertas nuevas por búsqueda y día.
- El usuario vive en Sirnach TG y habla español (nativo), inglés (B2) y alemán (A1). Si una oferta exige
  alemán C1 o nativo, inclúyela igualmente pero indícalo en `language`.
- No modifiques otros archivos del repo (solo `jobs.json` y `coverage.json`).

# Búsqueda diaria de ofertas (instrucciones para Claude)

Estas son las instrucciones que sigue la tarea programada de Claude cada día a las 8:00 (Europe/Zurich).
Si quieres cambiar cómo se busca, cambia este archivo: la tarea lo lee en cada ejecución.

## Pasos

1. Lee `public/data/searches.json`. Usa solo las búsquedas con `"active": true`.
2. Para cada búsqueda, busca ofertas **publicadas en los últimos 7 días** que encajen con
   `title` y `keywords`, en `location` (± `radiusKm`).

   **No te fíes solo del buscador web**: suele devolver anuncios viejos que ya dan 404/410.
   Empieza abriendo con WebFetch las **páginas de resultados de los portales**, ordenadas por fecha,
   y saca de ahí título, empresa, lugar, fecha y enlace de cada oferta:

   - **jobs.ch** (la fuente principal): `https://www.jobs.ch/de/stellenangebote/?term=<TÉRMINO>&location=<LUGAR>&sort-by=date`
     Cada resultado trae fecha de publicación y lugar. Prueba también páginas 2–3 (`&page=2`).
   - **LinkedIn** (empleos públicos, filtro de 7 días): `https://www.linkedin.com/jobs/search/?keywords=<TÉRMINO>&location=<LUGAR>&f_TPR=r604800`
   - **jobscout24.ch**: `https://www.jobscout24.ch/de/jobs/<TÉRMINO>/<LUGAR>/`
   - Webs de empleo de empresas de la zona cuando encajen (Migros, Coop, Denner, Hornbach, Flughafen Zürich,
     Swissport, Gate Group, ISS, etc.).
   - El buscador web (WebSearch) solo como complemento, para descubrir empresas o portales.

   Usa varios términos por búsqueda (el `title` y cada una de las `keywords`) y varios lugares de la zona
   (para Sirnach TG con radio 30–60 km: Sirnach, Wil SG, Frauenfeld, Winterthur, Münchwilen, Uzwil,
   St. Gallen y Zürich si entran en el radio).

   **Mínimo de esfuerzo:** antes de concluir que una búsqueda no tiene ofertas nuevas, revisa al menos
   **3 páginas de resultados de portales** y al menos **10 ofertas candidatas** para esa búsqueda.
   Si un portal falla (404, 403, bloqueo), pasa al siguiente; no te rindas tras los primeros errores.
   No intentes saltarte bloqueos de los portales (nada de cambiar el user-agent ni usar proxies).

3. Comprueba cada oferta candidata: debe tener **fecha de publicación de los últimos 7 días** (de la página
   de resultados o de la propia oferta) y seguir publicada. Si la página de la oferta no se puede abrir pero
   el portal la lista hoy con fecha reciente, vale: usa los datos de la lista y escribe un `summary` corto
   basado solo en lo que sabes (puesto, empresa, lugar, pensum). Descarta las de fuera de la zona.
4. Lee `public/data/jobs.json` y no vuelvas a añadir ofertas que ya estén (misma URL o mismo puesto + empresa).
5. Escribe las ofertas nuevas en `/tmp/candidatas.json` como array JSON con este formato:

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
     "employmentType": "Festanstellung",
     "salary": "CHF 80'000–95'000",
     "language": "Deutsch B2, Englisch",
     "de": {
       "title": "Junior Frontend Entwickler (React)",
       "summary": "Dieselbe Zusammenfassung auf Deutsch.",
       "description": "Derselbe Absatz auf Deutsch.",
       "requirements": ["Anforderung 1", "Anforderung 2"]
     }
   }
   ```

   `title` es el título **original** (sin traducir). Añade siempre `titleEs` (traducido al español) y `de.title`
   (en alemán; si el original ya está en alemán, el mismo texto).

   Obligatorios: `searchId`, `title`, `company`, `location`, `postedAt` (YYYY-MM-DD), `source`, `url`, `summary`.
   El resto solo si aparece en la oferta. **No inventes datos.** `title` y `company` tal cual aparecen en la oferta;
   `summary`, `description` y `requirements` en español, y los mismos tres campos en alemán dentro de `de`
   (la app tiene selector ES/DE). Si la oferta original está en alemán, para `de` usa su propio texto resumido.

6. Ejecuta `node scripts/update-jobs.mjs /tmp/candidatas.json`. El script valida, quita duplicados,
   borra las ofertas de más de 7 días y actualiza `updatedAt`. Si hay inválidas, corrígelas y vuelve a ejecutarlo.
7. Haz commit y push a `main`:
   `git add public/data/jobs.json && git commit -m "data: daily job search YYYY-MM-DD (+N)" && git push`
   Haz commit aunque no haya ofertas nuevas (se actualiza la fecha y se borran las caducadas). 

## Reglas

- Calidad antes que cantidad: máximo ~15 ofertas nuevas por búsqueda y día.
- El usuario vive en Sirnach TG, habla español (nativo), inglés (B2) y alemán (A1). Si una oferta exige
  alemán C1/nativo, inclúyela igualmente pero indícalo en `language`.
- No modifiques otros archivos del repo.

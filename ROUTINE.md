# Búsqueda diaria de ofertas (instrucciones para Claude)

Estas son las instrucciones que sigue la tarea programada de Claude cada día a las 8:00 (Europe/Zurich).
Si quieres cambiar cómo se busca, cambia este archivo: la tarea lo lee en cada ejecución.

## Pasos

1. Lee `public/data/searches.json`. Usa solo las búsquedas con `"active": true`.
2. Para cada búsqueda, busca en la web ofertas **publicadas en los últimos 7 días** que encajen con
   `title` y `keywords`, en `location` (± `radiusKm`). Fuentes por orden de preferencia:
   - jobs.ch, jobup.ch, jobscout24.ch, indeed.ch, linkedin.com/jobs, job-room.ch (RAV), stepstone.ch
   - páginas de empleo de las propias empresas (Migros, Coop, Denner, Hornbach, Flughafen Zürich, etc.)
3. Abre cada oferta candidata para comprobar que **existe, sigue abierta** y tiene fecha de publicación.
   Descarta las que no tengan fecha fiable, estén cerradas o sean de fuera de la zona.
4. Lee `public/data/jobs.json` y no vuelvas a añadir ofertas que ya estén (misma URL o mismo puesto + empresa).
5. Escribe las ofertas nuevas en `/tmp/candidatas.json` como array JSON con este formato:

   ```json
   {
     "searchId": "frontend-react",
     "title": "Junior Frontend Developer (React)",
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
     "language": "Deutsch B2, Englisch"
   }
   ```

   Obligatorios: `searchId`, `title`, `company`, `location`, `postedAt` (YYYY-MM-DD), `source`, `url`, `summary`.
   El resto solo si aparece en la oferta. **No inventes datos.** `title` y `company` tal cual aparecen en la oferta;
   `summary`, `description` y `requirements` traducidos al español.

6. Ejecuta `node scripts/update-jobs.mjs /tmp/candidatas.json`. El script valida, quita duplicados,
   borra las ofertas de más de 7 días y actualiza `updatedAt`. Si hay inválidas, corrígelas y vuelve a ejecutarlo.
7. Haz commit y push a `main`:
   `git add public/data/jobs.json && git commit -m "data: daily job search YYYY-MM-DD (+N)" && git push`
   Haz commit aunque no haya ofertas nuevas (se actualiza la fecha y se borran las caducadas). 

8. **Si la ejecución la lanzó el botón "Buscar ahora"** (se abrió un issue cuyo título empieza por `[buscar]`):
   cuando termines, comenta en ese issue el resultado (p. ej. "3 ofertas nuevas: …") y ciérralo.
   Si hay varios issues `[buscar]` abiertos, haz una sola búsqueda y ciérralos todos.

## Reglas

- Calidad antes que cantidad: máximo ~15 ofertas nuevas por búsqueda y día.
- El usuario vive en Sirnach TG, habla español (nativo), inglés (B2) y alemán (A1). Si una oferta exige
  alemán C1/nativo, inclúyela igualmente pero indícalo en `language`.
- No modifiques otros archivos del repo.

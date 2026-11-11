# Cv-Locator

A personal job radar. Every morning at 08:00 (Europe/Zurich) a scheduled AI agent searches the web for new job
offers that match my saved searches, and this React app shows them as cards.

- **New jobs**: offers published in the last 7 days that I haven't applied to yet.
- **Applied**: offers I marked as applied (kept even after they expire from the feed).
- Click a card for details, requirements and the link to apply.

## How it works

```
08:00 scheduled agent ──▶ reads public/data/searches.json
                          searches job boards (jobs.ch, LinkedIn, Indeed, …)
                          node scripts/update-jobs.mjs  (validate, dedupe, drop > 7 days)
                          commits public/data/jobs.json
                                   │
                          GitHub Actions builds & deploys to GitHub Pages
                                   │
React app ◀── fetch data/jobs.json ┘   applied state ── localStorage
```

## Tech stack

React 19 · TypeScript · Vite · CSS Modules · native `<dialog>` · GitHub Actions · GitHub Pages

## Project structure

```
public/data/searches.json   my saved searches (edit to add/remove)
public/data/jobs.json       offers found by the daily search
scripts/update-jobs.mjs     merges new offers, dedupes, removes expired ones
ROUTINE.md                  instructions the daily agent follows
src/hooks/                  useJobData (fetch), useApplied (localStorage)
src/components/             Header, SearchFilter, JobGrid, JobCard, JobDetail
```

## Run locally

```bash
npm install
npm run dev
```

## Adding a search

Add an entry to `public/data/searches.json`:

```json
{ "id": "frontend-react", "title": "Frontend Developer", "keywords": ["React", "TypeScript"],
  "location": "Sirnach TG", "radiusKm": 60, "active": true }
```

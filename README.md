# Community Christmas — Event Map

A proximity-based event finder for [Marmalade Trust](https://www.marmaladetrust.org/community-christmas)'s Community Christmas initiative. Helps adults who would otherwise be alone on Christmas Day find a local meal, activity, or welcoming space near them.

Built by volunteers as part of the [Student Tech Alliance](https://www.studenttechalliance.org/) programme.

---

## Stack

| Layer | Tool |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 + TypeScript |
| Styling | Tailwind CSS v4 |
| Map | Leaflet.js + react-leaflet + OpenStreetMap tiles |
| Postcode lookup | Postcodes.io (free, no API key) |
| Data fetching | TanStack Query |
| Data source (dev) | Google Sheets → Apps Script JSON API |
| Data source (prod) | HubSpot API |
| Hosting | Vercel |

---

## Getting started

```bash
npm install
```

Copy the environment file and add your Google Sheets API URL:

```bash
cp .env.example .env.local
```

```env
# .env.local
SHEETS_API_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project structure

```
app/
  api/events/route.ts   # Route handler — fetches + shapes event data
  page.tsx              # Homepage / map page
  layout.tsx            # Root layout, Montserrat font, design tokens
  globals.css           # Design system tokens (colours, radii, breakpoints)
  providers.tsx         # TanStack Query client provider

resources/              # Local-only, gitignored
  dummy_events.csv      # 40 dummy events for dev (import to Google Sheets)
  sheets_api.gs         # Apps Script web app (deploy via Extensions → Apps Script)
```

---

## Data flow

**Development:**
```
Google Sheet → Apps Script web app → /api/events route handler → map frontend
```

**Production (planned):**
```
HubSpot CRM → HubSpot API → /api/events route handler → map frontend
```

The route handler is the only thing that changes at production cutover — the frontend stays the same.

---

## Design system

All tokens live in `app/globals.css` and are exposed as Tailwind utilities via `@theme inline`.

```
bg-navy        text-sage        border-amber
bg-off-white   text-ink         rounded-card
bg-hover-tint  text-mid-grey    rounded-chip
```

Full token reference is in `app/globals.css`. Figma file: [Marmalade Trust design system](https://www.figma.com/design/WeHP2NBtlFV5TeBBQbwL9J/Marmalade-Trust?node-id=287-3).

---

## Git workflow

- All development happens on `dev`
- Each feature ships via a PR from `dev` → `main`
- `main` is always deployable

---

## Local-only files

The following are in `.gitignore` and exist only on your machine:

- `resources/dummy_events.csv` — dummy event data; import to Google Sheets via File → Import
- `resources/sheets_api.gs` — Apps Script source; deploy via Extensions → Apps Script → Deploy → Web app
- `PROJECT_CONTEXT.md` — full project context for AI-assisted development sessions

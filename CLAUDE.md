# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install       # Install dependencies
npm run dev       # Start dev server at http://localhost:3000 (auto-opens browser)
npm run build     # Production build to dist/ (also runs TypeScript via Vite)
npm run preview   # Preview production build
```

There is no test runner or linter configured in this project.

## Architecture

**TenderFlow** ("TenderPulse") is a single-page React app for managing government tenders (licitaciones). The UI language is Spanish.

### Data Flow

1. On mount, `App.tsx` calls `apiService.getTenders()` which hits an AWS API Gateway endpoint
2. Successful responses are saved to `localStorage` (`tenderpulse_cache`) for offline fallback
3. If the API fails or returns nothing, the app falls back to cached data, then to `MOCK_TENDERS` from `constants.ts`
4. Status updates use `PATCH /{id}?date={date}` — the DynamoDB table has a composite key: `id` (partition) + `date` (sort key)
5. Bulk import via `apiService.bulkAddTenders()` — deduplicates by id, merges into cache, and optionally POSTs each new tender to the API

### State Management

All application state lives in `App.tsx` with React hooks. There is no external state library. Key state:
- `tenders` — current tender list (from API, cache, or mock)
- `activeView` — controls which tender status bucket is shown (`ViewType`)
- `selectedTender` — triggers the `TenderDetail` slide-over panel
- `syncStatus` — tracks API sync state (`synced | syncing | error`)
- `theme` — persisted to `localStorage` as `tenderpulse_theme`, applied via `dark` class on `<html>`

### Core Types (`types.ts`)

- `Tender` — `{ id, title, issuer, description, value, date, status }`
- `UserRole` — `'admin' | 'editor' | 'viewer'` (viewers cannot mutate status)
- `ViewType` — `'inbox' | 'interested' | 'in_process' | 'trash' | 'bulk_import' | 'users' | 'settings'`

Tender statuses map to views: `new` → inbox, `interested`, `in_process`, `trash`.

### Key Files

| File | Purpose |
|------|---------|
| `App.tsx` | Root component, all state, data loading, layout |
| `types.ts` | All shared TypeScript types |
| `constants.ts` | `MOCK_TENDERS` and `MOCK_USERS` (fallback data) |
| `services/apiService.ts` | AWS API Gateway fetch, cache, normalization |
| `services/geminiService.ts` | Stub — AI service was removed, always returns `null` |
| `components/Sidebar.tsx` | Navigation between views |
| `components/TenderCard.tsx` | Card in the grid; triggers status changes inline |
| `components/TenderDetail.tsx` | Full-screen slide-over panel for a single tender |
| `components/UserManagement.tsx` | Role management UI (only functional in-memory) |
| `components/BulkImport.tsx` | JSON paste/file upload for bulk tender ingestion |
| `components/Settings.tsx` | Theme toggle |
| `components/Button.tsx` | Shared button with `variant` prop (`primary | success | danger | ghost`) |

### Path Alias

`@/` resolves to the project root (e.g., `import { Tender } from '@/types'`).

### Styling

Tailwind CSS v3 is installed as a PostCSS plugin (not CDN). Config is in `tailwind.config.cjs` (`.cjs` extension required because `package.json` has `"type": "module"`). PostCSS is configured via `postcss.config.cjs`. Tailwind directives and the `glass-effect` custom class live in `index.css`, which is imported at the top of `index.tsx`.

The `tailwindcss-animate` plugin is installed and registered in `tailwind.config.cjs` — it provides the `animate-in`, `fade-in`, `slide-in-from-*` utilities used in App.tsx and TenderDetail.tsx. Dark mode is class-based (`dark:` prefix), toggled by adding/removing the `dark` class on `<html>` in App.tsx.

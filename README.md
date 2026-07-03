# Siyakhisana — Building Together

A neighbourhood lending community. Borrow the drill instead of buying it; lend the ladder
you only use twice a year. Built for the Founder Capstone.

## 🔗 Live site
**https://siyakhisana-capstone.vercel.app/.

## Run locally
```bash
npm install
npm run dev
```
- `npm run typecheck` — strict TypeScript, no `any`
- `npm run build` — production build

## What this is
Four things, done well, over a typed mock-API data layer:
1. **Browse** — search + category filter + free/paid filter + sort, all pure.
2. **Item detail** — handles every messy-data case (no photo, no rating, paused, unknown distance).
3. **Booking** — a two-step flow (dates → confirm) ending in a clear confirmation.
4. **Honest sign-up** — browse freely; we only ask who you are when you book.

## What I chose NOT to build
Fake "3 people looking now" urgency, forced signup walls, and fabricated activity — all refused
as trust-damaging dark patterns. See `FOUNDER-RESPONSE.md`.

## The thinking (the heart of this project)
- `FOUNDER-RESPONSE.md` — my pushback to the founder.
- `DECISION-LOG.md` — the real architectural decisions and their tradeoffs.
- `AI-USAGE.md` — where I used AI, and where I had to out-think it.

## Architecture notes
- **State:** one `useReducer` machine (`src/state/appState.ts`) with a discriminated-union
  action type and a `never` exhaustiveness guard.
- **Business logic** (`src/lib/`) is pure and separate from UI, so rules can change without
  touching components.
- **Data** (`src/data/`) is treated as an API contract you don't control; the loader is a fake
  async fetch modelled as a `Loadable<T>` union.
- No router library — navigation is a typed `Route` union rendered by a switch.

## Stack
Vite · React 18 · TypeScript (strict) · hand-written CSS (no UI framework).

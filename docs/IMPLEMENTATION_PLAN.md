# LOCA Implementation Plan

## Stack

Vite, React, TypeScript strict mode, React Router, Tailwind CSS v4, TanStack Query, Supabase JS, React Hook Form, Zod, Lucide React, qrcode.react, Vite PWA, Vitest, Testing Library, and Playwright. `pnpm` is preferred by spec, but this machine does not have `pnpm`, so the project uses `npm`.

## Folder Structure

The app follows the requested feature/component/repository layout under `src/`, with Supabase migrations in `supabase/migrations`, docs in `docs`, and E2E tests in `tests/e2e`.

## Routes

`/welcome`, `/auth`, `/home`, `/explore`, `/create/experience`, `/places/:placeId`, `/library`, `/maps/new`, `/maps/:mapId`, `/u/:handle`, `/share/experience/:token`, `/share/map/:token`, `/admin`.

## Data Flow

Pages use TanStack Query against a `LocaRepository` contract. Demo mode and Supabase mode share the same UI contract so the UI does not branch into separate fake screens.

## Supabase

Migrations create profiles, places, experiences, media, tags, saved places, taste maps, saves, reports, featured content, and recent views with RLS policies. Storage setup is documented separately. The frontend repository contract is Supabase-ready, but the production Supabase data adapter is intentionally incomplete beyond auth in this MVP.

## Demo Mode

`VITE_DATA_MODE=demo` uses Korean fixtures and localStorage. It supports publishing an experience, saving places, creating maps, share cards, admin moderation, list/map view toggles, and auth-return flows.

## Implementation Order

1. Scaffold, Git, docs, design system.
2. Tokens, app shell, routes, PWA.
3. Repository contract, demo repository, fixtures.
4. Home, explore, create sheet.
5. Experience creation.
6. Place detail.
7. Library.
8. Taste map creation and detail.
9. Sharing, profile, admin.
10. Supabase migration and setup docs.
11. Tests, screenshots, QA report.

## Test Plan

Run `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build`, and `npm run test:e2e`. Playwright also captures the required 390x844 screenshots.

## Risks

- External map credentials are absent: use Demo map provider and document Naver setup.
- Supabase credentials are absent: demo mode is full-fidelity locally, production warns if demo mode is enabled.
- Video upload cannot be transcoded in-app: MIME, size, duration, poster, and retry rules are documented.

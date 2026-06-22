# QA Report

Final verification ran on 2026-06-22.

## Passed

- `npm run lint`: Biome checked 67 files with no fixes required.
- `npm run typecheck`: `tsc -b` completed with no TypeScript errors.
- `npm run test`: Vitest passed 1 file / 3 tests.
- `npm run build`: Vite/PWA production build completed.
- `npm run test:e2e`: Playwright passed 12 tests across Chromium mobile and WebKit mobile.
- `npm run react:doctor`: exited 0 with warnings only.

## Screenshots

All Playwright screenshots are viewport captures at 1170x2532 pixels, matching the 390x844 mobile viewport at device scale 3:

- `artifacts/screenshots/01-home.png`
- `artifacts/screenshots/02-explore.png`
- `artifacts/screenshots/03-create-sheet.png`
- `artifacts/screenshots/04-create-experience.png`
- `artifacts/screenshots/05-place-detail.png`
- `artifacts/screenshots/06-library.png`
- `artifacts/screenshots/07-create-map.png`
- `artifacts/screenshots/08-map-detail-list.png`
- `artifacts/screenshots/09-map-detail-map.png`
- `artifacts/screenshots/10-profile.png`

Visual QA checked loaded content, dark form controls, bottom navigation spacing, create-sheet visibility, and no horizontal overflow at 360, 390, and 430 px widths.

## Warnings

- Vite reports one JavaScript chunk above 500 KB after minification.
- React Doctor reports 23 advisory warnings. The Supabase RLS policy rule is configured as a warning because the MVP is single-tenant; write policies are still scoped to authenticated `auth.uid()` checks.
- LSP diagnostics could not run because the LSP transport closed in this session. `npm run typecheck` passed and is the authoritative TypeScript gate here.

## Not Production-Complete

- Demo mode is complete for MVP flows.
- Supabase migrations, RLS, setup docs, and auth shell are present, but the Supabase data repository beyond auth intentionally throws configuration errors until real query/upload adapters are implemented.

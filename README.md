# LOCA Social MVP

LOCA is a mobile-first PWA for place-bound records, saved places, and shareable taste maps.

> 장소를 기록하고 취향 지도로 나누는 모바일 PWA

This workspace uses React, Vite, TypeScript, React Router, TanStack Query, React Hook Form, Zod, Supabase, Kakao map configuration, Vitest, and Playwright.

## Local Development

This machine uses `npm`.

```bash
npm install
npm run dev
```

Default local mode is demo mode with Korean fixture data:

```text
VITE_DEMO_MODE=true
VITE_DATA_MODE=demo
VITE_MAP_PROVIDER=demo
```

Open the app at `http://127.0.0.1:5173/home`.

## Production-Backed Mode

Supabase mode requires real credentials:

```text
VITE_DEMO_MODE=false
VITE_DATA_MODE=supabase
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

Kakao Maps mode requires:

```text
VITE_MAP_PROVIDER=kakao
VITE_KAKAO_JAVASCRIPT_KEY=...
```

The app must not fake successful production reads or writes when required credentials or repository capabilities are missing.

## Deployment

LOCA deploys as a static Vite PWA. Vercel and Netlify config files are included for SPA route rewrites, immutable asset caching, and basic browser security headers.

```bash
npm ci
npm run deploy:check
```

Use `npm run preview:prod` to inspect the built app locally. See `docs/DEPLOYMENT.md` for environment variables and platform setup.

## Owner Setup Checklist

Before production-backed QA, the project owner needs to:

- Create a Supabase project and apply migrations in order.
- Enable `pgcrypto` and `postgis`.
- Create Storage buckets: `avatars`, `experience-media`, `map-covers`, `event-covers`.
- Add one admin account through `user_roles` or the legacy `profiles.role` fallback.
- Create a Kakao Developers app, enable Maps JavaScript API, and register local/preview/production domains.
- Add deployment platform environment variables for Supabase, Kakao, and demo-mode flags.
- Decide whether invite/share tokens are stored as raw UUIDs for MVP QA or hashed before production.

## Main Routes

- `/home`: personal record rhythm
- `/feed`: public place-record feed
- `/create/experience`: default `+` action
- `/explore`: local opportunities and recommendations
- `/me`: my space
- `/places/:placeId`: place detail
- `/maps/new`: create map
- `/maps/:mapId`: map detail
- `/u/:handle`: public profile
- `/admin`: operator console

Legacy `/library` and `/myspace` redirect to `/me`.

## Verification

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run deploy:check
npm run test:e2e
```

The Playwright suite includes mobile-width overflow checks and screenshot captures.

## Docs

- `DESIGN.md`
- `docs/PRODUCT_PLAN.md`
- `docs/ARCHITECTURE.md`
- `docs/DATA_MODEL.md`
- `docs/SUPABASE_SETUP.md`
- `docs/KAKAO_MAP_SETUP.md`
- `docs/RLS_MATRIX.md`
- `docs/MEDIA_UPLOAD.md`
- `docs/QA_CHECKLIST.md`
- `docs/MAP_PROVIDER_SETUP.md`
- `docs/RUNBOOK.md`
- `docs/KNOWN_LIMITATIONS.md`
- `docs/DEPLOYMENT.md`

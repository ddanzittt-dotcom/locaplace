# LOCA Runbook

## Local Run

Install dependencies with `npm install`, copy `.env.example` to `.env.local`, then run `npm run dev`.

## Demo Mode

Use `VITE_DATA_MODE=demo`. Demo data is Korean fixture data and persists in browser localStorage. Clear site data to reset.

## Supabase Connection

Set `VITE_DATA_MODE=supabase`, `VITE_SUPABASE_URL`, and `VITE_SUPABASE_ANON_KEY`. Apply migrations before opening the app. This MVP includes Supabase schema/RLS/auth scaffolding, but the production data adapter is not complete beyond auth and will throw configuration errors for read/write content flows until implemented.

## Migration

Run the SQL files in `supabase/migrations` through Supabase CLI or the dashboard SQL editor.

## Storage

Create `experience-media` as a private bucket. Enforce MIME, size, and duration limits before upload. Use signed URLs for non-public media.

## Admin

Demo mode supports `admin@loca.test` for report review, hide, and restore flows. Production admin moderation should be implemented through trusted server-side code or Supabase Edge Functions before enabling real admin operations.

## Operations

Use Supabase logs for API and auth failures. Back up Postgres regularly before migrations. For rollback, redeploy the previous static build and restore the database from a snapshot if schema migration caused data damage.

## Handoff

New developers should read `docs/PRODUCT_SPEC.md`, `docs/IMPLEMENTATION_PLAN.md`, `docs/DATA_MODEL.md`, and this runbook before editing code.

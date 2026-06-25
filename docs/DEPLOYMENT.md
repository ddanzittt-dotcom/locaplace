# Deployment

LOCA deploys as a static Vite PWA. The production build emits `dist/`, and client-side routes must fall back to `index.html`.

## Runtime

- Package manager: `npm`
- Node: `^20.19.0 || >=22.12.0`
- Build command: `npm run build`
- Output directory: `dist`

## Local Release Check

```bash
npm ci
npm run deploy:check
npm run preview:prod
```

`deploy:check` runs lint, typecheck, unit tests, and the production build. Run `npm run test:e2e` before a real launch or after UI-affecting changes.

## Vercel

`vercel.json` is included.

1. Import the repository in Vercel.
2. Keep the detected framework as Vite.
3. Use `npm ci`, `npm run build`, and `dist`.
4. Add environment variables from the mode you are deploying.
5. Deploy.

## Netlify

`netlify.toml` is included.

1. Import the repository in Netlify.
2. The included config sets Node 22, `npm run build`, and `dist`.
3. Add environment variables from the mode you are deploying.
4. Deploy.

## Environment Modes

Demo preview:

```text
VITE_DEMO_MODE=true
VITE_DATA_MODE=demo
VITE_MAP_PROVIDER=demo
```

Production-backed deploy:

```text
VITE_DEMO_MODE=false
VITE_DATA_MODE=supabase
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_MAP_PROVIDER=kakao
VITE_KAKAO_JAVASCRIPT_KEY=...
```

Supabase mode must have real credentials. If required Supabase values are missing, the app raises a repository configuration error instead of showing fake success.

## Owner Checklist

- Create the Supabase project and apply migrations in order.
- Create the required Supabase Storage buckets documented in `docs/SUPABASE_SETUP.md`.
- Create a Kakao Developers app, enable Maps JavaScript API, and register local, preview, and production domains.
- Add the production domain to the hosting platform and Kakao allowed domains.
- Re-run `npm run deploy:check` and `npm run test:e2e` before launch.

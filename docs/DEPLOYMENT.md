# Deployment

1. Run `npm run lint`.
2. Run `npm run typecheck`.
3. Run `npm run test`.
4. Run `npm run build`.
5. Run `npm run test:e2e`.
6. Deploy `dist/` to a static host.
7. Set production env vars for Supabase and map provider.

Production should not rely on demo mode for real users. If `VITE_DATA_MODE=demo` is enabled in production, the app displays a warning badge.

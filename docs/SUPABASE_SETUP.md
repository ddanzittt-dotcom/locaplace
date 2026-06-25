# Supabase Setup

1. Create a new Supabase project.
2. Copy the URL and anon key into `.env.local`.
3. Apply migrations from `supabase/migrations`.
4. Create storage buckets:
   - `avatars`
   - `experience-media`
   - `map-covers`
   - `event-covers`
5. Configure email magic links in Supabase Auth.
6. Optional: configure Google OAuth provider and add redirect URLs.
7. Set `VITE_DEMO_MODE=false` and `VITE_DATA_MODE=supabase`.

Never expose the service role key in the frontend. Storage downloads for private and unlisted content should be served through signed URLs or an Edge Function.

Required extensions:

- `pgcrypto`
- `postgis`

Required production checks:

- Migrations apply in order from `supabase/migrations`.
- RLS is enabled on all public tables.
- `app_private.is_admin()` is available; `authenticated` has schema usage plus function execute only.
- `nearby_places` and `nearby_events` return distance-ordered rows.
- Storage policies allow users to write only under their own scoped paths.

Current MVP status: migrations, RLS policies, env wiring, and auth shell are present. Content reads, uploads, map creation, saves, sharing, profiles, and admin operations still need a real Supabase repository implementation before production use.

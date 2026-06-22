# Supabase Setup

1. Create a new Supabase project.
2. Copy the URL and anon key into `.env.local`.
3. Apply migrations from `supabase/migrations`.
4. Create a private storage bucket named `experience-media`.
5. Configure email magic links in Supabase Auth.
6. Optional: configure Google OAuth provider and add redirect URLs.
7. Set `VITE_DATA_MODE=supabase`.

Never expose the service role key in the frontend. Storage downloads for private and unlisted content should be served through signed URLs or an Edge Function.

Current MVP status: the migration, RLS policies, env wiring, and auth shell are present. Content reads, uploads, map creation, saves, sharing, profiles, and admin operations still need a real Supabase repository implementation before production use.

# Known Limitations

- Demo mode stores media metadata and gradient placeholders, not binary uploads.
- Supabase mode has schema, RLS, setup docs, and basic auth scaffolding, but the full data adapter is not complete beyond auth.
- Production Supabase storage requires bucket policies and signed URL handling before real private media is safe.
- Production admin moderation should use trusted server-side code or Edge Functions, not broad browser-issued admin RLS writes.
- Naver Maps is documented and abstracted, but the real adapter is not enabled without credentials.
- Kakao sharing is documented as an adapter point and falls back to Web Share API plus link copy.
- Video support is limited to browser-compatible MIME types, max duration, max file size, poster metadata, and retry UX; no transcoding is included.

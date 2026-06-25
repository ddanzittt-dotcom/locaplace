# LOCA Media Upload

LOCA supports media only as part of a place-bound experience. Media upload must never create an unplaced social post.

## Supported Media

| Type | MVP Support | Limits |
|---|---|---|
| Image | 1 to 5 files | `VITE_MAX_IMAGE_BYTES`, long edge target 1600px before upload when browser APIs allow. |
| Video | 1 file | `VITE_MAX_VIDEO_SECONDS`, `VITE_MAX_VIDEO_BYTES`, muted playback, `playsInline`, poster required. |
| Mixed image + video | Deferred | Excluded from first MVP pass. |

## Environment Variables

```text
VITE_ENABLE_VIDEO_UPLOAD=true
VITE_MAX_VIDEO_SECONDS=15
VITE_MAX_VIDEO_BYTES=52428800
VITE_MAX_IMAGE_BYTES=10485760
```

## Client Validation

Before upload:

1. Check MIME type against the allowlist.
2. Check file size.
3. For video, check duration when metadata is available.
4. For images, resize/compress where possible.
5. Generate or collect width/height metadata.
6. Create a client idempotency key or client-generated UUID so retries do not duplicate posts.

## Storage Paths

```text
experience-media/{user_id}/{experience_id}/{file_id}
map-covers/{user_id}/{map_id}/{file_id}
avatars/{user_id}/{file_id}
event-covers/{event_id}/{file_id}
```

The browser uses only the Supabase anon key and authenticated user session. Service role keys are never exposed.

## Upload Flow

1. User selects media.
2. Client validates and prepares metadata.
3. User selects or creates a place.
4. Client creates the experience row with an idempotency key.
5. Client uploads media to the scoped Storage path.
6. Client inserts `experience_media` rows.
7. Repository upserts `user_places` with `source_type = recorded`.
8. Query cache invalidates home, feed, place detail, and my space.
9. Success toast links to the place or my space.

If upload fails after the experience row is created, the UI must show retry/cancel. Cleanup should either remove orphan media rows or mark the experience hidden/deleted after failed retries.

## Playback Rules

- Feed videos are muted and `playsInline`.
- Use IntersectionObserver so only the visible story plays.
- Pause videos when they leave the viewport.
- Never autoplay audio.
- Respect reduced-motion where animation is not essential to media playback.

## Demo Mode

Demo mode may store fixture media names and bundled public demo assets. It must stay visibly labeled as Demo Mode and must not imply that Supabase Storage succeeded.

## Known Gaps

- Browser-side image compression is not yet fully implemented.
- Resumable upload wiring is not yet production-complete.
- Poster generation is documented but not production-complete.
- Storage bucket policies must be applied and tested in Supabase before production use.

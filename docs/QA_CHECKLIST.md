# LOCA QA Checklist

Use this checklist before claiming an MVP milestone is complete.

## Local Gates

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
```

Expected result: all commands exit 0. Existing bundle-size warnings are tracked separately and do not replace functional QA.

## Mobile Viewports

Check both:

- 360x800
- 390x844

For each:

- No horizontal overflow.
- Bottom tab stays visible and tappable.
- Touch targets are at least 44px.
- Korean headings and labels do not clip.
- Safe-area spacing does not hide primary actions.

## Core User Flows

| Flow | Evidence |
|---|---|
| Sign in and create profile/demo viewer | Auth route reaches home; viewer appears in shell. |
| Home calendar | Week/month/year controls switch and show record counts. |
| Create experience | File validation, place selection, caption, tags, visit date, visibility, publish. |
| Place detail | New public record appears on place page. |
| Feed | Public active records render as one full-screen story per slide. |
| Save place | `담기` stores place once and does not copy original media/caption. |
| My space | Saved places and maps appear under `/me`. |
| Create map | Saved places can be ordered and published into a map. |
| Map detail | List/map view toggles. |
| Share | Web share/clipboard/QR route works where supported. |
| Explore | Search, events/programs, recommended maps, and recommended places render. |
| Admin | Reported content can be hidden and restored. |

## Supabase Production Checks

- Missing credentials do not produce fake success.
- Migrations apply cleanly to a new project.
- RLS is enabled on every public table.
- Anonymous users cannot read private or unlisted data through normal SELECT.
- Authenticated users cannot read another user's `user_places`.
- Contributors cannot edit other contributors' map items.
- Admin-only policies require `app_private.is_admin()`.
- Service role keys are absent from browser bundles.

## Kakao Maps Checks

- `VITE_MAP_PROVIDER=kakao` loads the Kakao JavaScript SDK only when key is present.
- Keyword search returns provider-neutral place candidates.
- Current location only ranks suggestions; it is not published.
- Direct pin selection can resolve an address.
- Kakao allowed domains include local, preview, and production origins.

## Media Checks

- Images reject unsupported MIME and oversized files.
- Videos reject unsupported MIME, oversized files, and overlong duration.
- Upload retry does not duplicate experiences.
- Feed video autoplays only when visible, muted, and inline.
- Private media is not public via Storage URL.

## Accessibility

- Main navigation has labels.
- Icon-only buttons have labels.
- Forms have visible labels and field-level errors.
- Keyboard focus ring is visible.
- Color is not the only state indicator.

## Release Evidence

Attach or update:

- Playwright screenshots under `artifacts/screenshots`.
- Any manual QA screenshots under `artifacts/qa`.
- `docs/QA_REPORT.md` with the commands and viewports tested.
- Known gaps in `docs/KNOWN_LIMITATIONS.md`.

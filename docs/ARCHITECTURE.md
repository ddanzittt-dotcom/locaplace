# LOCA Architecture

## 1. Architecture Goals

LOCA is built as a mobile-first PWA with a strict repository boundary. UI screens call a shared domain contract; demo mode and Supabase mode implement that contract differently without branching the product UI into fake screens.

The architecture must support:

- place-bound experiences;
- saved places that preserve source attribution without copying content;
- maps made from ordered places;
- public, unlisted, and private visibility;
- Supabase Auth, Postgres, RLS, and Storage;
- Kakao Maps and Local Search through an adapter;
- local demo mode with Korean fixtures.

## 2. Runtime Layers

```text
React pages
  -> feature components
  -> hooks and shared UI primitives
  -> LocaRepository contract
  -> DemoRepository or SupabaseRepository
  -> localStorage fixtures or Supabase/PostGIS/Storage
```

### UI Layer

- `src/routes/AppRoutes.tsx` owns route mapping.
- `src/components/navigation` owns the mobile shell, bottom tabs, and create sheet.
- `src/features/*` owns page-level flows.
- `src/components/common` owns reusable chips, sections, empty states, media surfaces, and share UI.
- `src/index.css` centralizes global tokens and app-wide component styling.

### Domain Layer

- `src/types/domain.ts` defines shared domain models.
- `src/repositories/contracts/loca-repository.ts` defines reads and mutations available to pages.
- `src/repositories/contracts/errors.ts` defines configuration errors that prevent fake production success.

### Data Layer

- `src/repositories/demo` implements a local `localStorage` repository for demo mode.
- `src/repositories/supabase` owns Supabase client wiring and production repository behavior.
- `supabase/migrations` owns database schema, indexes, helper functions, and RLS policies.

## 3. Mode Selection

Environment variables choose runtime behavior:

- `VITE_DEMO_MODE=true`: force `DemoRepository`; fixture-backed UI is allowed and visibly labeled.
- `VITE_DATA_MODE=demo`: use `DemoRepository` when the explicit demo flag is not set.
- `VITE_DATA_MODE=supabase`: use Supabase client and production repository methods.
- Missing Supabase credentials in Supabase mode must raise `RepositoryConfigError`.
- `VITE_MAP_PROVIDER=demo`: use a static map/search adapter.
- `VITE_MAP_PROVIDER=kakao`: use Kakao Maps JavaScript SDK and Kakao Local Search when keys are present.

The browser must never receive Supabase service role keys or other secrets.

## 4. Data Model

Core tables follow the request document:

- `profiles`
- `places`
- `experiences`
- `experience_media`
- `user_places`
- `maps`
- `map_items`
- `map_members`
- `map_invites`
- `map_saves`
- `events`
- `featured_content`
- `reports`
- `user_roles`

`places.location` and optional `experiences.precise_location` use PostGIS geography points. Provider-backed places use `(provider, provider_place_id)` uniqueness. User-created places use normalized name, nearby radius checks, and address similarity to reduce duplicates.

## 5. Visibility And Sharing

Visibility values are `public`, `unlisted`, and `private`.

- Public active records and maps can appear in feed, place pages, public profiles, and search.
- Private records and maps are owner-only.
- Unlisted records and maps are excluded from direct public table SELECT policies and must be accessed through token-based routes/RPC with minimal returned data.

Sharing support is layered:

1. Web Share API when available.
2. Clipboard link copy fallback.
3. QR code rendering.
4. Kakao share adapter only when public configuration is present.

## 6. Media Architecture

Experience media supports:

- 1 to 5 images, resized client-side before upload where possible;
- one short video up to the configured duration/size;
- MIME and size validation before upload;
- poster metadata for video;
- upload progress, cancellation, and retry states;
- storage paths under `experience-media/{user_id}/{experience_id}/{file_id}`.

Mixed image/video upload can be excluded from the first MVP pass.

## 7. Map Provider Architecture

Map features are behind an adapter so the UI can run in demo mode without Kakao credentials.

Required provider capabilities:

- keyword place search;
- nearby place search from current coordinates;
- address search;
- reverse geocoding from coordinates;
- map pin preview and adjustment;
- candidate distance display.

The app must use current location only for suggestions. It must not automatically disclose the user's current stay or exact coordinates.

## 8. Security Architecture

All public tables must enable RLS.

Important policy rules:

- profiles are publicly readable but self-editable only;
- public active experiences are readable, private experiences are owner-only, unlisted experiences are token-only;
- user places are owner-only;
- public active maps are readable, private maps are owner/member-only, unlisted maps are token-only;
- map contributors can insert items and modify/delete only items they added;
- admin-only content management is guarded by an `is_admin()` helper in a secure schema;
- reports can be created by signed-in users and processed by admins.

Security-definer functions must have limited execution grants and must not leak broader table access.

## 9. Admin Architecture

Admin screens are operational, not social. They support:

- user and place lookup;
- direct place review/edit;
- hiding and restoring public records and maps;
- report handling;
- event CRUD;
- featured content management;
- tag management;
- content ID and author lookup.

Admin operations go through repository methods and must be auditable in future migrations.

## 10. Testing And QA

Required gates:

- Biome lint/format checks.
- TypeScript project build.
- Vitest unit/component tests.
- Playwright E2E for core MVP flows.
- Production Vite build.
- Mobile visual QA at 360x800 and 390x844.

Visual QA must verify Korean text wrapping, no horizontal overflow, bottom safe-area behavior, focus states, and demo/prod mode clarity.

## 11. Current Implementation Notes

The current workspace already includes a React/Vite app shell, repository contract, demo repository, Supabase migration, Korean demo fixtures, bottom navigation, home/feed/explore/create/place/my-space/map/profile/admin screens, tests, and screenshots.

Known architectural gaps remain:

- Supabase production repository methods are incomplete beyond auth and intentionally throw configuration/capability errors.
- Kakao map adapter is not yet fully implemented.
- The requested final documentation set is only partially present.
- Collaborative map invite flows and token-only unlisted share paths need production implementation.

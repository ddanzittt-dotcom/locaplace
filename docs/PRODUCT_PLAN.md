# LOCA Product Plan

## 1. Product Promise

LOCA is a mobile-first place archive where people record a place with a photo or short video, save places from public records, and bundle saved places into shareable maps.

Core message:

> 장소를 남기고, 취향을 지도로 나누다.

The MVP must make three actions obvious:

- 남기기: create a place-bound experience with media, caption, tags, visit date, and visibility.
- 담기: save a place without copying another user's media or caption.
- 묶기: create a map from saved places and share it.

## 2. MVP Scope

The product is not a static mock. It must run as a React/Vite PWA with a real repository boundary, Supabase-backed production paths, and explicit demo mode for local development when external credentials are missing.

Demo mode may use Korean fixtures and `localStorage`. Supabase mode must not show fake success for unimplemented or misconfigured capabilities.

## 3. Primary Navigation

The bottom tab order is fixed:

```text
홈 | 피드 | + | 탐색 | 내 공간
```

- `/` redirects into the app entry flow.
- `/home` is the personal rhythm screen.
- `/feed` is the public place-record feed.
- `/create/experience` is the default `+` action.
- `/explore` surfaces local events, programs, recommended places, and maps.
- `/me` is the canonical private space route.

Legacy local route `/library` remains as a compatibility redirect to `/me` during MVP development.

## 4. Key User Flows

### Record A Place

1. User opens `+`.
2. Selects image or short video.
3. Selects a place through search, nearby results, or direct map pin.
4. Adds caption, tags, visit date, and visibility.
5. Publishes.
6. The record appears in home calendar, feed if public, place page, and my space.

### Save A Place

1. User taps `담기` from feed or place page.
2. App upserts `(user_id, place_id)` into `user_places`.
3. If saved from an experience, app stores `source_experience_id`.
4. App never copies the original media or caption.
5. My space shows the saved place privately by default.

### Create A Map

1. User enters my space.
2. Opens my maps and starts a new map.
3. Selects saved places.
4. Adds title, story, cover, order, and visibility.
5. Publishes or saves the map.
6. Map detail supports list and map views, save, and share.

### Explore Local Opportunities

1. User opens explore.
2. Searches across places, maps, and operator-curated events.
3. Browses nearby events/programs, recommended places, recommended maps, collaborative projects, and contextual tags.
4. Event registration links point outside LOCA; in-app payment and attendee management are excluded.

## 5. Implementation Phases

### Phase 1 - Product Base

- React, Vite, TypeScript, React Router.
- Design tokens and dark mobile shell.
- Five-tab bottom navigation.
- PWA manifest and install-ready build.
- Repository abstraction with demo and Supabase modes.
- Auth surface and demo sign-in.
- Canonical `/me` route.

### Phase 2 - Places And Records

- Kakao map adapter interface.
- Place search, nearby suggestions, address lookup, and direct pin flow.
- Supabase migrations for places, experiences, media, user places.
- Experience creation with media validation and retryable upload states.
- Place detail and personal record calendar.

### Phase 3 - Feed And Save

- Full-screen vertical public feed.
- Visibility-controlled video playback.
- Save/unsave place behavior.
- Public profile route.
- Cursor pagination.

### Phase 4 - My Space And Maps

- My records, places, maps, collaborative maps, and saved maps.
- Taste map creation.
- Map list/map view toggle.
- Map save and share.

### Phase 5 - Collaborative Maps

- Map members, invite token, owner/contributor roles.
- Contributor place additions.
- Duplicate place prevention per map.

### Phase 6 - Explore And Events

- Operator-curated events/programs.
- Recommended places, maps, and event sections.
- Unified search.
- Admin featured-content management.

### Phase 7 - Security, QA, And Operations

- RLS policy audit.
- Storage policy audit.
- Playwright E2E coverage for core flows.
- 360x800 and 390x844 mobile QA.
- Admin workflows and operations docs.

## 6. Explicit Non-Goals

The MVP excludes likes, comments, follows, DM, chat, realtime collaborative cursors, push notifications, rankings, AI personalization, video editing, route drawing, GPX, paid events, paid maps, subscriptions, and advanced institutional analytics.

## 7. Acceptance Evidence

Completion requires evidence, not intent:

- `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build`, and Playwright E2E pass.
- Mobile QA at 360x800 and 390x844 has no horizontal overflow or broken bottom navigation.
- Supabase mode uses real API/DB/storage behavior or explicit errors, never fake success.
- Demo mode remains clearly labeled and Korean-first.
- RLS and storage policies are documented and verified.
- The final report lists implemented functions, routes, migrations, policies, tests, QA, environment variables, limitations, and local commits.

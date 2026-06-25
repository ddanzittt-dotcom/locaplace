# LOCA RLS Matrix

This matrix tracks the intended Supabase row-level security behavior for the MVP. Production mode must use these policies or stricter equivalents; demo mode is local-only and does not prove RLS correctness.

## Helper Functions

| Helper | Purpose | Notes |
|---|---|---|
| `app_private.is_admin()` | Checks `user_roles` and legacy `profiles.role` for admin access. | Security definer; `authenticated` has schema usage plus function execute only. |

## Tables

| Table | Public Read | Authenticated User | Owner / Member | Admin | Notes |
|---|---|---|---|---|---|
| `profiles` | Public profile fields readable. | Can read public profiles. | User can update own profile. | Can inspect for moderation. | Service role still handles auth-user lifecycle. |
| `places` | Non-hidden places readable. | Can create user-submitted places. | Creator can request/edit only through future moderation flow. | Can update verification/status/details. | Kakao places use `(provider, provider_place_id)` uniqueness. |
| `experiences` | `visibility = public` and `status = active`. | Can create own records. | Owner can read own records, including private/unlisted. | Can hide/restore. | Unlisted must use token RPC, not normal public SELECT. |
| `experience_media` | Readable only when parent experience is public active. | Can insert media for own experience. | Owner can read/write/delete own media. | Can moderate via parent experience. | Storage policies must mirror DB ownership. |
| `tags` | Readable. | No direct normal-user writes in MVP. | N/A | Can manage taxonomy. | Tag text should not leak private content. |
| `experience_tags` | Readable only through accessible experience semantics in future hardening. | Can write tags for own experience. | Owner controls own tags. | Can moderate. | Current migration has broad read; tighten before production if private tags matter. |
| `user_places` | No public read. | Can save/unsave own places. | Owner-only read/write. | Admin should not need normal access except support tooling. | Save does not copy source media/caption. |
| `taste_maps` | `visibility = public` and `status = published`. | Can create maps. | Owner reads private maps and edits map metadata. Members can read joined maps. | Can hide/restore. | Unlisted must use token RPC. |
| `taste_map_items` | Items of public published maps readable. | Contributors can add to joined collaborative maps. | Owner manages all items; contributor manages only own items. | Can moderate through map. | Unique `(taste_map_id, place_id)` prevents duplicates. |
| `taste_map_saves` | No public read. | Can save/unsave own maps. | Owner-only read/write. | Support-only. | |
| `map_members` | No public read. | Can read own memberships. | Map owner can read/manage members. | Can inspect for moderation. | Invite acceptance should use RPC. |
| `map_invites` | No direct public read. | N/A | Map owner can create/revoke invites. | Can inspect. | Token hash only; never store raw invite token. |
| `events` | Published events only. | Can read published events. | N/A | Full CRUD. | User event registration/payment excluded. |
| `featured_content` | Active rows only. | Read active featured content. | N/A | Full CRUD. | Used for explore/home curation. |
| `reports` | No public read. | Can create and read own reports. | Reporter can read own report status. | Can read/update all reports. | |
| `recent_views` | No public read. | Owner-only read/write. | Owner-only. | Not needed for normal admin. | |
| `user_roles` | No public read. | N/A | N/A | Admin/service role managed. | Do not expose role escalation to users. |

## Unlisted Access

Unlisted records and maps must not be returned by normal public SELECT policies. They are served through token-based RPC or Edge Functions returning a minimal public payload.

Current RPCs:

- `get_experience_by_share_token(token uuid)`
- `get_taste_map_by_share_token(token uuid)`

Future hardening should hash share tokens at rest and return a DTO instead of `setof` base table rows.

## Production Audit Checklist

- Confirm every public table has RLS enabled.
- Confirm normal anonymous SELECT cannot read private or unlisted rows.
- Confirm authenticated user cannot read another user's `user_places`, private experiences, private maps, or recent views.
- Confirm contributors cannot edit map metadata or other contributors' items.
- Confirm admin policies rely on `app_private.is_admin()` and cannot be triggered by client-controlled fields.
- Confirm `app_private` does not expose tables/views and grants only the usage required to execute helper functions.
- Confirm Storage policies mirror ownership and visibility rules.

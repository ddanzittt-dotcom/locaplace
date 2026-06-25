# LOCA Data Model

Entities:

- `profiles`: public user identity and role.
- `places`: provider-backed or user-submitted real places.
- `experiences`: place-bound posts with caption, visit date, visibility, status, and share token.
- `experience_media`: image or video metadata and storage paths.
- `tags` and `experience_tags`: reusable tag taxonomy.
- `user_places`: saved places and places the user has posted to.
- `taste_maps`: place playlists with story, cover, visibility, and share token.
- `taste_map_items`: ordered places in a taste map.
- `map_members`: owner/contributor membership for asynchronous collaborative maps.
- `map_invites`: hashed invite tokens for collaborative maps.
- `taste_map_saves`: saved public maps.
- `events`: operator-curated local events and programs.
- `reports`: moderation reports.
- `featured_content`: operator-curated sections.
- `recent_views`: local or server-side recency signals.
- `user_roles`: admin/user role assignments.

Visibility values are `public`, `unlisted`, and `private`. Status values distinguish active, hidden, deleted, draft, and published states.

## Migrations

- `202606220001_initial_loca.sql`: core profiles, places, experiences, media, tags, saved places, taste maps, reports, featured content, recent views, share-token RPCs, and baseline RLS.
- `202606240002_events_collaboration_postgis.sql`: PostGIS location columns, nearby search functions, precise experience locations, user place source type, collaborative map members/invites, events, user roles, admin helper, and additional RLS policies.

## Location Model

`places.location` is the representative place point. `experiences.precise_location` is optional and should be used only when the user explicitly chooses a more exact point for large spaces.

Required distance RPCs:

- `nearby_places(lat, lng, radius_m, result_limit)`
- `nearby_events(lat, lng, radius_m, result_limit)`

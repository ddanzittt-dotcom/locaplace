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
- `taste_map_saves`: saved public maps.
- `reports`: moderation reports.
- `featured_content`: operator-curated sections.
- `recent_views`: local or server-side recency signals.

Visibility values are `public`, `unlisted`, and `private`. Status values distinguish active, hidden, deleted, draft, and published states.

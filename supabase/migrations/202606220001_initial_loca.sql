create extension if not exists "pgcrypto";

create type public.profile_role as enum ('user', 'admin');
create type public.place_verification_status as enum ('verified', 'user_submitted', 'hidden');
create type public.visibility as enum ('public', 'unlisted', 'private');
create type public.experience_status as enum ('active', 'hidden', 'deleted');
create type public.media_type as enum ('image', 'video');
create type public.cover_type as enum ('first_media', 'selected_media', 'collage', 'gradient');
create type public.map_status as enum ('draft', 'published', 'hidden', 'deleted');
create type public.report_target_type as enum ('experience', 'taste_map', 'place', 'profile');
create type public.report_status as enum ('pending', 'resolved', 'dismissed');
create type public.featured_content_type as enum ('experience', 'place', 'taste_map');
create type public.recent_view_type as enum ('place', 'taste_map', 'experience');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  handle text not null unique,
  name text not null,
  bio text not null default '',
  avatar_path text,
  role public.profile_role not null default 'user',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.places (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  provider_place_id text,
  name text not null,
  normalized_name text not null,
  address text not null,
  latitude numeric not null,
  longitude numeric not null,
  category text not null,
  representative_image_path text,
  created_by uuid references public.profiles(id) on delete set null,
  verification_status public.place_verification_status not null default 'user_submitted',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index places_provider_place_id_idx
  on public.places(provider, provider_place_id)
  where provider_place_id is not null;
create index places_normalized_name_address_idx on public.places(normalized_name, address);
create index places_coordinates_idx on public.places(latitude, longitude);

create table public.experiences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  place_id uuid not null references public.places(id) on delete restrict,
  caption text not null,
  visited_at timestamptz,
  show_visited_at boolean not null default true,
  visibility public.visibility not null default 'public',
  status public.experience_status not null default 'active',
  share_token uuid not null default gen_random_uuid() unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index experiences_place_created_idx on public.experiences(place_id, created_at desc);
create index experiences_user_created_idx on public.experiences(user_id, created_at desc);
create index experiences_share_token_idx on public.experiences(share_token);

create table public.experience_media (
  id uuid primary key default gen_random_uuid(),
  experience_id uuid not null references public.experiences(id) on delete cascade,
  media_type public.media_type not null,
  storage_path text not null,
  poster_path text,
  sort_order integer not null default 0,
  mime_type text not null,
  size_bytes bigint not null,
  width integer,
  height integer,
  duration_seconds numeric,
  created_at timestamptz not null default now()
);
create unique index experience_media_sort_idx on public.experience_media(experience_id, sort_order);

create table public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique
);

create table public.experience_tags (
  experience_id uuid not null references public.experiences(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  primary key (experience_id, tag_id)
);

create table public.user_places (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  place_id uuid not null references public.places(id) on delete cascade,
  source_experience_id uuid references public.experiences(id) on delete set null,
  saved_at timestamptz not null default now(),
  unique (user_id, place_id)
);

create table public.taste_maps (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  story text not null,
  cover_type public.cover_type not null default 'gradient',
  cover_media_path text,
  visibility public.visibility not null default 'public',
  status public.map_status not null default 'draft',
  share_token uuid not null default gen_random_uuid() unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index taste_maps_owner_created_idx on public.taste_maps(owner_id, created_at desc);
create index taste_maps_share_token_idx on public.taste_maps(share_token);

create table public.taste_map_items (
  id uuid primary key default gen_random_uuid(),
  taste_map_id uuid not null references public.taste_maps(id) on delete cascade,
  place_id uuid not null references public.places(id) on delete restrict,
  source_experience_id uuid references public.experiences(id) on delete set null,
  item_note text,
  sort_order integer not null,
  unique (taste_map_id, place_id),
  unique (taste_map_id, sort_order)
);

create table public.taste_map_saves (
  user_id uuid not null references public.profiles(id) on delete cascade,
  taste_map_id uuid not null references public.taste_maps(id) on delete cascade,
  saved_at timestamptz not null default now(),
  primary key (user_id, taste_map_id)
);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  target_type public.report_target_type not null,
  target_id uuid not null,
  reason text not null,
  detail text,
  status public.report_status not null default 'pending',
  created_at timestamptz not null default now(),
  resolved_at timestamptz,
  resolved_by uuid references public.profiles(id) on delete set null
);

create table public.featured_content (
  id uuid primary key default gen_random_uuid(),
  content_type public.featured_content_type not null,
  content_id uuid not null,
  section text not null,
  sort_order integer not null default 0,
  active boolean not null default true,
  starts_at timestamptz,
  ends_at timestamptz
);
create index featured_section_idx on public.featured_content(section, active, sort_order);

create table public.recent_views (
  user_id uuid not null references public.profiles(id) on delete cascade,
  content_type public.recent_view_type not null,
  content_id uuid not null,
  viewed_at timestamptz not null default now(),
  primary key (user_id, content_type, content_id)
);

create function public.get_experience_by_share_token(token uuid)
returns setof public.experiences
language sql
stable
security definer
set search_path = public
as $$
  select * from public.experiences
  where share_token = token and visibility = 'unlisted' and status = 'active';
$$;

create function public.get_taste_map_by_share_token(token uuid)
returns setof public.taste_maps
language sql
stable
security definer
set search_path = public
as $$
  select * from public.taste_maps
  where share_token = token and visibility = 'unlisted' and status = 'published';
$$;

alter table public.profiles enable row level security;
alter table public.places enable row level security;
alter table public.experiences enable row level security;
alter table public.experience_media enable row level security;
alter table public.tags enable row level security;
alter table public.experience_tags enable row level security;
alter table public.user_places enable row level security;
alter table public.taste_maps enable row level security;
alter table public.taste_map_items enable row level security;
alter table public.taste_map_saves enable row level security;
alter table public.reports enable row level security;
alter table public.featured_content enable row level security;
alter table public.recent_views enable row level security;

create policy "profiles public read" on public.profiles for select using (true);
create policy "profiles owner update" on public.profiles
  for update to authenticated
  using (auth.uid() is not null and id = auth.uid())
  with check (auth.uid() is not null and id = auth.uid());

create policy "places visible read" on public.places
  for select using (verification_status <> 'hidden');
create policy "places authenticated create" on public.places
  for insert to authenticated
  with check (auth.uid() is not null and created_by = auth.uid());

create policy "experiences public read" on public.experiences
  for select using (visibility = 'public' and status = 'active');
create policy "experiences owner read" on public.experiences
  for select using (user_id = auth.uid());
create policy "experiences owner insert" on public.experiences
  for insert to authenticated
  with check (auth.uid() is not null and auth.uid() = user_id);

create policy "media public read" on public.experience_media
  for select using (
    exists (
      select 1 from public.experiences e
      where e.id = experience_id
      and e.visibility = 'public'
      and e.status = 'active'
    )
  );
create policy "media owner read" on public.experience_media
  for select using (
    exists (
      select 1 from public.experiences e
      where e.id = experience_id
      and e.user_id = auth.uid()
    )
  );
create policy "media owner insert" on public.experience_media
  for insert to authenticated
  with check (
    auth.uid() is not null
    and exists (select 1 from public.experiences e where e.id = experience_id and e.user_id = auth.uid())
  );

create policy "tags public read" on public.tags for select using (true);
create policy "experience_tags public read" on public.experience_tags for select using (true);
create policy "experience_tags owner write" on public.experience_tags
  for all to authenticated
  using (
    auth.uid() is not null
    and exists (select 1 from public.experiences e where e.id = experience_id and e.user_id = auth.uid())
  )
  with check (
    auth.uid() is not null
    and exists (select 1 from public.experiences e where e.id = experience_id and e.user_id = auth.uid())
  );

create policy "user_places owner read" on public.user_places
  for select to authenticated
  using (auth.uid() is not null and user_id = auth.uid());
create policy "user_places owner write" on public.user_places
  for all to authenticated
  using (auth.uid() is not null and user_id = auth.uid())
  with check (auth.uid() is not null and user_id = auth.uid());

create policy "taste_maps public read" on public.taste_maps
  for select using (visibility = 'public' and status = 'published');
create policy "taste_maps owner read" on public.taste_maps
  for select using (owner_id = auth.uid());
create policy "taste_maps owner insert" on public.taste_maps
  for insert to authenticated
  with check (auth.uid() is not null and owner_id = auth.uid());

create policy "taste_map_items public read" on public.taste_map_items
  for select using (
    exists (
      select 1 from public.taste_maps m
      where m.id = taste_map_id
      and m.visibility = 'public'
      and m.status = 'published'
    )
  );
create policy "taste_map_items owner read" on public.taste_map_items
  for select using (
    exists (
      select 1 from public.taste_maps m
      where m.id = taste_map_id
      and m.owner_id = auth.uid()
    )
  );
create policy "taste_map_items owner write" on public.taste_map_items
  for all to authenticated
  using (
    auth.uid() is not null
    and exists (select 1 from public.taste_maps m where m.id = taste_map_id and m.owner_id = auth.uid())
  )
  with check (
    auth.uid() is not null
    and exists (select 1 from public.taste_maps m where m.id = taste_map_id and m.owner_id = auth.uid())
  );

create policy "taste_map_saves owner read" on public.taste_map_saves
  for select to authenticated
  using (auth.uid() is not null and user_id = auth.uid());
create policy "taste_map_saves owner write" on public.taste_map_saves
  for all to authenticated
  using (auth.uid() is not null and user_id = auth.uid())
  with check (auth.uid() is not null and user_id = auth.uid());

create policy "reports authenticated create" on public.reports
  for insert to authenticated
  with check (auth.uid() is not null and reporter_id = auth.uid());

create policy "featured public read" on public.featured_content
  for select using (active = true);

create policy "recent_views owner read" on public.recent_views
  for select to authenticated
  using (auth.uid() is not null and user_id = auth.uid());
create policy "recent_views owner write" on public.recent_views
  for all to authenticated
  using (auth.uid() is not null and user_id = auth.uid())
  with check (auth.uid() is not null and user_id = auth.uid());

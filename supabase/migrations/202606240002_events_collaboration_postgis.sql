create extension if not exists postgis;

do $$
begin
  alter type public.featured_content_type add value if not exists 'event';
exception
  when duplicate_object then null;
end $$;

do $$
begin
  alter type public.report_target_type add value if not exists 'event';
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.map_member_role as enum ('owner', 'contributor');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.event_status as enum ('draft', 'published', 'hidden', 'deleted');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.user_place_source_type as enum ('recorded', 'saved', 'searched');
exception
  when duplicate_object then null;
end $$;

create schema if not exists app_private;

alter table public.places
  add column if not exists location geography(Point, 4326);

update public.places
set location = st_setsrid(st_makepoint(longitude::double precision, latitude::double precision), 4326)::geography
where location is null;

alter table public.experiences
  add column if not exists precise_location geography(Point, 4326);

alter table public.user_places
  add column if not exists source_type public.user_place_source_type not null default 'saved';

alter table public.taste_map_items
  add column if not exists added_by uuid references public.profiles(id) on delete set null;

create index if not exists places_location_gist_idx on public.places using gist (location);
create index if not exists experiences_precise_location_gist_idx on public.experiences using gist (precise_location);

create table if not exists public.user_roles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  role public.profile_role not null default 'user',
  created_at timestamptz not null default now()
);

create table if not exists public.map_members (
  taste_map_id uuid not null references public.taste_maps(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.map_member_role not null,
  joined_at timestamptz not null default now(),
  primary key (taste_map_id, user_id)
);

create table if not exists public.map_invites (
  id uuid primary key default gen_random_uuid(),
  taste_map_id uuid not null references public.taste_maps(id) on delete cascade,
  token_hash text not null unique,
  role public.map_member_role not null default 'contributor',
  created_by uuid not null references public.profiles(id) on delete cascade,
  expires_at timestamptz not null,
  accepted_at timestamptz,
  accepted_by uuid references public.profiles(id) on delete set null,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text not null,
  description text not null default '',
  cover_image_path text,
  place_id uuid not null references public.places(id) on delete restrict,
  starts_at timestamptz not null,
  ends_at timestamptz,
  registration_url text,
  organizer text not null,
  status public.event_status not null default 'draft',
  linked_taste_map_id uuid references public.taste_maps(id) on delete set null,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists events_place_starts_idx on public.events(place_id, starts_at);
create index if not exists events_status_published_idx on public.events(status, published_at desc);

create or replace function app_private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles r
    where r.user_id = auth.uid()
      and r.role = 'admin'
  )
  or exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  );
$$;

revoke all on function app_private.is_admin() from public;
revoke all on schema app_private from public;
grant usage on schema app_private to authenticated;
grant execute on function app_private.is_admin() to authenticated;

create or replace function public.nearby_places(
  lat double precision,
  lng double precision,
  radius_m integer default 3000,
  result_limit integer default 20
)
returns table (
  id uuid,
  name text,
  address text,
  category text,
  distance_m double precision
)
language sql
stable
as $$
  with origin as (
    select st_setsrid(st_makepoint(lng, lat), 4326)::geography as point
  )
  select
    p.id,
    p.name,
    p.address,
    p.category,
    st_distance(p.location, origin.point) as distance_m
  from public.places p, origin
  where p.verification_status <> 'hidden'
    and p.location is not null
    and st_dwithin(p.location, origin.point, radius_m)
  order by p.location <-> origin.point
  limit result_limit;
$$;

create or replace function public.nearby_events(
  lat double precision,
  lng double precision,
  radius_m integer default 5000,
  result_limit integer default 20
)
returns table (
  id uuid,
  title text,
  summary text,
  place_id uuid,
  place_name text,
  starts_at timestamptz,
  registration_url text,
  distance_m double precision
)
language sql
stable
as $$
  with origin as (
    select st_setsrid(st_makepoint(lng, lat), 4326)::geography as point
  )
  select
    e.id,
    e.title,
    e.summary,
    e.place_id,
    p.name as place_name,
    e.starts_at,
    e.registration_url,
    st_distance(p.location, origin.point) as distance_m
  from public.events e
  join public.places p on p.id = e.place_id
  cross join origin
  where e.status = 'published'
    and p.location is not null
    and st_dwithin(p.location, origin.point, radius_m)
  order by e.starts_at asc, p.location <-> origin.point
  limit result_limit;
$$;

alter table public.user_roles enable row level security;
alter table public.map_members enable row level security;
alter table public.map_invites enable row level security;
alter table public.events enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'user_roles' and policyname = 'user_roles admin read') then
    create policy "user_roles admin read" on public.user_roles
      for select to authenticated
      using (app_private.is_admin());
  end if;

  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'map_members' and policyname = 'map_members owner member read') then
    create policy "map_members owner member read" on public.map_members
      for select to authenticated
      using (
        user_id = auth.uid()
        or exists (
          select 1 from public.taste_maps m
          where m.id = taste_map_id
            and m.owner_id = auth.uid()
        )
        or app_private.is_admin()
      );
  end if;

  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'map_members' and policyname = 'map_members owner write') then
    create policy "map_members owner write" on public.map_members
      for all to authenticated
      using (
        exists (
          select 1 from public.taste_maps m
          where m.id = taste_map_id
            and m.owner_id = auth.uid()
        )
        or app_private.is_admin()
      )
      with check (
        exists (
          select 1 from public.taste_maps m
          where m.id = taste_map_id
            and m.owner_id = auth.uid()
        )
        or app_private.is_admin()
      );
  end if;

  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'map_invites' and policyname = 'map_invites owner read') then
    create policy "map_invites owner read" on public.map_invites
      for select to authenticated
      using (
        exists (
          select 1 from public.taste_maps m
          where m.id = taste_map_id
            and m.owner_id = auth.uid()
        )
        or app_private.is_admin()
      );
  end if;

  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'map_invites' and policyname = 'map_invites owner write') then
    create policy "map_invites owner write" on public.map_invites
      for all to authenticated
      using (
        exists (
          select 1 from public.taste_maps m
          where m.id = taste_map_id
            and m.owner_id = auth.uid()
        )
        or app_private.is_admin()
      )
      with check (
        created_by = auth.uid()
        and (
          exists (
            select 1 from public.taste_maps m
            where m.id = taste_map_id
              and m.owner_id = auth.uid()
          )
          or app_private.is_admin()
        )
      );
  end if;

  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'events' and policyname = 'events published read') then
    create policy "events published read" on public.events
      for select using (status = 'published');
  end if;

  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'events' and policyname = 'events admin write') then
    create policy "events admin write" on public.events
      for all to authenticated
      using (app_private.is_admin())
      with check (app_private.is_admin());
  end if;

  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'reports' and policyname = 'reports owner read') then
    create policy "reports owner read" on public.reports
      for select to authenticated
      using (reporter_id = auth.uid() or app_private.is_admin());
  end if;

  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'reports' and policyname = 'reports admin update') then
    create policy "reports admin update" on public.reports
      for update to authenticated
      using (app_private.is_admin())
      with check (app_private.is_admin());
  end if;

  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'featured_content' and policyname = 'featured admin write') then
    create policy "featured admin write" on public.featured_content
      for all to authenticated
      using (app_private.is_admin())
      with check (app_private.is_admin());
  end if;
end $$;

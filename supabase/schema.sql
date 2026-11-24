-- Wilbid Game Night : schéma de la base Supabase (projet yfawosftdsmrczyecxns, eu-central-1)
-- Migration « wilbid_schema », appliquée le 24/11/2026.

-- Organisateurs autorisés (liste d'adresses e-mail)
create table public.organisers (
  email text primary key check (email = lower(email)),
  added_at timestamptz not null default now()
);
alter table public.organisers enable row level security;

create or replace function public.is_organiser()
returns boolean language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.organisers o
    where o.email = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;
revoke all on function public.is_organiser() from public;
grant execute on function public.is_organiser() to anon, authenticated;

create policy "organiser sees own row" on public.organisers
  for select to authenticated
  using (email = lower(coalesce(auth.jwt() ->> 'email', '')));

-- Soirées : état complet de l'appli, réservé aux organisateurs
create table public.nights (
  id uuid primary key default gen_random_uuid(),
  title text not null default 'Wilbid Game Night',
  state jsonb not null default '{}'::jsonb,
  is_live boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by text
);
alter table public.nights enable row level security;
create policy "organisers read nights" on public.nights for select to authenticated using (public.is_organiser());
create policy "organisers insert nights" on public.nights for insert to authenticated with check (public.is_organiser());
create policy "organisers update nights" on public.nights for update to authenticated using (public.is_organiser()) with check (public.is_organiser());
create policy "organisers delete nights" on public.nights for delete to authenticated using (public.is_organiser());

-- Classement public : seulement prénom, ville et total, lisible par tous
create table public.boards (
  night_id uuid primary key references public.nights(id) on delete cascade,
  title text,
  board jsonb not null default '[]'::jsonb,
  last jsonb,
  is_live boolean not null default true,
  updated_at timestamptz not null default now()
);
alter table public.boards enable row level security;
create policy "everyone reads boards" on public.boards for select to anon, authenticated using (true);
create policy "organisers insert boards" on public.boards for insert to authenticated with check (public.is_organiser());
create policy "organisers update boards" on public.boards for update to authenticated using (public.is_organiser()) with check (public.is_organiser());
create policy "organisers delete boards" on public.boards for delete to authenticated using (public.is_organiser());

-- updated_at automatique
create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = ''
as $$ begin new.updated_at = now(); return new; end; $$;
create trigger nights_touch before update on public.nights for each row execute function public.touch_updated_at();
create trigger boards_touch before update on public.boards for each row execute function public.touch_updated_at();

create index nights_updated_idx on public.nights (updated_at desc);
create index boards_live_idx on public.boards (is_live, updated_at desc);

-- Temps réel
alter publication supabase_realtime add table public.boards, public.nights;

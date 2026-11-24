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

-- Migration « partner_requests », appliquée le 24/11/2026 : formulaire de la page partenaires
create table public.partner_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 2 and 120),
  org text check (org is null or char_length(org) <= 160),
  email text not null check (char_length(email) between 5 and 200 and email like '%_@_%._%'),
  phone text check (phone is null or char_length(phone) <= 40),
  formula text check (formula is null or formula in ('ami','soiree','saison','autre')),
  message text check (message is null or char_length(message) <= 2000),
  lang text check (lang is null or lang in ('fr','en')),
  handled boolean not null default false
);
alter table public.partner_requests enable row level security;
create policy "anyone sends a partner request" on public.partner_requests
  for insert to anon, authenticated with check (handled = false);
create policy "organisers read partner requests" on public.partner_requests
  for select to authenticated using ((select public.is_organiser()));
create policy "organisers update partner requests" on public.partner_requests
  for update to authenticated using ((select public.is_organiser())) with check ((select public.is_organiser()));
create index partner_requests_created_idx on public.partner_requests (created_at desc);

-- Migrations « player_forms » et « registrations_three_anecdotes », appliquées le 24/11/2026 : inscription.html et avis.html
create table public.registrations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  night_id uuid references public.nights(id) on delete set null,
  first_name text not null check (char_length(first_name) between 1 and 60),
  pseudo text check (pseudo is null or char_length(pseudo) <= 40),
  public_name text not null default 'name' check (public_name in ('name','pseudo','hidden')),
  city_origin text check (city_origin is null or char_length(city_origin) <= 60),
  lives_in text check (lives_in is null or char_length(lives_in) <= 60),
  gender text check (gender is null or gender in ('F','H')),
  contact text check (contact is null or char_length(contact) <= 120),
  dish text check (dish is null or char_length(dish) <= 120),
  anecdote text check (anecdote is null or char_length(anecdote) <= 400),
  anecdote2 text check (anecdote2 is null or char_length(anecdote2) <= 400),
  anecdote3 text check (anecdote3 is null or char_length(anecdote3) <= 400),
  photo_ok boolean not null default false,
  rules_ok boolean not null check (rules_ok),
  note text check (note is null or char_length(note) <= 600),
  lang text check (lang is null or lang in ('fr','en')),
  status text not null default 'new' check (status in ('new','added','cancelled'))
);
alter table public.registrations enable row level security;
create policy "anyone registers" on public.registrations for insert to anon, authenticated with check (status = 'new');
create policy "organisers read registrations" on public.registrations for select to authenticated using ((select public.is_organiser()));
create policy "organisers update registrations" on public.registrations for update to authenticated using ((select public.is_organiser())) with check ((select public.is_organiser()));
create policy "organisers delete registrations" on public.registrations for delete to authenticated using ((select public.is_organiser()));
create index registrations_night_idx on public.registrations (night_id, created_at);

create table public.feedback (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  night_id uuid references public.nights(id) on delete set null,
  rating int not null check (rating between 1 and 5),
  best_game text check (best_game is null or char_length(best_game) <= 20),
  worst_game text check (worst_game is null or char_length(worst_game) <= 20),
  come_back text check (come_back is null or come_back in ('oui','peutetre','non')),
  comment text check (comment is null or char_length(comment) <= 1500),
  name text check (name is null or char_length(name) <= 60),
  lang text check (lang is null or lang in ('fr','en'))
);
alter table public.feedback enable row level security;
create policy "anyone gives feedback" on public.feedback for insert to anon, authenticated with check (true);
create policy "organisers read feedback" on public.feedback for select to authenticated using ((select public.is_organiser()));
create policy "organisers delete feedback" on public.feedback for delete to authenticated using ((select public.is_organiser()));
create index feedback_night_idx on public.feedback (night_id, created_at);

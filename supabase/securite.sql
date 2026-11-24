-- Correctif de sécurité : la vérification « est organisateur » quitte le schéma exposé par l'API.
-- À coller dans Supabase > SQL Editor, puis « Run ». Sans risque pour les données.
create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated;

create or replace function private.is_organiser()
returns boolean language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.organisers o
    where o.email = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;
revoke all on function private.is_organiser() from public, anon;
grant execute on function private.is_organiser() to authenticated;

alter policy "organisers read nights" on public.nights using ((select private.is_organiser()));
alter policy "organisers insert nights" on public.nights with check ((select private.is_organiser()));
alter policy "organisers update nights" on public.nights using ((select private.is_organiser())) with check ((select private.is_organiser()));
alter policy "organisers delete nights" on public.nights using ((select private.is_organiser()));
alter policy "organisers insert boards" on public.boards with check ((select private.is_organiser()));
alter policy "organisers update boards" on public.boards using ((select private.is_organiser())) with check ((select private.is_organiser()));
alter policy "organisers delete boards" on public.boards using ((select private.is_organiser()));
alter policy "organisers read partner requests" on public.partner_requests using ((select private.is_organiser()));
alter policy "organisers update partner requests" on public.partner_requests using ((select private.is_organiser())) with check ((select private.is_organiser()));
alter policy "organisers read registrations" on public.registrations using ((select private.is_organiser()));
alter policy "organisers update registrations" on public.registrations using ((select private.is_organiser())) with check ((select private.is_organiser()));
alter policy "organisers delete registrations" on public.registrations using ((select private.is_organiser()));
alter policy "organisers read feedback" on public.feedback using ((select private.is_organiser()));
alter policy "organisers delete feedback" on public.feedback using ((select private.is_organiser()));
alter policy "organiser sees own row" on public.organisers
  using (email = lower(coalesce((select auth.jwt()) ->> 'email', '')));

drop function public.is_organiser();

-- ============================================================
--  MedicalJob — Système de candidatures / propositions
--  (inspiré de ServiceProposal de Diasporteur)
--  À exécuter dans Supabase → SQL Editor. Idempotent.
--  Prérequis : supabase-schema.sql déjà exécuté.
-- ============================================================

-- ----------------------------------------------------------------
-- 1) PROFILES — rôle + identité par utilisateur authentifié
-- ----------------------------------------------------------------
create table if not exists public.profiles (
  id         uuid primary key references auth.users on delete cascade,
  role       text not null check (role in ('etablissement', 'remplacant')),
  nom        text,
  telephone  text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
grant select, insert, update on public.profiles to authenticated;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select to authenticated using (id = auth.uid());

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert to authenticated with check (id = auth.uid());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- ----------------------------------------------------------------
-- 2) OWNER sur besoins / remplacants + RLS propriétaire
--    (les insertions passent désormais par des utilisateurs connectés)
-- ----------------------------------------------------------------
alter table public.besoins     add column if not exists owner_id uuid references auth.users;
alter table public.remplacants add column if not exists owner_id uuid references auth.users;

-- On retire l'insertion anonyme : publier exige maintenant un compte.
revoke insert on public.besoins     from anon;
revoke insert on public.remplacants from anon;
drop policy if exists "anon_insert_besoins"     on public.besoins;
drop policy if exists "anon_insert_remplacants" on public.remplacants;

grant select, insert, update on public.besoins     to authenticated;
grant select, insert, update on public.remplacants to authenticated;

-- besoins : le propriétaire lit/modifie sa ligne ; insert avec owner = soi
drop policy if exists "besoins_owner_select" on public.besoins;
create policy "besoins_owner_select" on public.besoins
  for select to authenticated using (owner_id = auth.uid());
drop policy if exists "besoins_owner_update" on public.besoins;
create policy "besoins_owner_update" on public.besoins
  for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
drop policy if exists "besoins_insert_auth" on public.besoins;
create policy "besoins_insert_auth" on public.besoins
  for insert to authenticated with check (owner_id = auth.uid());

-- remplacants : idem
drop policy if exists "remplacants_owner_select" on public.remplacants;
create policy "remplacants_owner_select" on public.remplacants
  for select to authenticated using (owner_id = auth.uid());
drop policy if exists "remplacants_owner_update" on public.remplacants;
create policy "remplacants_owner_update" on public.remplacants
  for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
drop policy if exists "remplacants_insert_auth" on public.remplacants;
create policy "remplacants_insert_auth" on public.remplacants
  for insert to authenticated with check (owner_id = auth.uid());

-- ----------------------------------------------------------------
-- 3) Helpers SECURITY DEFINER (évitent la récursion RLS)
-- ----------------------------------------------------------------
create or replace function public.auth_owns_mission(p_mission uuid)
returns boolean language sql security definer set search_path = public stable as $$
  select exists (select 1 from besoins where id = p_mission and owner_id = auth.uid());
$$;

create or replace function public.auth_owns_profil(p_profil uuid)
returns boolean language sql security definer set search_path = public stable as $$
  select exists (select 1 from remplacants where id = p_profil and owner_id = auth.uid());
$$;

grant execute on function public.auth_owns_mission(uuid) to authenticated;
grant execute on function public.auth_owns_profil(uuid)  to authenticated;

-- ----------------------------------------------------------------
-- 4) CANDIDATURES (= ServiceProposal)
-- ----------------------------------------------------------------
create table if not exists public.candidatures (
  id                  uuid primary key default gen_random_uuid(),
  created_at          timestamptz not null default now(),
  mission_id          uuid not null references public.besoins     on delete cascade,
  profil_id           uuid not null references public.remplacants on delete cascade,
  proposer_id         uuid not null references auth.users,
  proposer_role       text not null check (proposer_role in ('etablissement', 'remplacant')),
  message             text,
  remuneration_proposee text,
  -- libellés dénormalisés (affichage des 2 côtés sans lecture cross-RLS)
  mission_libelle     text,
  profil_libelle      text,
  statut              text not null default 'en_attente'
                      check (statut in ('en_attente', 'acceptee', 'refusee', 'annulee', 'effectuee')),
  unique (mission_id, profil_id)
);

alter table public.candidatures enable row level security;
grant select, insert on public.candidatures to authenticated;

-- Lecture réservée aux 2 parties prenantes
drop policy if exists "cand_select_parties" on public.candidatures;
create policy "cand_select_parties" on public.candidatures
  for select to authenticated using (
    proposer_id = auth.uid()
    or auth_owns_mission(mission_id)
    or auth_owns_profil(profil_id)
  );

-- Insertion : le proposeur c'est soi, et on possède bien le côté qui propose
drop policy if exists "cand_insert_self" on public.candidatures;
create policy "cand_insert_self" on public.candidatures
  for insert to authenticated with check (
    proposer_id = auth.uid()
    and (
      (proposer_role = 'remplacant'    and auth_owns_profil(profil_id))
      or (proposer_role = 'etablissement' and auth_owns_mission(mission_id))
    )
  );
-- Pas d'UPDATE direct : les transitions passent par les fonctions ci-dessous.

-- ----------------------------------------------------------------
-- 5) Transitions de statut (cycle simplifié)
-- ----------------------------------------------------------------
-- Acceptation atomique (RG18 de Diasporteur) : accepte + auto-refuse les concurrentes
create or replace function public.accepter_candidature(p_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare c record;
begin
  select * into c from candidatures where id = p_id;
  if c is null then raise exception 'Candidature introuvable'; end if;
  if c.proposer_role = 'remplacant' then
    if not auth_owns_mission(c.mission_id) then raise exception 'Non autorisé'; end if;
  else
    if not auth_owns_profil(c.profil_id) then raise exception 'Non autorisé'; end if;
  end if;
  if c.statut <> 'en_attente' then raise exception 'Candidature non en attente'; end if;

  update candidatures set statut = 'acceptee' where id = p_id;
  -- auto-refuse les autres candidatures en attente de la même mission
  update candidatures set statut = 'refusee'
    where mission_id = c.mission_id and id <> p_id and statut = 'en_attente';
  -- la mission est pourvue → disparaît du job board public
  update besoins set statut = 'pourvue' where id = c.mission_id;
end; $$;

create or replace function public.refuser_candidature(p_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare c record;
begin
  select * into c from candidatures where id = p_id;
  if c is null then raise exception 'Candidature introuvable'; end if;
  if c.proposer_role = 'remplacant' then
    if not auth_owns_mission(c.mission_id) then raise exception 'Non autorisé'; end if;
  else
    if not auth_owns_profil(c.profil_id) then raise exception 'Non autorisé'; end if;
  end if;
  if c.statut <> 'en_attente' then raise exception 'Candidature non en attente'; end if;
  update candidatures set statut = 'refusee' where id = p_id;
end; $$;

create or replace function public.annuler_candidature(p_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare c record;
begin
  select * into c from candidatures where id = p_id;
  if c is null then raise exception 'Candidature introuvable'; end if;
  if c.proposer_id <> auth.uid() then raise exception 'Non autorisé'; end if;
  if c.statut not in ('en_attente', 'acceptee') then raise exception 'Non annulable'; end if;
  update candidatures set statut = 'annulee' where id = p_id;
end; $$;

grant execute on function public.accepter_candidature(uuid) to authenticated;
grant execute on function public.refuser_candidature(uuid)  to authenticated;
grant execute on function public.annuler_candidature(uuid)  to authenticated;

-- ----------------------------------------------------------------
-- 6) Révélation des coordonnées (seulement si candidature acceptée)
-- ----------------------------------------------------------------
create or replace function public.contact_candidature(p_id uuid)
returns json language plpgsql security definer set search_path = public as $$
declare c record; result json;
begin
  select * into c from candidatures where id = p_id;
  if c is null then raise exception 'Candidature introuvable'; end if;
  if c.statut <> 'acceptee' then raise exception 'Contact indisponible'; end if;

  if auth_owns_mission(c.mission_id) then
    -- l'établissement voit le contact du remplaçant
    select json_build_object('nom', r.nom, 'email', r.email, 'telephone', r.tel)
      into result from remplacants r where r.id = c.profil_id;
  elsif auth_owns_profil(c.profil_id) then
    -- le remplaçant voit le contact de l'établissement
    select json_build_object('nom', b.contact_nom, 'email', b.contact_email, 'telephone', b.contact_tel)
      into result from besoins b where b.id = c.mission_id;
  else
    raise exception 'Non autorisé';
  end if;

  return result;
end; $$;

grant execute on function public.contact_candidature(uuid) to authenticated;

-- ============================================================
--  Réglages manuels ensuite :
--  1. Authentication → Providers → Email : activer (OTP / Magic Link).
--  2. Authentication → URL Configuration : ajouter l'URL du site (Redirect URLs).
--  3. (Notifications) déployer l'Edge Function notify-candidature + Database Webhooks.
-- ============================================================

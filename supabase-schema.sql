-- ============================================================
--  MedicalJob — Schéma Supabase
--  À exécuter dans : Supabase → SQL Editor → New query → Run
--  (une seule fois ; le script est idempotent)
-- ============================================================

-- ----------------------------------------------------------------
--  TABLE "besoins" : publications des établissements
-- ----------------------------------------------------------------
create table if not exists public.besoins (
  id                 uuid primary key default gen_random_uuid(),
  created_at         timestamptz not null default now(),
  type_etablissement text,
  nom_structure      text,
  ville              text,
  metier             text,
  date_debut         date,
  date_fin           date,
  type_mission       text,
  remuneration       text,
  details            text,
  -- Coordonnées de contact : JAMAIS exposées publiquement (cf. vue plus bas)
  contact_nom        text,
  contact_email      text,
  contact_tel        text,
  -- Référence d'un profil remplaçant que l'établissement souhaite contacter (optionnel)
  profil_ref         text,
  -- Modération : 'en_attente' (défaut) | 'publie' | 'archive'
  statut             text not null default 'en_attente'
);

alter table public.besoins enable row level security;

-- Le formulaire public (rôle anon) peut UNIQUEMENT insérer un besoin.
grant insert on public.besoins to anon;
drop policy if exists "anon_insert_besoins" on public.besoins;
create policy "anon_insert_besoins"
  on public.besoins for insert to anon with check (true);
-- Aucune politique SELECT pour anon => la table (et donc les contacts) reste illisible publiquement.

-- ----------------------------------------------------------------
--  VUE "missions_publiques" : ce que le job board affiche
--  -> seulement les besoins validés, sans aucune coordonnée de contact.
--  La vue s'exécute avec les droits de son propriétaire et contourne la RLS,
--  mais ne révèle que les colonnes ci-dessous.
-- ----------------------------------------------------------------
create or replace view public.missions_publiques as
  select id, created_at, type_etablissement, ville, metier,
         date_debut, date_fin, type_mission, remuneration, details
  from public.besoins
  where statut = 'publie';

grant select on public.missions_publiques to anon;

-- ----------------------------------------------------------------
--  TABLE "remplacants" : inscriptions des professionnels
--  (consultable uniquement par toi, via le tableau de bord Supabase)
-- ----------------------------------------------------------------
create table if not exists public.remplacants (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  nom           text,
  metier        text,
  diplome       text,
  zones         text,
  disponibilite text,
  type_mission  text,
  message       text,
  email         text,
  tel           text,
  -- Référence d'une mission à laquelle le remplaçant répond (optionnel)
  mission_ref   text,
  statut        text not null default 'nouveau'
);

alter table public.remplacants enable row level security;

grant insert on public.remplacants to anon;
drop policy if exists "anon_insert_remplacants" on public.remplacants;
create policy "anon_insert_remplacants"
  on public.remplacants for insert to anon with check (true);
-- Aucune politique SELECT pour anon => les inscriptions restent privées.

-- ----------------------------------------------------------------
--  VUE "remplacants_publics" : annuaire des remplaçants disponibles
--  -> seulement les profils validés, SANS aucune coordonnée (nom, email,
--     tél, diplôme/RPPS, message). Les établissements parcourent ces profils
--     anonymisés puis demandent une mise en relation.
-- ----------------------------------------------------------------
create or replace view public.remplacants_publics as
  select id, created_at, metier, zones, disponibilite, type_mission
  from public.remplacants
  where statut = 'publie';

grant select on public.remplacants_publics to anon;

-- ============================================================
--  Modération au quotidien :
--  Table Editor → "besoins" → passe le champ "statut" à "publie"
--  pour qu'un besoin apparaisse sur la page /missions du site.
--  Astuce : active une "Database Webhook" sur INSERT de "besoins"
--  pour recevoir une alerte (email/Slack) à chaque nouvelle publication.
-- ============================================================

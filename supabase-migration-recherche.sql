-- ============================================================
--  MIGRATION — Recherche des remplaçants disponibles
--  À exécuter UNE FOIS dans Supabase → SQL Editor si tu as déjà
--  lancé supabase-schema.sql auparavant. Idempotent.
-- ============================================================

-- 1) Référence d'un profil remplaçant sur les besoins (mise en relation)
alter table public.besoins add column if not exists profil_ref text;

-- 2) Vue publique des remplaçants disponibles (profils VALIDÉS, sans coordonnées)
create or replace view public.remplacants_publics as
  select id, created_at, metier, zones, disponibilite, type_mission
  from public.remplacants
  where statut = 'publie';

grant select on public.remplacants_publics to anon;

-- ============================================================
--  Rappel modération :
--  Un profil remplaçant n'apparaît dans l'annuaire /trouver-un-remplacant
--  qu'une fois son "statut" passé à 'publie' dans Table Editor → remplacants.
--  (Par défaut un nouveau profil est en 'nouveau'.)
-- ============================================================

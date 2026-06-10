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

-- 3) Affichage automatique des profils (sans modération)
--    Chaque nouvelle inscription apparaît immédiatement dans l'annuaire.
alter table public.remplacants alter column statut set default 'publie';
update public.remplacants set statut = 'publie' where statut = 'nouveau';

-- 4) Affichage automatique des besoins sur /missions (sans modération)
alter table public.besoins alter column statut set default 'publie';
update public.besoins set statut = 'publie' where statut = 'en_attente';

-- ============================================================
--  Pour RETIRER un profil de l'annuaire : passe son "statut" à 'archive'
--  dans Table Editor → remplacants (modération a posteriori).
-- ============================================================

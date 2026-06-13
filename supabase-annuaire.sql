-- ============================================================
--  MedicalJob — Annuaire public des établissements
--  À exécuter dans Supabase → SQL Editor (une fois). Idempotent.
--  Regroupe les établissements ayant publié des missions (sans coordonnées).
-- ============================================================

create or replace view public.etablissements_publics as
  select
    md5(lower(coalesce(nom_structure, '') || '|' || coalesce(ville, ''))) as id,
    nom_structure,
    type_etablissement,
    ville,
    count(*)        as nb_missions,
    max(created_at) as derniere_publication
  from public.besoins
  where statut = 'publie'
    and nom_structure is not null
    and nom_structure <> ''
  group by nom_structure, type_etablissement, ville;

grant select on public.etablissements_publics to anon;

# MedicalJob

Site de **mise en relation** pour les **remplacements** en milieu hospitalier (hôpitaux, cliniques, EHPAD, cabinets) et en **officine** (pharmacies). Deux faces :

- **Établissements** qui ont un besoin de remplacement → publient une mission.
- **Professionnels de santé** (médecins, infirmiers, sages-femmes, pharmaciens, préparateurs) → s'inscrivent pour trouver des missions.

Construit en **Astro 5 + Tailwind 4**, statique, SEO-first. Les besoins publiés et les inscriptions sont **stockés dans Supabase** (Postgres gratuit). Les besoins validés s'affichent sur la page publique **/missions** (job board), sans jamais exposer les coordonnées de contact.

## Démarrage

```bash
pnpm install
pnpm dev          # http://localhost:4321
pnpm build        # génère dist/
pnpm preview      # sert dist/ en local
pnpm check        # vérification de types Astro
```

## Configurer Supabase (stockage + job board)

1. Crée un projet gratuit sur [supabase.com](https://supabase.com).
2. **SQL Editor** → New query → colle le contenu de [`supabase-schema.sql`](supabase-schema.sql) → Run. Cela crée les tables `besoins` et `remplacants`, plus la vue publique `missions_publiques`.
3. **Settings → API** : copie l'**URL du projet** et la clé **anon public**, puis colle-les dans [`src/data/site.ts`](src/data/site.ts) (`supabase.url` et `supabase.anonKey`). La clé anon est publique par conception : la sécurité repose sur les politiques RLS du schéma.

### Modération (publier un besoin sur le job board)

Par défaut un besoin reçu a le statut `en_attente`. Dans Supabase → **Table Editor → besoins**, passe `statut` à `publie` pour qu'il apparaisse sur la page **/missions**. (Astuce : active une *Database Webhook* sur `INSERT` pour recevoir une alerte email/Slack à chaque nouveau besoin.)

## Autres réglages ([`src/data/site.ts`](src/data/site.ts))

1. **`analytics.umamiId`** — optionnel (analytics RGPD sans cookies).
2. **`SITE.url` / `SITE.domain`** — si le domaine final n'est pas `medicaljob.fr` (à changer aussi dans `astro.config.mjs` et `public/robots.txt`).
3. **Mentions légales** — remplir le bloc `LEGAL` (SIREN, hébergeur, etc.).

## Structure

- `src/pages/` — pages (landing, faces, formulaires, métiers, villes, blog, légal).
- `src/data/` — contenu structuré (site, métiers, villes).
- `src/lib/schema.ts` — générateurs JSON-LD (Schema.org) pour le SEO/GEO.
- `src/content/blog/` — articles SEO en Markdown.

## SEO

Pages optimisées dès le build (meta, JSON-LD, sitemap, maillage interne). Pour l'audit complet, lancer le plugin `/seo` (claude-seo) sur l'URL en preview.

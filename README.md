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

Par défaut un besoin reçu a le statut `publie` (affichage automatique). Pour retirer un besoin, passe son `statut` à `archive` dans **Table Editor → besoins**.

## Comptes + système de candidatures (comme Diasporteur)

Le site gère des **comptes** (Supabase Auth) et un **système de propositions** : un remplaçant postule à une mission, un établissement propose une mission à un profil, l'autre **accepte/refuse**, et les **coordonnées ne sont révélées qu'après acceptation** (acceptation atomique : accepter une candidature refuse les concurrentes).

Pour l'activer :
1. **SQL** : exécute [`supabase-proposals.sql`](supabase-proposals.sql) dans SQL Editor (crée `profiles`, `candidatures`, `owner_id`, RLS et fonctions). ⚠️ ce script **retire l'insertion anonyme** : publier exige désormais un compte.
2. **Auth** : Supabase → **Authentication → Providers → Email** : activer. → **URL Configuration** : ajouter l'URL du site dans *Site URL* et *Redirect URLs* (`https://medicaljob.vercel.app`).
3. **(option) code à 6 chiffres** : Authentication → Email Templates → *Magic Link* : ajouter `{{ .Token }}` dans le template pour permettre la saisie du code (sinon le lien magique fonctionne déjà).
4. **Notifications email** (Resend) : déploie l'Edge Function et branche les webhooks —
   ```bash
   supabase functions deploy notify-candidature --no-verify-jwt
   supabase secrets set RESEND_API_KEY=re_xxx MEDICALJOB_FROM="MedicalJob <noreply@ton-domaine.fr>"
   ```
   puis Dashboard → **Database → Webhooks** : 2 hooks (`candidatures` INSERT et UPDATE) vers la fonction `notify-candidature`.

Pages liées : `/connexion`, `/mon-espace` (tableau de bord), actions « Postuler » sur `/mission` et « Proposer une mission » sur `/remplacant`.

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

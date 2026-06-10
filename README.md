# MedicalJob

Site de **mise en relation** pour les **remplacements** en milieu hospitalier (hôpitaux, cliniques, EHPAD, cabinets) et en **officine** (pharmacies). Deux faces :

- **Établissements** qui ont un besoin de remplacement → publient une mission.
- **Professionnels de santé** (médecins, infirmiers, sages-femmes, pharmaciens, préparateurs) → s'inscrivent pour trouver des missions.

Construit en **Astro 5 + Tailwind 4**, statique, SEO-first. Les leads sont captés via **Formspree** (deux formulaires).

## Démarrage

```bash
pnpm install
pnpm dev          # http://localhost:4321
pnpm build        # génère dist/
pnpm preview      # sert dist/ en local
pnpm check        # vérification de types Astro
```

## À configurer avant la mise en ligne

Tout est centralisé dans [`src/data/site.ts`](src/data/site.ts) :

1. **`forms.etablissementEndpoint`** et **`forms.remplacantEndpoint`** — crée deux formulaires sur [formspree.io](https://formspree.io) (gratuit : 50 envois/mois) et colle les endpoints `https://formspree.io/f/xxxxxx`.
2. **`analytics.umamiId`** — optionnel (analytics RGPD sans cookies).
3. **`SITE.url` / `SITE.domain`** — si le domaine final n'est pas `medicaljob.fr` (à changer aussi dans `astro.config.mjs` et `public/robots.txt`).
4. **Mentions légales** — remplir le bloc `LEGAL` (SIREN, hébergeur, etc.).

## Structure

- `src/pages/` — pages (landing, faces, formulaires, métiers, villes, blog, légal).
- `src/data/` — contenu structuré (site, métiers, villes).
- `src/lib/schema.ts` — générateurs JSON-LD (Schema.org) pour le SEO/GEO.
- `src/content/blog/` — articles SEO en Markdown.

## SEO

Pages optimisées dès le build (meta, JSON-LD, sitemap, maillage interne). Pour l'audit complet, lancer le plugin `/seo` (claude-seo) sur l'URL en preview.

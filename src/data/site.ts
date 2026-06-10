export const SITE = {
  name: 'MedicalJob',
  legalName: 'MedicalJob',
  domain: 'medicaljob.fr',
  url: 'https://medicaljob.fr',
  defaultLocale: 'fr-FR',

  tagline: 'Trouvez un remplacement, ou un remplaçant, en santé',
  description:
    "MedicalJob met en relation les établissements de santé (hôpitaux, cliniques, EHPAD, cabinets, officines) et les professionnels remplaçants : médecins, infirmiers, sages-femmes, pharmaciens et préparateurs. Publiez un besoin ou trouvez une mission de remplacement, partout en France.",

  email: 'contact@medicaljob.fr',
  phone: '',

  socials: {
    linkedin: 'https://www.linkedin.com/company/medicaljob',
    instagram: 'https://www.instagram.com/medicaljob',
  },

  founders: {
    foundingDate: '2026-06-01',
  },

  serviceAreas: ['FR'],

  /**
   * Supabase — stockage des publications (besoins) et inscriptions (remplaçants).
   * 1. Crée un projet gratuit sur https://supabase.com
   * 2. Settings → API : copie l'URL du projet et la clé "anon public" ci-dessous.
   * 3. SQL Editor : exécute le contenu de `supabase-schema.sql` (à la racine du repo).
   * La clé anon est PUBLIQUE par conception : la sécurité est assurée par les
   * politiques RLS définies dans le schéma (insertion seule, lecture restreinte
   * à la vue des missions validées).
   */
  supabase: {
    url: 'https://XXXX.supabase.co',
    anonKey: 'XXXX',
  },

  /**
   * Umami Analytics — RGPD-friendly, sans cookies, sans bandeau.
   * Laisse vide pour désactiver. Dashboard : https://cloud.umami.is
   */
  analytics: {
    umamiId: '',
    umamiSrc: 'https://eu.umami.is/script.js',
  },
} as const;

/* ============================================================
   Informations légales — à compléter avant mise en ligne
   ============================================================ */
export const LEGAL = {
  societe: {
    raisonSociale: 'MedicalJob',
    formeJuridique: 'À compléter',
    capital: 'À compléter',
    siren: 'À compléter',
    siret: 'À compléter',
    adresse: 'À compléter',
    codePostal: '',
    ville: '',
    pays: 'France',
    directeurPublication: 'À compléter',
  },
  hebergeur: {
    nom: 'Vercel Inc.',
    adresse: '440 N Barranca Ave #4133, Covina, CA 91723, États-Unis',
    siteWeb: 'https://vercel.com',
  },
  contact: {
    email: 'contact@medicaljob.fr',
    emailRgpd: 'rgpd@medicaljob.fr',
  },
  dateMaj: '2026-06-10',
} as const;

export const NAV = {
  primary: [
    { label: 'Missions', href: '/missions' },
    { label: 'Établissements', href: '/etablissements' },
    { label: 'Remplaçants', href: '/remplacants' },
    { label: 'Métiers', href: '/#metiers' },
    { label: 'Blog', href: '/blog' },
  ],
  footer: {
    'Le service': [
      { label: 'Pour les établissements', href: '/etablissements' },
      { label: 'Pour les remplaçants', href: '/remplacants' },
      { label: 'Comment ça marche', href: '/comment-ca-marche' },
    ],
    'Remplacements': [
      { label: 'Médecin', href: '/metiers/remplacement-medecin' },
      { label: 'Infirmier', href: '/metiers/remplacement-infirmier' },
      { label: 'Pharmacien', href: '/metiers/remplacement-pharmacien' },
      { label: 'Préparateur', href: '/metiers/remplacement-preparateur-pharmacie' },
      { label: 'Sage-femme', href: '/metiers/remplacement-sage-femme' },
    ],
    'Ressources': [
      { label: 'Missions disponibles', href: '/missions' },
      { label: 'Blog', href: '/blog' },
      { label: 'Publier un besoin', href: '/publier-un-besoin' },
      { label: 'S’inscrire comme remplaçant', href: '/inscription-remplacant' },
    ],
    'Légal': [
      { label: 'Mentions légales', href: '/mentions-legales' },
      { label: 'Confidentialité', href: '/confidentialite' },
      { label: 'CGU', href: '/cgu' },
    ],
  },
} as const;

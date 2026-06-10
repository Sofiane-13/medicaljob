import { SITE } from '@data/site';
import type { Metier } from '@data/metiers';
import type { Ville } from '@data/villes';

/* ============================================================
   Helpers Schema.org / JSON-LD — SEO + GEO (AI Overviews)
   ============================================================ */

export function organization() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE.url}#organization`,
    name: SITE.name,
    legalName: SITE.legalName,
    url: SITE.url,
    logo: `${SITE.url}/logo.png`,
    image: `${SITE.url}/og.png`,
    description: SITE.description,
    foundingDate: SITE.founders.foundingDate,
    email: SITE.email,
    sameAs: Object.values(SITE.socials),
    areaServed: SITE.serviceAreas.map((code) => ({
      '@type': 'Country',
      identifier: code,
    })),
  };
}

export function website() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE.url}#website`,
    url: SITE.url,
    name: SITE.name,
    description: SITE.description,
    inLanguage: SITE.defaultLocale,
    publisher: { '@id': `${SITE.url}#organization` },
  };
}

/** Service de mise en relation pour un métier donné. */
export function serviceMetier(metier: Metier) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${SITE.url}/metiers/${metier.slug}#service`,
    name: `Remplacement ${metier.nom.toLowerCase()}`,
    serviceType: `Mise en relation remplacement ${metier.nom.toLowerCase()}`,
    description: metier.metaDescription,
    provider: { '@id': `${SITE.url}#organization` },
    areaServed: { '@type': 'Country', name: 'France', identifier: 'FR' },
    audience: {
      '@type': 'Audience',
      audienceType: `Établissements de santé et ${metier.pluriel.toLowerCase()} remplaçants`,
    },
  };
}

/** Service de mise en relation localisé sur une ville. */
export function serviceVille(ville: Ville) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${SITE.url}/remplacement/${ville.slug}#service`,
    name: `Remplacement médical et en pharmacie à ${ville.nom}`,
    serviceType: 'Mise en relation pour remplacements en santé',
    description: `Trouvez un remplaçant ou une mission de remplacement (médecin, infirmier, pharmacien, sage-femme) à ${ville.nom} et en ${ville.region}.`,
    provider: { '@id': `${SITE.url}#organization` },
    areaServed: {
      '@type': 'City',
      name: ville.nom,
      ...(ville.region ? { containedInPlace: { '@type': 'AdministrativeArea', name: ville.region } } : {}),
    },
  };
}

export function breadcrumb(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE.url}${item.url}`,
    })),
  };
}

export function faqPage(faqs: Array<{ q: string; a: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };
}

/**
 * Combine plusieurs schemas dans un seul @graph (recommandé par Google).
 */
export function buildGraph(...nodes: unknown[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes,
  };
}

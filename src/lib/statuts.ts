/**
 * Statuts d'une candidature et leur rendu — repris de la logique
 * statusTranslations.ts / Badge.tsx de Diasporteur, adapté au remplacement santé.
 */
export type Statut = 'en_attente' | 'acceptee' | 'refusee' | 'annulee' | 'effectuee';

export const STATUT_LABEL: Record<Statut, string> = {
  en_attente: 'En attente',
  acceptee: 'Acceptée',
  refusee: 'Refusée',
  annulee: 'Annulée',
  effectuee: 'Effectuée',
};

/** Couleurs (texte / fond) par statut, alignées sur le design system. */
export const STATUT_STYLE: Record<Statut, { bg: string; fg: string }> = {
  en_attente: { bg: '#fef3c7', fg: '#92400e' },
  acceptee: { bg: '#e3f6f2', fg: '#065f46' },
  refusee: { bg: '#fee2e2', fg: '#991b1b' },
  annulee: { bg: '#eef2f7', fg: '#64748b' },
  effectuee: { bg: '#e7f0fd', fg: '#0e63d6' },
};

export function statutLabel(s: string): string {
  return STATUT_LABEL[s as Statut] ?? s;
}

import { createClient } from '@supabase/supabase-js';
import { SITE } from '@data/site';

/**
 * Client Supabase partagé (navigateur).
 * La session est persistée en localStorage → elle survit aux navigations
 * (y compris le ClientRouter d'Astro) et aux rechargements.
 */
export const supabase = createClient(SITE.supabase.url, SITE.supabase.anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    /**
     * Désactive le verrou navigator.locks de supabase-js : sur une appli
     * mono-onglet, plusieurs accès auth concurrents (Header + page) peuvent
     * sinon provoquer un blocage de la 1re requête quand une session existe.
     */
    lock: async (_name: string, _acquireTimeout: number, fn: () => Promise<any>) => fn(),
  },
});

export const supabaseConfigured =
  !SITE.supabase.url.includes('XXXX') && !SITE.supabase.anonKey.includes('XXXX');

/**
 * Lecture publique via fetch brut (clé anon, AUCUN accès à la session).
 * → ne dépend jamais de l'état d'authentification : ne peut pas se bloquer
 *   même si une session invalide traîne dans le navigateur.
 * Utilisée pour les vues publiques (missions_publiques, remplacants_publics).
 */
export async function publicSelect<T = any>(query: string): Promise<T[]> {
  const res = await fetch(`${SITE.supabase.url}/rest/v1/${query}`, {
    headers: {
      apikey: SITE.supabase.anonKey,
      Authorization: `Bearer ${SITE.supabase.anonKey}`,
    },
  });
  if (!res.ok) return [];
  return res.json();
}

/**
 * getSession avec garde-fou : si l'auth tarde (session corrompue, verrou…),
 * on renvoie null au lieu de bloquer l'UI indéfiniment.
 */
export async function getSessionSafe(timeoutMs = 3500) {
  try {
    const result: any = await Promise.race([
      supabase.auth.getSession(),
      new Promise((resolve) => setTimeout(() => resolve({ data: { session: null } }), timeoutMs)),
    ]);
    return result?.data?.session ?? null;
  } catch {
    return null;
  }
}

/** Profil de l'utilisateur connecté (rôle + identité), ou null. */
export async function getProfile() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();
  return data;
}

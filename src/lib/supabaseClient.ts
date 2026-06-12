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

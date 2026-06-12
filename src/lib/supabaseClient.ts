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

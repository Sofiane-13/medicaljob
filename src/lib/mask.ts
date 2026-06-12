/** Masquage des coordonnées avant révélation — repris de utils de Diasporteur. */

export function maskEmail(email?: string | null): string {
  if (!email) return '';
  const [user, domain] = email.split('@');
  if (!domain) return '•••';
  return `${user.slice(0, 1)}${'•'.repeat(Math.max(3, user.length - 1))}@${domain}`;
}

export function maskPhone(phone?: string | null): string {
  if (!phone) return '';
  const d = phone.replace(/\s+/g, '');
  if (d.length < 4) return '••';
  return `${d.slice(0, 3)} •• •• ${d.slice(-2)}`;
}

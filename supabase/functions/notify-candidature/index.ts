// Edge Function : notifications email des candidatures (via Resend)
// Déclenchée par des Database Webhooks sur la table `candidatures` (INSERT + UPDATE).
//
// Déploiement :
//   supabase functions deploy notify-candidature --no-verify-jwt
//   supabase secrets set RESEND_API_KEY=xxx MEDICALJOB_FROM="MedicalJob <noreply@votre-domaine.fr>"
//
// Webhooks (Dashboard → Database → Webhooks) : 2 hooks vers cette fonction
//   - candidatures / INSERT
//   - candidatures / UPDATE
//
// Inspiré des templates Resend de Diasporteur (NEW_PROPOSAL, PROPOSAL_ACCEPTED, PROPOSAL_REJECTED).

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SITE_URL = 'https://medicaljob.vercel.app';
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') ?? '';
const FROM = Deno.env.get('MEDICALJOB_FROM') ?? 'MedicalJob <onboarding@resend.dev>';

const admin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

async function missionContact(id: string) {
  const { data } = await admin.from('besoins').select('contact_nom, contact_email').eq('id', id).maybeSingle();
  return data;
}
async function profilContact(id: string) {
  const { data } = await admin.from('remplacants').select('nom, email').eq('id', id).maybeSingle();
  return data;
}

async function sendEmail(to: string, subject: string, html: string) {
  if (!RESEND_API_KEY) {
    console.log('RESEND_API_KEY manquante — email non envoyé:', { to, subject });
    return;
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: FROM, to, subject, html }),
  });
  if (!res.ok) console.error('Resend error', res.status, await res.text());
}

function wrap(title: string, body: string) {
  return `<div style="font-family:system-ui,Arial,sans-serif;max-width:520px;margin:auto">
    <h2 style="color:#0e63d6">${title}</h2>
    <p style="color:#45586e;line-height:1.6">${body}</p>
    <p><a href="${SITE_URL}/mon-espace" style="display:inline-block;background:#0e63d6;color:#fff;padding:12px 20px;border-radius:9999px;text-decoration:none;font-weight:600">Voir dans Mon espace</a></p>
    <p style="color:#8696a8;font-size:12px">MedicalJob — mise en relation pour remplacements en santé</p>
  </div>`;
}

Deno.serve(async (req) => {
  try {
    const payload = await req.json();
    const type: string = payload.type;
    const c = payload.record;
    const old = payload.old_record;
    if (!c) return new Response('no record', { status: 200 });

    // Cible (propriétaire) et proposeur, selon le sens de la candidature
    const targetIsMissionOwner = c.proposer_role === 'remplacant';

    if (type === 'INSERT') {
      // Notifier la CIBLE qu'une candidature/proposition est arrivée
      if (targetIsMissionOwner) {
        const m = await missionContact(c.mission_id);
        if (m?.contact_email) {
          await sendEmail(
            m.contact_email,
            'Nouvelle candidature pour votre mission',
            wrap(
              'Vous avez reçu une candidature',
              `${c.profil_libelle ?? 'Un remplaçant'} a postulé à votre mission « ${c.mission_libelle ?? ''} ».`
            )
          );
        }
      } else {
        const p = await profilContact(c.profil_id);
        if (p?.email) {
          await sendEmail(
            p.email,
            'Une mission vous est proposée',
            wrap(
              'Nouvelle proposition de mission',
              `Un établissement vous propose la mission « ${c.mission_libelle ?? ''} ».`
            )
          );
        }
      }
      return new Response('ok', { status: 200 });
    }

    if (type === 'UPDATE' && old && old.statut === 'en_attente' && c.statut !== 'en_attente') {
      // Notifier le PROPOSEUR du résultat
      const proposerContact = c.proposer_role === 'remplacant'
        ? await profilContact(c.profil_id)
        : await missionContact(c.mission_id);
      const email = (proposerContact as any)?.email ?? (proposerContact as any)?.contact_email;
      if (email) {
        if (c.statut === 'acceptee') {
          await sendEmail(
            email,
            'Votre candidature a été acceptée 🎉',
            wrap(
              'Candidature acceptée',
              `Bonne nouvelle ! Votre candidature/proposition (« ${c.mission_libelle ?? ''} ») a été acceptée. Les coordonnées sont désormais visibles dans votre espace.`
            )
          );
        } else if (c.statut === 'refusee') {
          await sendEmail(
            email,
            'Votre candidature n’a pas été retenue',
            wrap(
              'Candidature non retenue',
              `Votre candidature/proposition (« ${c.mission_libelle ?? ''} ») n’a pas été retenue cette fois. D’autres missions vous attendent.`
            )
          );
        }
      }
      return new Response('ok', { status: 200 });
    }

    return new Response('ignored', { status: 200 });
  } catch (e) {
    console.error(e);
    return new Response('error', { status: 200 });
  }
});

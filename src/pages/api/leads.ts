import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';
import { Resend } from 'resend';

const variantLabels: Record<string, string> = {
  A: 'RDV Cabinet (decouverte)',
  B: 'RDV Consultation',
  C: 'RDV Direct',
};

async function sendNotificationEmail(lead: Record<string, string | null>) {
  const apiKey = import.meta.env.RESEND_API_KEY;
  const notifEmail = import.meta.env.NOTIFICATION_EMAIL;

  if (!apiKey || apiKey === 're_VOTRE_CLE_API_ICI' || !notifEmail) {
    console.warn('Email notification skipped: RESEND_API_KEY or NOTIFICATION_EMAIL not configured');
    return;
  }

  const resend = new Resend(apiKey);

  const variant = variantLabels[lead.form_variant || ''] || lead.form_variant;
  const date = new Date().toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const fields = [
    { label: 'Prenom', value: lead.first_name },
    { label: 'Nom', value: lead.last_name },
    { label: 'Email', value: lead.email },
    { label: 'Telephone', value: lead.phone },
    { label: 'Problematique', value: lead.problematique },
    { label: 'Message', value: lead.message },
    { label: 'Formulaire', value: variant },
    { label: 'Page source', value: lead.source_page },
    { label: 'UTM Source', value: lead.utm_source },
  ].filter((f) => f.value);

  const htmlRows = fields
    .map(
      (f) =>
        `<tr>
          <td style="padding:8px 12px;font-weight:600;color:#3D3731;border-bottom:1px solid #F0EDE8;width:140px">${f.label}</td>
          <td style="padding:8px 12px;color:#524A42;border-bottom:1px solid #F0EDE8">${f.value}</td>
        </tr>`
    )
    .join('');

  const html = `
    <div style="font-family:'DM Sans',system-ui,sans-serif;max-width:560px;margin:0 auto">
      <div style="background:linear-gradient(135deg,#FF7A4D,#E8603A);padding:24px 32px;border-radius:16px 16px 0 0">
        <h1 style="color:white;font-size:20px;margin:0">Nouveau lead - ${variant}</h1>
        <p style="color:#FFEDE4;font-size:14px;margin:8px 0 0">${date}</p>
      </div>
      <div style="background:white;padding:24px 32px;border:1px solid #EDE6DD;border-top:none;border-radius:0 0 16px 16px">
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          ${htmlRows}
        </table>
        <div style="margin-top:24px;text-align:center">
          <a href="https://psychologue-tca-lyon.fr/admin"
             style="display:inline-block;padding:10px 24px;background:#FF7A4D;color:white;text-decoration:none;border-radius:24px;font-weight:600;font-size:14px">
            Voir le dashboard
          </a>
        </div>
      </div>
    </div>
  `;

  try {
    await resend.emails.send({
      from: 'Psychologue TCA Lyon <onboarding@resend.dev>',
      to: notifEmail,
      subject: `Nouveau lead (${variant}) - ${lead.first_name || 'Sans nom'}`,
      html,
    });
  } catch (err) {
    console.error('Email notification failed:', err);
  }
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    const {
      first_name,
      last_name,
      email,
      phone,
      message,
      problematique,
      form_variant,
      source_page,
      utm_source,
      utm_medium,
      utm_campaign,
    } = body;

    if (!first_name || !form_variant) {
      return new Response(
        JSON.stringify({ error: 'Champs obligatoires manquants' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const leadData = {
      first_name,
      last_name: last_name || '',
      email: email || '',
      phone: phone || null,
      message: message || null,
      problematique: problematique || null,
      form_variant,
      source_page: source_page || null,
      status: 'new',
      utm_source: utm_source || null,
      utm_medium: utm_medium || null,
      utm_campaign: utm_campaign || null,
    };

    const { error } = await supabase.from('leads').insert(leadData);

    if (error) {
      console.error('Supabase error:', error);
      return new Response(
        JSON.stringify({ error: 'Erreur lors de l\'enregistrement' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Send email notification (non-blocking - don't fail the request if email fails)
    sendNotificationEmail(leadData);

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch {
    return new Response(
      JSON.stringify({ error: 'Erreur serveur' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';
import { Resend } from 'resend';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { first_name, email, form_variant, source_page } = body;

    if (!first_name || !email || !form_variant) {
      return new Response(
        JSON.stringify({ error: 'Champs obligatoires manquants' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Anti-doublon : vérifier si un enregistrement identique existe dans les 24h
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data: existing } = await supabase
      .from('form_starts')
      .select('id')
      .eq('email', email)
      .eq('form_variant', form_variant)
      .gte('created_at', twentyFourHoursAgo)
      .limit(1);

    if (existing && existing.length > 0) {
      return new Response(
        JSON.stringify({ success: true, duplicate: true }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Insérer dans form_starts
    const { error } = await supabase.from('form_starts').insert({
      first_name,
      email,
      form_variant,
      source_page: source_page || null,
    });

    if (error) {
      console.error('Supabase error (form_starts):', error);
      return new Response(
        JSON.stringify({ error: "Erreur lors de l'enregistrement" }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Envoyer email de notification
    sendFormStartEmail({ first_name, email, form_variant, source_page });

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

const variantLabels: Record<string, string> = {
  A: 'RDV Cabinet (decouverte)',
  B: 'RDV Consultation',
  C: 'RDV Direct',
};

async function sendFormStartEmail(data: {
  first_name: string;
  email: string;
  form_variant: string;
  source_page?: string;
}) {
  const apiKey = import.meta.env.RESEND_API_KEY;
  const notifEmail = import.meta.env.NOTIFICATION_EMAIL || 'contact.kivio@gmail.com';

  if (!apiKey || apiKey === 're_VOTRE_CLE_API_ICI') {
    console.warn('Email notification skipped: RESEND_API_KEY not configured');
    return;
  }

  const resend = new Resend(apiKey);
  const variant = variantLabels[data.form_variant] || data.form_variant;
  const date = new Date().toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const html = `
    <div style="font-family:'DM Sans',system-ui,sans-serif;max-width:560px;margin:0 auto">
      <div style="background:linear-gradient(135deg,#F59E0B,#D97706);padding:24px 32px;border-radius:16px 16px 0 0">
        <h1 style="color:white;font-size:20px;margin:0">Formulaire commence</h1>
        <p style="color:#FEF3C7;font-size:14px;margin:8px 0 0">${date}</p>
      </div>
      <div style="background:white;padding:24px 32px;border:1px solid #EDE6DD;border-top:none;border-radius:0 0 16px 16px">
        <p style="color:#524A42;font-size:14px;margin:0 0 16px">Un utilisateur a commence a remplir le formulaire <strong>${variant}</strong>.</p>
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          <tr>
            <td style="padding:8px 12px;font-weight:600;color:#3D3731;border-bottom:1px solid #F0EDE8;width:140px">Prenom</td>
            <td style="padding:8px 12px;color:#524A42;border-bottom:1px solid #F0EDE8">${data.first_name}</td>
          </tr>
          <tr>
            <td style="padding:8px 12px;font-weight:600;color:#3D3731;border-bottom:1px solid #F0EDE8;width:140px">Email</td>
            <td style="padding:8px 12px;color:#524A42;border-bottom:1px solid #F0EDE8">${data.email}</td>
          </tr>
          <tr>
            <td style="padding:8px 12px;font-weight:600;color:#3D3731;border-bottom:1px solid #F0EDE8;width:140px">Formulaire</td>
            <td style="padding:8px 12px;color:#524A42;border-bottom:1px solid #F0EDE8">${variant}</td>
          </tr>
          ${data.source_page ? `<tr>
            <td style="padding:8px 12px;font-weight:600;color:#3D3731;border-bottom:1px solid #F0EDE8;width:140px">Page source</td>
            <td style="padding:8px 12px;color:#524A42;border-bottom:1px solid #F0EDE8">${data.source_page}</td>
          </tr>` : ''}
        </table>
        <p style="color:#9CA3AF;font-size:12px;margin:16px 0 0;font-style:italic">Ce lead n'a pas encore soumis le formulaire.</p>
        <div style="margin-top:24px;text-align:center">
          <a href="https://psychologue-tca-lyon.fr/admin"
             style="display:inline-block;padding:10px 24px;background:#D97706;color:white;text-decoration:none;border-radius:24px;font-weight:600;font-size:14px">
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
      subject: `Formulaire commence - ${data.first_name} (${variant})`,
      html,
    });
  } catch (err) {
    console.error('Form start email notification failed:', err);
  }
}

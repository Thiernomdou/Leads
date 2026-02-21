import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { session_id, page_path, referrer, utm_source, utm_medium, utm_campaign, device_type } = body;

    if (!session_id || !page_path) {
      return new Response(
        JSON.stringify({ error: 'session_id et page_path requis' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { data, error } = await supabase
      .from('page_views')
      .insert({
        session_id,
        page_path,
        referrer: referrer || null,
        utm_source: utm_source || null,
        utm_medium: utm_medium || null,
        utm_campaign: utm_campaign || null,
        device_type: device_type || null,
      })
      .select('id')
      .single();

    if (error) {
      console.error('Track insert error:', error);
      return new Response(
        JSON.stringify({ error: 'Erreur enregistrement' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ id: data.id }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch {
    return new Response(
      JSON.stringify({ error: 'Erreur serveur' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const PATCH: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { id, duration_seconds, scroll_depth, sections_viewed, cta_clicked } = body;

    if (!id) {
      return new Response(
        JSON.stringify({ error: 'id requis' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const update: Record<string, unknown> = {};
    if (duration_seconds !== undefined) update.duration_seconds = duration_seconds;
    if (scroll_depth !== undefined) update.scroll_depth = scroll_depth;
    if (sections_viewed !== undefined) update.sections_viewed = sections_viewed;
    if (cta_clicked !== undefined) update.cta_clicked = cta_clicked;

    const { error } = await supabase
      .from('page_views')
      .update(update)
      .eq('id', id);

    if (error) {
      console.error('Track update error:', error);
      return new Response(
        JSON.stringify({ error: 'Erreur mise a jour' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

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

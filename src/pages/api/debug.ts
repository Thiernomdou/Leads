import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const checks = {
    PUBLIC_SUPABASE_URL: !!import.meta.env.PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_ANON_KEY: !!import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
    RESEND_API_KEY: !!import.meta.env.RESEND_API_KEY,
    NOTIFICATION_EMAIL: !!import.meta.env.NOTIFICATION_EMAIL,
  };

  let supabaseOk = false;
  let supabaseError = '';
  try {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      import.meta.env.PUBLIC_SUPABASE_URL || '',
      import.meta.env.PUBLIC_SUPABASE_ANON_KEY || ''
    );
    const { error } = await supabase.from('leads').select('id').limit(1);
    supabaseOk = !error;
    supabaseError = error?.message || '';
  } catch (e: any) {
    supabaseError = e.message;
  }

  let resendOk = false;
  let resendError = '';
  try {
    const { Resend } = await import('resend');
    new Resend(import.meta.env.RESEND_API_KEY || 'test');
    resendOk = true;
  } catch (e: any) {
    resendError = e.message;
  }

  return new Response(
    JSON.stringify({ checks, supabaseOk, supabaseError, resendOk, resendError }, null, 2),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
};

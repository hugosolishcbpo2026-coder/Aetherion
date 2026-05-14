import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Server-side Supabase client. Use in Server Components, Route Handlers,
 * and Server Actions. Reads/writes the session cookie via Next's cookies() API.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options as CookieOptions),
            );
          } catch {
            // called from a Server Component — middleware refreshes the session
          }
        },
      },
    },
  );
}

/**
 * Admin client — bypasses RLS. ONLY use in trusted server contexts
 * (webhooks, background jobs). Never expose to client code.
 */
export async function createAdminClient() {
  const { createClient: createServiceClient } = await import('@supabase/supabase-js');
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}

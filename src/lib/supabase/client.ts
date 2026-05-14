import { createBrowserClient } from '@supabase/ssr';

/**
 * Client-side Supabase client. Singleton — call createClient() anywhere
 * in Client Components, it returns the same instance.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

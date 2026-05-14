import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Runs on every request. Refreshes the auth session cookie and redirects
 * unauthenticated users away from protected routes.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register');
  const isProtected =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/crm') ||
    pathname.startsWith('/bookings') ||
    pathname.startsWith('/marketplace') ||
    pathname.startsWith('/memberships') ||
    pathname.startsWith('/documents') ||
    pathname.startsWith('/messages') ||
    pathname.startsWith('/automations') ||
    pathname.startsWith('/analytics') ||
    pathname.startsWith('/ai') ||
    pathname.startsWith('/vendors') ||
    pathname.startsWith('/settings') ||
    pathname.startsWith('/portal');

  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  if (user && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return response;
}

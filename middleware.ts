import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh the session so it doesn't expire while the user is on the page
  const { data: { user } } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Protect /dashboard — redirect to /login if not authenticated
  if (pathname.startsWith('/dashboard') && !user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Protect /portal-admin — redirect to /admin-login if not authenticated
  if (pathname.startsWith('/portal-admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/admin-login', request.url));
    }
    // Also verify the user has an admin role at the middleware layer
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    if (!profile || !['super_admin', 'coordinator'].includes(profile.role)) {
      return NextResponse.redirect(new URL('/admin-login', request.url));
    }
  }

  // Redirect already-logged-in users away from login/register pages
  if (user && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Run middleware ONLY on these routes.
     * Explicitly exclude sitemap.xml, robots.txt and static files
     * so Googlebot can always fetch them without interference.
     */
    '/dashboard/:path*',
    '/portal-admin/:path*',
    '/login',
    '/register',
  ],
};

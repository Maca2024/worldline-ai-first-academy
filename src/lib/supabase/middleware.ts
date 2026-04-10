import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { UserRole } from '@/lib/types/database';

const PROTECTED_ROUTES: Record<string, UserRole[]> = {
  '/academy': ['student', 'instructor', 'admin'],
  '/dashboard': ['instructor', 'admin'],
};

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: Record<string, unknown>) {
          request.cookies.set({ name, value, ...options });
          supabaseResponse = NextResponse.next({ request });
          supabaseResponse.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: Record<string, unknown>) {
          request.cookies.set({ name, value: '', ...options });
          supabaseResponse = NextResponse.next({ request });
          supabaseResponse.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');
  const isApiRoute = pathname.startsWith('/api/');

  // Redirect unauthenticated users away from protected UI routes
  if (!user && !isAuthPage && !isApiRoute) {
    const routePrefix = Object.keys(PROTECTED_ROUTES).find((r) => pathname.startsWith(r));
    if (routePrefix) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
  }

  // Redirect authenticated users away from auth pages
  if (user && isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = '/academy';
    return NextResponse.redirect(url);
  }

  // Role-based access control for protected routes
  if (user) {
    const matchedPrefix = Object.keys(PROTECTED_ROUTES).find((r) => pathname.startsWith(r));

    if (matchedPrefix) {
      const allowedRoles = PROTECTED_ROUTES[matchedPrefix];

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      const userRole = (profile?.role as UserRole) ?? 'student';

      if (!allowedRoles.includes(userRole)) {
        const url = request.nextUrl.clone();
        // Students who try /dashboard → /academy
        // Others who have no valid role → /login
        url.pathname = userRole === 'student' ? '/academy' : '/login';
        return NextResponse.redirect(url);
      }
    }
  }

  return supabaseResponse;
}

import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';
import { pathRequiresAdmin } from '@/lib/auth/permissions';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

const PUBLIC_ADMIN_PATHS = [
  '/admin/login',
  '/admin/forgot-password',
  '/admin/reset-password',
  '/admin/auth/callback',
  '/admin/api/auth/login',
  '/admin/api/auth/forgot-password',
];

function isPublicAdminPath(pathname: string): boolean {
  return PUBLIC_ADMIN_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(supabaseUrl!, supabaseKey!, {
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
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  if (!pathname.startsWith('/admin')) {
    supabaseResponse.headers.set('x-pathname', pathname);
    return supabaseResponse;
  }

  const isPublic = isPublicAdminPath(pathname);
  const isLoggedIn = !!user;

  if (!isLoggedIn && !isPublic) {
    const login = new URL('/admin/login', request.nextUrl.origin);
    login.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(login);
  }

  if (isLoggedIn && pathname === '/admin/login') {
    return NextResponse.redirect(new URL('/admin', request.nextUrl.origin));
  }

  if (isLoggedIn && pathRequiresAdmin(pathname)) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, status')
      .eq('id', user!.id)
      .single();

    if (profile?.status !== 'ACTIVE' || profile?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/admin', request.nextUrl.origin));
    }
  }

  supabaseResponse.headers.set('x-pathname', pathname);
  return supabaseResponse;
}

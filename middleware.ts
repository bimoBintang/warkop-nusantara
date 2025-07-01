import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  const { pathname } = request.nextUrl;

  // Create a default response
  let response = NextResponse.next();

  // 1. Atur `hide-layout` cookie berdasarkan route
  const hideLayoutRoutes = ['/auth/login'];
  const shouldHideLayout = hideLayoutRoutes.some(route => pathname.startsWith(route));
  response.cookies.set('hide-layout', shouldHideLayout ? 'true' : 'false', { path: '/' });

  // 2. Cek route yang perlu dilindungi
  const protectedRoutes = ['/dashboard'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  const tokenIsValid = token && verifyToken(token);

  // 3. Kalau akses halaman dilindungi tanpa token → redirect ke login
  if (isProtectedRoute && !tokenIsValid) {
    const redirect = NextResponse.redirect(new URL('/auth/login', request.url));
    redirect.cookies.delete('auth-token');
    redirect.cookies.set('hide-layout', 'true', { path: '/' });
    return redirect;
  }

  // 4. Kalau sudah login tapi akses /auth/login → redirect ke dashboard
  const isAuthPage = pathname === '/auth/login';
  if (tokenIsValid && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return response;
}

// 5. Middleware akan dijalankan untuk semua route KECUALI yang perlu dikecualikan (API, _next, dll)
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

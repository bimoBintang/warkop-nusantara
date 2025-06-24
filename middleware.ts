import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  const { pathname } = request.nextUrl;

  let response = NextResponse.next();

  const hideLayoutRoutes = ['/auth/login', '/dashboard'];
  const shouldHideLayout = hideLayoutRoutes.some(route => pathname.startsWith(route));

  if (shouldHideLayout) {
    response.cookies.set('hide-layout', 'true', { path: '/' });
  } else {
    response.cookies.set('hide-layout', 'false', { path: '/' });
  }

  const protectedRoutes = ['/dashboard', '/profile'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  const tokenIsValid = token && verifyToken(token);

  if (isProtectedRoute && !tokenIsValid) {
    const redirect = NextResponse.redirect(new URL('/auth/login', request.url));
    redirect.cookies.delete('auth-token');
    redirect.cookies.set('hide-layout', 'true', { path: '/' });
    return redirect;
  }

  const isAuthPage = pathname === '/auth/login';

  if (tokenIsValid && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

import { NextResponse, type NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { routing } from '#i18n/routing';
import createMiddleware from 'next-intl/middleware';

const i18nMiddleware = createMiddleware(routing);

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not set');
}

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

const PUBLIC_PATHS = [
  '',
  '/',
  '/auth/login',
  '/auth/signup',
  '/auth/forgot-password',
  '/auth/reset-password',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const locale = pathname.split('/')[1] || 'en';
  const pathnameWithoutLocale = pathname.replace(`/${locale}`, '');
  console.log('pathnameWithoutLocale', pathnameWithoutLocale);

  // Allow public paths
  if (!PUBLIC_PATHS.includes(pathnameWithoutLocale)) {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      const url = new URL(`/${locale}/auth/login`, request.url);
      url.searchParams.set('from', pathname);
      return NextResponse.redirect(url);
    }

    try {
      await jwtVerify(token, JWT_SECRET);
      return NextResponse.next();
    } catch {
      const url = new URL(`/${locale}/auth/login`, request.url);
      url.searchParams.set('from', pathname);
      return NextResponse.redirect(url);
    }
  }

  return i18nMiddleware(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

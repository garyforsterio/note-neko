import { NextResponse, type NextRequest } from 'next/server';
import { routing } from '#i18n/routing';
import createMiddleware from 'next-intl/middleware';
import { validateTokens } from '#lib/auth';

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

  // Allow public paths
  if (!PUBLIC_PATHS.includes(pathnameWithoutLocale)) {
    const userId = await validateTokens();

    if (!userId) {
      const url = new URL(`/${locale}/auth/login`, request.url);
      url.searchParams.set('from', pathname);
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
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
    '/((?!api|images|manifest.json|_next/static|_next/image|favicon.ico).*)',
  ],
  runtime: 'nodejs',
};

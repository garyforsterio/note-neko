import { type NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "#i18n/routing";
import { validateTokens } from "#lib/auth";

const i18nMiddleware = createMiddleware(routing);

const AUTH_PATHS = [
	"/auth/login",
	"/auth/signup",
	"/auth/forgot-password",
	"/auth/reset-password",
];

const PUBLIC_PATHS = ["", "/", ...AUTH_PATHS];

export async function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;

	const locale = pathname.split("/")[1] || "en";
	const pathnameWithoutLocale = pathname.replace(`/${locale}`, "");

	// Allow public paths
	if (!PUBLIC_PATHS.includes(pathnameWithoutLocale)) {
		const result = await validateTokens();

		if (!result) {
			const url = new URL(`/${locale}/auth/login`, request.url);
			url.searchParams.set("from", pathname);
			return NextResponse.redirect(url);
		}

		// If access token was refreshed, redirect to same URL with 307 status
		if (result.wasRefreshed) {
			return NextResponse.redirect(request.url, 307);
		}

		return NextResponse.next();
	}

	// If the user is logged in and tries to access an auth page, redirect to the diary page
	if (AUTH_PATHS.includes(pathnameWithoutLocale)) {
		const result = await validateTokens();
		if (result) {
			const url = new URL(`/${locale}/diary`, request.url);
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
		"/((?!api|images|.well-known|monitoring|manifest.json|_next/static|_next/image|favicon.ico).*)",
	],
};

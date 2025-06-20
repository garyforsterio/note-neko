import * as Sentry from "@sentry/nextjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "#i18n/navigation";
import { db } from "#lib/db";

if (!process.env.JWT_SECRET) {
	throw new Error("JWT_SECRET is not set");
}

const JWT_SECRET = new TextEncoder().encode(
	process.env.JWT_SECRET || "your-secret-key",
);

async function generateTokens(userId: string) {
	const accessToken = await new SignJWT({ userId })
		.setProtectedHeader({ alg: "HS256" })
		.setExpirationTime("1h")
		.sign(JWT_SECRET);

	const refreshToken = crypto.randomUUID();
	const refreshTokenExpiry = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // 30 days

	await db.refreshToken.create({
		data: {
			token: refreshToken,
			userId,
			expiresAt: refreshTokenExpiry,
		},
	});

	return { accessToken, refreshToken };
}

async function setTokens(accessToken: string, refreshToken: string) {
	const cookieStore = await cookies();
	cookieStore.set("accessToken", accessToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		maxAge: 60 * 60, // 1 hour
	});
	cookieStore.set("refreshToken", refreshToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		maxAge: 60 * 60 * 24 * 30, // 30 days
	});
}

export async function createUserSession(userId: string): Promise<string> {
	const { accessToken, refreshToken } = await generateTokens(userId);
	await setTokens(accessToken, refreshToken);
	return accessToken;
}

async function refreshAccessToken() {
	const cookieStore = await cookies();
	const refreshToken = cookieStore.get("refreshToken")?.value;

	if (!refreshToken) {
		console.debug("No refresh token found");
		return null;
	}

	const storedToken = await db.refreshToken.findUnique({
		where: { token: refreshToken },
		include: { user: true },
	});

	if (!storedToken) {
		console.debug("No stored token found");
		return null;
	}

	if (storedToken.expiresAt < new Date()) {
		await db.refreshToken.delete({
			where: { id: storedToken.id },
		});
		console.debug("Token expired, deleting");
		return null;
	}

	const accessToken = await createUserSession(storedToken.userId);

	await db.refreshToken.delete({
		where: { id: storedToken.id },
	});

	console.debug("Access token refreshed");

	return accessToken;
}

export async function validateTokens(): Promise<string | null> {
	const cookieStore = await cookies();
	let accessToken: string | undefined | null =
		cookieStore.get("accessToken")?.value;

	if (!accessToken) {
		console.debug("No access token found, refreshing");
		accessToken = await refreshAccessToken();
		if (!accessToken) return null;
	}

	try {
		const { payload } = await jwtVerify(accessToken, JWT_SECRET);
		return payload.userId as string;
	} catch (error) {
		Sentry.captureException(error);
		return null;
	}
}

export async function getCurrentUser() {
	try {
		const userId = await validateTokens();
		if (!userId) return null;
		const user = await db.user.findUnique({
			where: { id: userId },
			select: {
				id: true,
				email: true,
			},
		});

		return user;
	} catch (error) {
		Sentry.captureException(error);
		return null;
	}
}

export async function requireAuth() {
	const user = await getCurrentUser();
	if (!user) {
		return redirect({
			href: "/auth/login",
			locale: "en",
		});
	}
	return user;
}

export async function deleteUserSession() {
	const cookieStore = await cookies();

	const refreshToken = cookieStore.get("refreshToken")?.value;
	if (refreshToken) {
		await db.refreshToken.delete({
			where: { token: refreshToken },
		});
	}

	cookieStore.delete("accessToken");
	cookieStore.delete("refreshToken");
}

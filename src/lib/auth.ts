import * as Sentry from "@sentry/nextjs";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { cache } from "react";
import { redirect } from "#i18n/navigation";
import { db } from "#lib/db";

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

async function refreshAccessToken(refreshToken: string) {
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

export const validateTokens = cache(
	async (): Promise<{
		userId: string;
		wasRefreshed: boolean;
	} | null> => {
		const cookieStore = await cookies();
		const refreshToken = cookieStore.get("refreshToken")?.value;

		if (!refreshToken) {
			console.debug("No refresh token found");
			return null;
		}

		let accessToken: string | undefined | null =
			cookieStore.get("accessToken")?.value;
		let wasRefreshed = false;

		if (!accessToken) {
			console.debug("No access token found, refreshing");
			accessToken = await refreshAccessToken(refreshToken);
			if (!accessToken) return null;
			wasRefreshed = true;
		}

		try {
			const { payload } = await jwtVerify(accessToken, JWT_SECRET);
			return {
				userId: payload.userId as string,
				wasRefreshed,
			};
		} catch (error) {
			Sentry.captureException(error);
			return null;
		}
	},
);

export async function requireAuth() {
	const result = await validateTokens();
	if (!result) {
		return redirect({
			href: "/auth/login",
			locale: "en",
		});
	}
	return result;
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

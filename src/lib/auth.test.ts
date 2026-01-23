import * as Sentry from "@sentry/nextjs";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { redirect } from "#i18n/navigation";
import { db } from "#lib/db";
import {
	createUserSession,
	deleteUserSession,
	requireAuth,
	validateTokens,
} from "./auth";

// Mock dependencies
vi.mock("@sentry/nextjs", () => ({
	captureException: vi.fn(),
}));

vi.mock("next/headers", () => ({
	cookies: vi.fn(),
}));

vi.mock("#i18n/navigation", () => ({
	redirect: vi.fn(),
}));

vi.mock("#lib/db", () => ({
	db: {
		refreshToken: {
			create: vi.fn(),
			findUnique: vi.fn(),
			delete: vi.fn(),
		},
		user: {
			findUnique: vi.fn(),
		},
	},
}));

vi.mock("jose", () => ({
	SignJWT: vi.fn(),
	jwtVerify: vi.fn(),
}));

describe("auth.ts", () => {
	const mockCookieStore = {
		get: vi.fn(),
		set: vi.fn(),
		delete: vi.fn(),
	};

	const mockUser = {
		id: "user-123",
		email: "test@example.com",
	};

	const mockRefreshToken = {
		id: "refresh-123",
		token: "refresh-token-123",
		userId: "user-123",
		expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
		createdAt: new Date(),
		updatedAt: new Date(),
		user: mockUser,
	};

	const mockSignJWT = vi.mocked(SignJWT);
	const mockJwtVerify = vi.mocked(jwtVerify);

	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(cookies).mockResolvedValue(
			mockCookieStore as unknown as Awaited<ReturnType<typeof cookies>>,
		);
	});

	describe("createUserSession", () => {
		it("should create a new user session with tokens", async () => {
			const mockAccessToken = "mock-access-token";

			// Mock SignJWT constructor and methods
			const mockSign = vi.fn().mockResolvedValue(mockAccessToken);
			const mockSetProtectedHeader = vi.fn().mockReturnThis();
			const mockSetExpirationTime = vi.fn().mockReturnThis();

			mockSignJWT.mockImplementation(function (this: unknown) {
				return {
					setProtectedHeader: mockSetProtectedHeader,
					setExpirationTime: mockSetExpirationTime,
					sign: mockSign,
				} as unknown as SignJWT;
			});

			// Mock database create
			vi.mocked(db.refreshToken.create).mockResolvedValue({
				id: "refresh-123",
				token: "mock-uuid",
				userId: "user-123",
				expiresAt: new Date(),
				createdAt: new Date(),
				updatedAt: new Date(),
			});

			const result = await createUserSession("user-123");

			expect(result).toBe(mockAccessToken);
			expect(db.refreshToken.create).toHaveBeenCalledWith({
				data: {
					token: "mock-uuid",
					userId: "user-123",
					expiresAt: expect.any(Date),
				},
			});
			expect(mockCookieStore.set).toHaveBeenCalledTimes(2);
		});
	});

	describe("validateTokens", () => {
		it("should return null when no refresh token is found", async () => {
			mockCookieStore.get.mockReturnValue(undefined);

			const result = await validateTokens();

			expect(result).toBeNull();
		});

		it("should return user data when access token is valid", async () => {
			mockCookieStore.get.mockImplementation((name: string) => {
				if (name === "refreshToken") return { value: "refresh-token-123" };
				if (name === "accessToken") return { value: "access-token-123" };
				return undefined;
			});

			mockJwtVerify.mockResolvedValue({
				payload: { userId: "user-123" },
				protectedHeader: { alg: "HS256" },
				key: {} as unknown as Uint8Array,
			} as unknown as Awaited<ReturnType<typeof jwtVerify>>);

			const result = await validateTokens();

			expect(result).toEqual({
				userId: "user-123",
				wasRefreshed: false,
			});
		});

		it("should refresh token when access token is missing", async () => {
			mockCookieStore.get.mockImplementation((name: string) => {
				if (name === "refreshToken") return { value: "refresh-token-123" };
				if (name === "accessToken") return undefined;
				return undefined;
			});

			// Mock database operations for refresh
			vi.mocked(db.refreshToken.findUnique).mockResolvedValue(mockRefreshToken);
			vi.mocked(db.refreshToken.delete).mockResolvedValue(mockRefreshToken);
			vi.mocked(db.refreshToken.create).mockResolvedValue({
				id: "new-refresh-123",
				token: "mock-uuid",
				userId: "user-123",
				expiresAt: new Date(),
				createdAt: new Date(),
				updatedAt: new Date(),
			});

			// Mock SignJWT for new token
			const mockSign = vi.fn().mockResolvedValue("new-access-token");
			const mockSetProtectedHeader = vi.fn().mockReturnThis();
			const mockSetExpirationTime = vi.fn().mockReturnThis();

			mockSignJWT.mockImplementation(function (this: unknown) {
				return {
					setProtectedHeader: mockSetProtectedHeader,
					setExpirationTime: mockSetExpirationTime,
					sign: mockSign,
				} as unknown as SignJWT;
			});

			mockJwtVerify.mockResolvedValue({
				payload: { userId: "user-123" },
				protectedHeader: { alg: "HS256" },
				key: {} as unknown as Uint8Array,
			} as unknown as Awaited<ReturnType<typeof jwtVerify>>);

			const result = await validateTokens();

			expect(result).toEqual({
				userId: "user-123",
				wasRefreshed: true,
			});
			expect(db.refreshToken.findUnique).toHaveBeenCalledWith({
				where: { token: "refresh-token-123" },
				include: { user: true },
			});
		});

		it("should return null when refresh token is expired", async () => {
			mockCookieStore.get.mockImplementation((name: string) => {
				if (name === "refreshToken") return { value: "refresh-token-123" };
				if (name === "accessToken") return undefined;
				return undefined;
			});

			const expiredToken = {
				...mockRefreshToken,
				expiresAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
			};

			vi.mocked(db.refreshToken.findUnique).mockResolvedValue(expiredToken);
			vi.mocked(db.refreshToken.delete).mockResolvedValue(expiredToken);

			const result = await validateTokens();

			expect(result).toBeNull();
			expect(db.refreshToken.delete).toHaveBeenCalledWith({
				where: { id: expiredToken.id },
			});
		});

		it("should return null when refresh token is not found in database", async () => {
			mockCookieStore.get.mockImplementation((name: string) => {
				if (name === "refreshToken") return { value: "invalid-token" };
				if (name === "accessToken") return undefined;
				return undefined;
			});

			vi.mocked(db.refreshToken.findUnique).mockResolvedValue(null);

			const result = await validateTokens();

			expect(result).toBeNull();
		});

		it("should handle JWT verification errors", async () => {
			mockCookieStore.get.mockImplementation((name: string) => {
				if (name === "refreshToken") return { value: "refresh-token-123" };
				if (name === "accessToken") return { value: "invalid-token" };
				return undefined;
			});

			const jwtError = new Error("Invalid token");
			mockJwtVerify.mockRejectedValue(jwtError);

			const result = await validateTokens();

			expect(result).toBeNull();
			expect(Sentry.captureException).toHaveBeenCalledWith(jwtError);
		});
	});

	describe("requireAuth", () => {
		it("should return user data when authentication is valid", async () => {
			mockCookieStore.get.mockImplementation((name: string) => {
				if (name === "refreshToken") return { value: "refresh-token-123" };
				if (name === "accessToken") return { value: "access-token-123" };
				return undefined;
			});

			mockJwtVerify.mockResolvedValue({
				payload: { userId: "user-123" },
				protectedHeader: { alg: "HS256" },
				key: {} as unknown as Uint8Array,
			} as unknown as Awaited<ReturnType<typeof jwtVerify>>);

			const result = await requireAuth();

			expect(result).toEqual({
				userId: "user-123",
				wasRefreshed: false,
			});
		});

		it("should redirect to login when authentication fails", async () => {
			mockCookieStore.get.mockReturnValue(undefined);

			await requireAuth();

			expect(redirect).toHaveBeenCalledWith({
				href: "/auth/login",
				locale: "en",
			});
		});
	});

	describe("deleteUserSession", () => {
		it("should delete tokens and cookies", async () => {
			mockCookieStore.get.mockImplementation((name: string) => {
				if (name === "refreshToken") return { value: "refresh-token-123" };
				return undefined;
			});

			vi.mocked(db.refreshToken.delete).mockResolvedValue(mockRefreshToken);

			await deleteUserSession();

			expect(db.refreshToken.delete).toHaveBeenCalledWith({
				where: { token: "refresh-token-123" },
			});
			expect(mockCookieStore.delete).toHaveBeenCalledWith("accessToken");
			expect(mockCookieStore.delete).toHaveBeenCalledWith("refreshToken");
		});

		it("should handle case when no refresh token exists", async () => {
			mockCookieStore.get.mockReturnValue(undefined);

			await deleteUserSession();

			expect(db.refreshToken.delete).not.toHaveBeenCalled();
			expect(mockCookieStore.delete).toHaveBeenCalledWith("accessToken");
			expect(mockCookieStore.delete).toHaveBeenCalledWith("refreshToken");
		});
	});
});

"use server";

import { hash, compare } from "bcryptjs";
import { db } from "#lib/db";
import { redirect } from "#i18n/navigation";
import { sendEmail } from "#lib/email";
import { getTranslations } from "#lib/i18n/server";
import type { AuthActionState } from "./types";
import { z } from "zod";
import { createUserSession, deleteUserSession } from "#lib/auth";

const signUpSchema = z
	.object({
		email: z.string().email(),
		password: z.string().min(8),
		confirmPassword: z.string().min(8),
	})
	.refine((data) => data.password === data.confirmPassword, {
		path: ["confirmPassword"],
		message: "Passwords do not match",
	});

const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
});

const forgotPasswordSchema = z.object({
	email: z.string().email(),
});

const resetPasswordSchema = z
	.object({
		password: z.string().min(8),
		confirmPassword: z.string().min(8),
		token: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		path: ["confirmPassword"],
		message: "Passwords do not match",
	});

export async function signUp(state: AuthActionState, formData: FormData) {
	const t = await getTranslations();

	const result = signUpSchema.safeParse(Object.fromEntries(formData));
	if (!result.success) {
		return {
			success: false,
			error: result.error.errors.map((e) => e.message).join(", "),
			email: formData.get("email") as string,
		};
	}
	const existingUser = await db.user.findUnique({
		where: { email: result.data.email },
	});

	if (existingUser) {
		return {
			success: false,
			error: t("auth.signup.error.emailExists"),
			email: result.data.email,
		};
	}

	const passwordHash = await hash(result.data.password, 12);

	await db.user.create({
		data: {
			email: result.data.email,
			passwordHash,
		},
	});

	return redirect({
		href: "/auth/login?registered=true",
		locale: "en",
	});
}

export async function login(state: AuthActionState, formData: FormData) {
	const t = await getTranslations();
	const result = loginSchema.safeParse(Object.fromEntries(formData));
	if (!result.success) {
		return {
			success: false,
			error: result.error.errors.map((e) => e.message).join(", "),
			email: formData.get("email") as string,
		};
	}
	const user = await db.user.findUnique({
		where: { email: result.data.email },
	});

	if (!user) {
		return {
			success: false,
			error: t("auth.login.error.invalidCredentials"),
			email: result.data.email,
		};
	}

	const isValid = await compare(result.data.password, user.passwordHash);

	if (!isValid) {
		return {
			success: false,
			error: t("auth.login.error.invalidCredentials"),
			email: result.data.email,
		};
	}

	await createUserSession(user.id);

	return redirect({
		href: "/diary",
		locale: "en",
	});
}

export async function logout() {
	await deleteUserSession();

	return redirect({
		href: "/auth/login",
		locale: "en",
	});
}

export async function requestPasswordReset(
	state: AuthActionState,
	formData: FormData,
) {
	const t = await getTranslations();
	const result = forgotPasswordSchema.safeParse(Object.fromEntries(formData));
	if (!result.success) {
		return {
			success: false,
			error: result.error.errors.map((e) => e.message).join(", "),
		};
	}
	const user = await db.user.findUnique({
		where: { email: result.data.email },
	});

	if (!user) {
		// Don't reveal that the user doesn't exist
		return {
			success: true,
		};
	}

	const resetToken = crypto.randomUUID();
	const resetTokenExpiry = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

	await db.user.update({
		where: { id: user.id },
		data: {
			resetToken,
			resetTokenExpiry,
		},
	});

	const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}`;

	await sendEmail({
		to: result.data.email,
		subject: t("auth.forgotPassword.title"),
		text: t("auth.forgotPassword.emailText", { url: resetUrl }),
		html: t("auth.forgotPassword.emailHtml", { url: resetUrl }),
	});

	return {
		success: true,
	};
}

export async function resetPassword(
	state: AuthActionState,
	formData: FormData,
) {
	const t = await getTranslations();
	const result = resetPasswordSchema.safeParse(Object.fromEntries(formData));
	if (!result.success) {
		return {
			success: false,
			error: result.error.errors.map((e) => e.message).join(", "),
		};
	}
	const user = await db.user.findFirst({
		where: {
			resetToken: result.data.token,
			resetTokenExpiry: {
				gt: new Date(),
			},
		},
	});

	if (!user) {
		return {
			success: false,
			error: t("auth.resetPassword.error.invalidToken"),
		};
	}

	const passwordHash = await hash(result.data.password, 12);

	await db.user.update({
		where: { id: user.id },
		data: {
			passwordHash,
			resetToken: null,
			resetTokenExpiry: null,
		},
	});

	return redirect({
		href: "/auth/login?reset=true",
		locale: "en",
	});
}

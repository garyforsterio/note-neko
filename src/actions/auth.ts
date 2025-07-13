"use server";

import { parseWithZod } from "@conform-to/zod";
import { compare, hash } from "bcryptjs";
import { redirect } from "#i18n/navigation";
import { createUserSession, deleteUserSession } from "#lib/auth";
import { db } from "#lib/db";
import { sendEmail } from "#lib/email";
import { getTranslations } from "#lib/i18n/server";
import {
	forgotPasswordSchema,
	loginSchema,
	resetPasswordSchema,
	signUpSchema,
} from "#schema/auth";

const RESET_TOKEN_EXPIRY = 1000 * 60 * 60; // 1 hour

export async function signUp(lastResult: unknown, formData: FormData) {
	const t = await getTranslations();

	const submission = parseWithZod(formData, { schema: signUpSchema });
	if (submission.status !== "success") {
		return submission.reply();
	}
	const existingUser = await db.user.findUnique({
		where: { email: submission.value.email },
	});

	if (existingUser) {
		return submission.reply({
			formErrors: [t("auth.signup.error.emailExists")],
		});
	}

	const passwordHash = await hash(submission.value.password, 12);

	await db.user.create({
		data: {
			email: submission.value.email,
			passwordHash,
		},
	});

	return redirect({
		href: "/auth/login?registered=true",
		locale: "en",
	});
}

export async function login(lastResult: unknown, formData: FormData) {
	const t = await getTranslations();
	const submission = parseWithZod(formData, { schema: loginSchema });
	if (submission.status !== "success") {
		return submission.reply();
	}
	const user = await db.user.findUnique({
		where: { email: submission.value.email },
	});

	if (!user) {
		return submission.reply({
			formErrors: [t("auth.login.error.invalidCredentials")],
		});
	}

	const isValid = await compare(submission.value.password, user.passwordHash);

	if (!isValid) {
		return submission.reply({
			formErrors: [t("auth.login.error.invalidCredentials")],
		});
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
	lastResult: unknown,
	formData: FormData,
) {
	const t = await getTranslations();
	const submission = parseWithZod(formData, { schema: forgotPasswordSchema });
	if (submission.status !== "success") {
		return submission.reply();
	}
	const user = await db.user.findUnique({
		where: { email: submission.value.email },
	});

	if (!user) {
		// Don't reveal that the user doesn't exist
		return submission.reply();
	}

	const resetToken = crypto.randomUUID();
	const resetTokenExpiry = new Date(Date.now() + RESET_TOKEN_EXPIRY);

	await db.user.update({
		where: { id: user.id },
		data: {
			resetToken,
			resetTokenExpiry,
		},
	});

	const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}`;

	await sendEmail({
		to: submission.value.email,
		subject: t("auth.forgotPassword.title"),
		text: t("auth.forgotPassword.emailText", { url: resetUrl }),
		html: t("auth.forgotPassword.emailHtml", { url: resetUrl }),
	});

	return submission.reply();
}

export async function resetPassword(lastResult: unknown, formData: FormData) {
	const t = await getTranslations();
	const submission = parseWithZod(formData, { schema: resetPasswordSchema });
	if (submission.status !== "success") {
		return submission.reply();
	}
	const user = await db.user.findFirst({
		where: {
			resetToken: submission.value.token,
			resetTokenExpiry: {
				gt: new Date(),
			},
		},
	});

	if (!user) {
		return submission.reply({
			formErrors: [t("auth.resetPassword.error.invalidToken")],
		});
	}

	const passwordHash = await hash(submission.value.password, 12);

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

"use server";

import { parseWithZod } from "@conform-to/zod";
import { compare, hash } from "bcryptjs";
import { getLocale } from "next-intl/server";
import { redirect } from "#i18n/navigation";
import { createUserSession, deleteUserSession } from "#lib/auth";
import { db } from "#lib/db";
import { sendEmail } from "#lib/email";
import { passwordResetEmail } from "#lib/email-templates/password-reset";
import { getTranslations } from "#lib/i18n/server";
import {
	forgotPasswordSchema,
	loginSchema,
	resetPasswordSchema,
	signUpSchema,
} from "#schema/auth";

const RESET_TOKEN_EXPIRY = 1000 * 60 * 60; // 1 hour

export async function signUp(_lastResult: unknown, formData: FormData) {
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

	const locale = await getLocale();
	return redirect({
		href: "/auth/login?registered=true",
		locale,
	});
}

export async function login(_lastResult: unknown, formData: FormData) {
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

	const locale = await getLocale();
	return redirect({
		href: "/diary",
		locale,
	});
}

export async function logout() {
	await deleteUserSession();

	const locale = await getLocale();
	return redirect({
		href: "/auth/login",
		locale,
	});
}

export async function requestPasswordReset(
	_lastResult: unknown,
	formData: FormData,
) {
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

	const locale = await getLocale();
	const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/${locale}/auth/reset-password?token=${resetToken}`;
	const email = passwordResetEmail({ resetUrl, locale });

	try {
		await sendEmail({
			to: user.email,
			subject: email.subject,
			html: email.html,
			text: email.text,
		});
	} catch (error) {
		console.error("Failed to send password reset email:", error);
	}

	return submission.reply();
}

export async function resetPassword(_lastResult: unknown, formData: FormData) {
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

	const locale = await getLocale();
	return redirect({
		href: "/auth/login?reset=true",
		locale,
	});
}

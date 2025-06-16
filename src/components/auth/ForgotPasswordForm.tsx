"use client";

import { useActionState, useState } from "react";
import { Link } from "#i18n/navigation";
import { requestPasswordReset } from "#actions/auth";
import { useTranslations } from "next-intl";
import type { ActionState } from "#actions/types";
import ErrorMessage from "#components/ErrorMessage";

export function ForgotPasswordForm() {
	const t = useTranslations();
	const [state, action, isPending] = useActionState<ActionState, FormData>(
		requestPasswordReset,
		{},
	);

	return (
		<form className="mt-8 space-y-6" action={action}>
			{state.success && (
				<div className="rounded-md bg-green-50 p-4">
					<div className="text-sm text-green-700">
						{t("auth.forgotPassword.success")}
					</div>
				</div>
			)}
			<ErrorMessage message={state.error} />
			<div className="rounded-md shadow-sm -space-y-px">
				<div>
					<label htmlFor="email" className="sr-only">
						{t("auth.forgotPassword.email")}
					</label>
					<input
						id="email"
						name="email"
						type="email"
						autoComplete="email"
						required
						className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
						placeholder={t("auth.forgotPassword.email")}
					/>
				</div>
			</div>

			<div className="flex items-center justify-end">
				<div className="text-sm">
					<Link
						href="/auth/login"
						className="font-medium text-indigo-600 hover:text-indigo-500"
					>
						{t("auth.forgotPassword.backToLogin")}
					</Link>
				</div>
			</div>

			<div>
				<button
					type="submit"
					aria-disabled={isPending}
					className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
				>
					{isPending
						? t("auth.forgotPassword.submitting")
						: t("auth.forgotPassword.submit")}
				</button>
			</div>
		</form>
	);
}

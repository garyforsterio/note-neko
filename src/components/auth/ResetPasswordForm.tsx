"use client";

import { useTranslations } from "next-intl";
import { useActionState } from "react";
import { resetPassword } from "#actions/auth";
import type { ActionState } from "#actions/types";
import ErrorMessage from "#components/ErrorMessage";
import { Link } from "#i18n/navigation";
interface ResetPasswordFormProps {
	token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
	const t = useTranslations();
	const [state, action, isPending] = useActionState<ActionState, FormData>(
		resetPassword,
		{},
	);

	return (
		<form className="mt-8 space-y-6" action={action}>
			<input type="hidden" name="token" value={token} />
			<ErrorMessage message={state.error} />
			<div className="rounded-md shadow-sm -space-y-px">
				<div>
					<label htmlFor="password" className="sr-only">
						{t("auth.resetPassword.password")}
					</label>
					<input
						id="password"
						name="password"
						type="password"
						autoComplete="new-password"
						required
						className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
						placeholder={t("auth.resetPassword.password")}
					/>
				</div>
				<div>
					<label htmlFor="confirmPassword" className="sr-only">
						{t("auth.resetPassword.confirmPassword")}
					</label>
					<input
						id="confirmPassword"
						name="confirmPassword"
						type="password"
						autoComplete="new-password"
						required
						className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
						placeholder={t("auth.resetPassword.confirmPassword")}
					/>
				</div>
			</div>

			<div className="flex items-center justify-end">
				<div className="text-sm">
					<Link
						href="/auth/login"
						className="font-medium text-indigo-600 hover:text-indigo-500"
					>
						{t("auth.resetPassword.backToLogin")}
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
						? t("auth.resetPassword.submitting")
						: t("auth.resetPassword.submit")}
				</button>
			</div>
		</form>
	);
}

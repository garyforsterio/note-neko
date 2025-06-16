"use client";

import { useActionState } from "react";
import { Link } from "#i18n/navigation";
import { useSearchParams } from "next/navigation";
import { login } from "#actions/auth";
import { useTranslations } from "next-intl";
import type { AuthActionState } from "#actions/types";
import ErrorMessage from "#components/ErrorMessage";

export function LoginForm() {
	const t = useTranslations();
	const searchParams = useSearchParams();
	const [state, action, isPending] = useActionState<AuthActionState, FormData>(
		login,
		{},
	);

	const registered = searchParams.get("registered") === "true";

	return (
		<form className="mt-8 space-y-6" action={action}>
			{registered && (
				<div className="rounded-md bg-green-50 p-4">
					<div className="text-sm text-green-700">
						{t("auth.login.registered")}
					</div>
				</div>
			)}
			<ErrorMessage message={state.error} />
			<div className="rounded-md shadow-sm -space-y-px">
				<div>
					<label htmlFor="email" className="sr-only">
						{t("auth.login.email")}
					</label>
					<input
						id="email"
						name="email"
						type="email"
						autoComplete="email"
						required
						defaultValue={state.email}
						className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
						placeholder={t("auth.login.email")}
					/>
				</div>
				<div>
					<label htmlFor="password" className="sr-only">
						{t("auth.login.password")}
					</label>
					<input
						id="password"
						name="password"
						type="password"
						autoComplete="current-password"
						required
						className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
						placeholder={t("auth.login.password")}
					/>
				</div>
			</div>

			<div className="flex items-center justify-between">
				<div className="text-sm">
					<Link
						href="/auth/forgot-password"
						className="font-medium text-indigo-600 hover:text-indigo-500"
					>
						{t("auth.login.forgotPassword")}
					</Link>
				</div>
				<div className="text-sm">
					<Link
						href="/auth/signup"
						className="font-medium text-indigo-600 hover:text-indigo-500"
					>
						{t("auth.login.noAccount")}
					</Link>
				</div>
			</div>

			<div>
				<button
					type="submit"
					aria-disabled={isPending}
					className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
				>
					{isPending ? t("auth.login.submitting") : t("auth.login.submit")}
				</button>
			</div>
		</form>
	);
}

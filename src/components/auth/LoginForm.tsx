"use client";

import {
	getFormProps,
	getInputProps,
	getTextareaProps,
	useForm,
} from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { login } from "#actions/auth";
import ErrorMessage from "#components/ErrorMessage";
import { Link } from "#i18n/navigation";
import { loginSchema } from "#schema/auth";

export function LoginForm() {
	const t = useTranslations();
	const searchParams = useSearchParams();
	const [lastResult, action, isPending] = useActionState(login, undefined);

	const [form, fields] = useForm({
		// Sync the result of last submission
		lastResult,
		defaultValue: { email: "", password: "", ...lastResult?.initialValue },
		// Reuse the validation logic on the client
		onValidate: ({ formData }) => {
			return parseWithZod(formData, { schema: loginSchema });
		},

		// To derive all validation attributes
		constraint: getZodConstraint(loginSchema),

		// Validate the form on blur event triggered
		shouldValidate: "onBlur",
		shouldRevalidate: "onInput",
	});

	const registered = searchParams.get("registered") === "true";

	return (
		<form className="mt-8 space-y-6" {...getFormProps(form)} action={action}>
			<ErrorMessage errors={form.errors} />
			{registered && (
				<div className="rounded-md bg-green-50 p-4">
					<div className="text-sm text-green-700">
						{t("auth.login.registered")}
					</div>
				</div>
			)}
			<div className="rounded-md shadow-sm -space-y-px">
				<div>
					<label htmlFor={fields.email.id} className="sr-only">
						{t("auth.login.email")}
					</label>
					<input
						{...getInputProps(fields.email, { type: "email" })}
						defaultValue={fields.email.defaultValue}
						autoComplete="email"
						className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
						placeholder={t("auth.login.email")}
					/>
					<ErrorMessage id={fields.email.id} errors={fields.email.errors} />
				</div>
				<div>
					<label htmlFor={fields.password.id} className="sr-only">
						{t("auth.login.password")}
					</label>
					<input
						{...getInputProps(fields.password, { type: "password" })}
						autoComplete="current-password"
						className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
						placeholder={t("auth.login.password")}
					/>
					<ErrorMessage
						id={fields.password.id}
						errors={fields.password.errors}
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
					disabled={!form.valid || isPending}
					className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
				>
					{isPending ? t("auth.login.submitting") : t("auth.login.submit")}
				</button>
			</div>
		</form>
	);
}

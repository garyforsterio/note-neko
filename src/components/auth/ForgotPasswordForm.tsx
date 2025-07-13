"use client";

import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { useTranslations } from "next-intl";
import { useActionState } from "react";
import { requestPasswordReset } from "#actions/auth";
import ErrorMessage from "#components/ErrorMessage";
import { Link } from "#i18n/navigation";
import { forgotPasswordSchema } from "#schema/auth";

export function ForgotPasswordForm() {
	const t = useTranslations();
	const [lastResult, action, isPending] = useActionState(
		requestPasswordReset,
		null,
	);

	const [form, fields] = useForm({
		// Sync the result of last submission
		lastResult,

		// Reuse the validation logic on the client
		onValidate: ({ formData }) => {
			return parseWithZod(formData, { schema: forgotPasswordSchema });
		},

		// To derive all validation attributes
		constraint: getZodConstraint(forgotPasswordSchema),

		// Validate the form on blur event triggered
		shouldValidate: "onBlur",
		shouldRevalidate: "onInput",
	});
	return (
		<form className="mt-8 space-y-6" {...getFormProps(form)} action={action}>
			{lastResult?.status === "success" && (
				<div className="rounded-md bg-green-50 p-4">
					<div className="text-sm text-green-700">
						{t("auth.forgotPassword.success")}
					</div>
				</div>
			)}
			<div className="rounded-md shadow-sm -space-y-px">
				<div>
					<label htmlFor={fields.email.id} className="sr-only">
						{t("auth.forgotPassword.email")}
					</label>
					<input
						{...getInputProps(fields.email, { type: "email" })}
						autoComplete="email"
						className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
						placeholder={t("auth.forgotPassword.email")}
					/>
					<ErrorMessage id={fields.email.id} errors={fields.email.errors} />
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

			<ErrorMessage errors={form.errors} />

			<div>
				<button
					type="submit"
					disabled={isPending || !form.valid}
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

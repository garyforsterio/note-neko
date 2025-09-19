"use client";

import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { useTranslations } from "next-intl";
import { useActionState } from "react";
import { signUp } from "#actions/auth";
import ErrorMessage from "#components/ErrorMessage";
import { Link } from "#i18n/navigation";
import { signUpSchema } from "#schema/auth";

export function SignUpForm() {
	const t = useTranslations();
	const [lastResult, formAction, isPending] = useActionState(signUp, null);

	const [form, fields] = useForm({
		lastResult,
		defaultValue: {
			email: "",
			password: "",
			confirmPassword: "",
			...lastResult?.initialValue,
		},
		onValidate: ({ formData }) => {
			return parseWithZod(formData, { schema: signUpSchema });
		},
		constraint: getZodConstraint(signUpSchema),
		shouldValidate: "onBlur",
		shouldRevalidate: "onInput",
	});

	return (
		<form
			className="mt-8 space-y-6"
			{...getFormProps(form)}
			action={formAction}
		>
			<ErrorMessage errors={form.errors} />
			<div className="rounded-md shadow-sm -space-y-px">
				<div>
					<label htmlFor={fields.email.id} className="sr-only">
						{t("auth.signup.email")}
					</label>
					<input
						{...getInputProps(fields.email, { type: "email" })}
						autoComplete="email"
						className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
						placeholder={t("auth.signup.email")}
					/>
					<ErrorMessage id={fields.email.id} errors={fields.email.errors} />
				</div>
				<div>
					<label htmlFor={fields.password.id} className="sr-only">
						{t("auth.signup.password")}
					</label>
					<input
						{...getInputProps(fields.password, { type: "password" })}
						autoComplete="new-password"
						className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
						placeholder={t("auth.signup.password")}
					/>
					<ErrorMessage
						id={fields.password.id}
						errors={fields.password.errors}
					/>
				</div>
				<div>
					<label htmlFor={fields.confirmPassword.id} className="sr-only">
						{t("auth.signup.confirmPassword")}
					</label>
					<input
						{...getInputProps(fields.confirmPassword, { type: "password" })}
						autoComplete="new-password"
						className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
						placeholder={t("auth.signup.confirmPassword")}
					/>
					<ErrorMessage
						id={fields.confirmPassword.id}
						errors={fields.confirmPassword.errors}
					/>
				</div>
			</div>

			<div className="flex items-center justify-end">
				<div className="text-sm">
					<Link
						href="/auth/login"
						className="font-medium text-indigo-600 hover:text-indigo-500"
					>
						{t("auth.signup.hasAccount")}
					</Link>
				</div>
			</div>

			<div>
				<button
					type="submit"
					disabled={isPending || !form.valid}
					className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
				>
					{isPending ? t("auth.signup.submitting") : t("auth.signup.submit")}
				</button>
			</div>
		</form>
	);
}

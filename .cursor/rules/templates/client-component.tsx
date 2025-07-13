"use client";

import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { useTranslations } from "next-intl";
import { useActionState } from "react";
import { someAction } from "#actions/someAction";
import ErrorMessage from "#components/ErrorMessage";
import { someSchema } from "#schema/someSchema";

export function ComponentName() {
	const t = useTranslations();
	const [lastResult, action, isPending] = useActionState(
		someAction,
		null,
	);

	const [form, fields] = useForm({
		lastResult,
		onValidate: ({ formData }) => {
			return parseWithZod(formData, { schema: someSchema });
		},
		constraint: getZodConstraint(someSchema),
	});

	return (
		<form {...getFormProps(form)} action={action}>
			<ErrorMessage errors={form.errors} />
			<div>
				<label htmlFor={fields.name.id}>{t("form.name")}</label>
				<input {...getInputProps(fields.name, { type: "text" })} />
				<ErrorMessage id={fields.name.id} errors={fields.name.errors} />
			</div>

			<button
				type="submit"
				disabled={isPending || !form.valid}
				aria-disabled={isPending || !form.valid}
				aria-label={t("form.submit")}
			>
				{isPending ? t("form.submitting") : t("form.submit")}
			</button>
		</form>
	);
}

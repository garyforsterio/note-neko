"use client";

import { useTranslations } from "next-intl";
import { useActionState } from "react";
import { someAction } from "#actions/someAction";
import type { ActionState } from "#actions/types";
import ErrorMessage from "#components/ErrorMessage";

export function ComponentName() {
	const t = useTranslations();
	const [state, action, isPending] = useActionState<ActionState, FormData>(
		someAction,
		{},
	);

	return (
		<form action={action}>
			<ErrorMessage message={state.error} />
			{/* Form fields */}
			<button
				type="submit"
				disabled={isPending}
				aria-disabled={isPending}
				aria-label={t("form.submit")}
			>
				{isPending ? t("form.submitting") : t("form.submit")}
			</button>
		</form>
	);
}

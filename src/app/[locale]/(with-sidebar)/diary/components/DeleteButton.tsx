"use client";

import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useActionState } from "react";
import { deleteDiaryEntryAction } from "#actions/diary";
import ErrorMessage from "#components/ErrorMessage";
import { deleteDiaryEntrySchema } from "#schema/diary";

interface DeleteButtonProps {
	id: string;
}

export default function DeleteButton({ id }: DeleteButtonProps) {
	const t = useTranslations();
	const [lastResult, action, isPending] = useActionState(
		deleteDiaryEntryAction,
		undefined,
	);

	const [form, fields] = useForm({
		// Sync the result of last submission
		lastResult,

		// Reuse the validation logic on the client
		onValidate: ({ formData }) => {
			return parseWithZod(formData, { schema: deleteDiaryEntrySchema });
		},

		// To derive all validation attributes
		constraint: getZodConstraint(deleteDiaryEntrySchema),

		// Default values
		defaultValue: {
			id,
		},
	});

	return (
		<form {...getFormProps(form)} action={action}>
			<ErrorMessage errors={form.errors} />
			<input {...getInputProps(fields.id, { type: "hidden" })} />
			<button
				type="submit"
				className="p-2 text-gray-500 hover:text-red-600 transition-colors cursor-pointer disabled:opacity-50"
				aria-label={t("diary.deleteEntry")}
				title={t("diary.deleteEntry")}
				disabled={isPending}
				onClick={(e) => {
					if (!confirm(t("diary.confirmDelete"))) {
						e.preventDefault();
					}
				}}
			>
				<Trash2 className="h-4 w-4" />
			</button>
		</form>
	);
}

"use client";
import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useActionState } from "react";
import { deletePersonAction } from "#actions/people";
import ErrorMessage from "#components/ErrorMessage";
import { cn } from "#lib/utils";
import { deletePersonSchema } from "#schema/people";

interface DeleteButtonProps {
	personId: string;
	personName: string;
	size?: "small" | "normal";
}

export default function DeleteButton({
	personId,
	personName,
	size,
}: DeleteButtonProps) {
	const t = useTranslations();
	const [lastResult, action, isPending] = useActionState(
		deletePersonAction,
		undefined,
	);

	const [form, fields] = useForm({
		// Sync the result of last submission
		lastResult,

		// Reuse the validation logic on the client
		onValidate: ({ formData }) => {
			return parseWithZod(formData, { schema: deletePersonSchema });
		},

		// To derive all validation attributes
		constraint: getZodConstraint(deletePersonSchema),

		// Default values
		defaultValue: {
			id: personId,
		},
	});

	return (
		<form {...getFormProps(form)} action={action}>
			<ErrorMessage errors={form.errors} />
			<input {...getInputProps(fields.id, { type: "hidden" })} />
			<button
				type="submit"
				disabled={isPending}
				className="p-2 text-gray-500 hover:text-red-600 transition-colors cursor-pointer disabled:opacity-50"
				title={t("people.deleteProfile")}
				aria-label={t("people.deleteProfile")}
				onClick={(e) => {
					if (!confirm(t("people.confirmDelete", { name: personName }))) {
						e.preventDefault();
					}
				}}
			>
				<Trash2 className={cn(size === "small" ? "h-4 w-4" : "h-6 w-6")} />
			</button>
		</form>
	);
}

"use client";

import {
	getFormProps,
	getInputProps,
	getTextareaProps,
	useForm,
} from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { useTranslations } from "next-intl";
import { useActionState } from "react";
import { createPersonAction, updatePersonAction } from "#actions/people";
import ErrorMessage from "#components/ErrorMessage";
import { useRouter } from "#i18n/navigation";
import { personSchema } from "#schema/people";

interface PersonFormProps {
	person?: {
		id: string;
		name: string;
		nickname?: string | null;
		birthday: Date | null;
		howWeMet: string | null;
		interests: string[];
		notes: string | null;
	};
}

export default function PersonForm({ person }: PersonFormProps) {
	const router = useRouter();
	const t = useTranslations();
	const [lastResult, action, isPending] = useActionState(
		person ? updatePersonAction : createPersonAction,
		undefined,
	);

	const [form, fields] = useForm({
		// Sync the result of last submission
		lastResult,

		// Reuse the validation logic on the client
		onValidate: ({ formData }) => {
			return parseWithZod(formData, { schema: personSchema });
		},

		// To derive all validation attributes
		constraint: getZodConstraint(personSchema),

		// Validate the form on blur event triggered
		shouldValidate: "onBlur",
		shouldRevalidate: "onInput",

		// Default values
		defaultValue: person
			? {
					id: person.id,
					name: person.name,
					nickname: person.nickname || "",
					birthday: person.birthday
						? new Date(person.birthday).toISOString().split("T")[0]
						: "",
					howWeMet: person.howWeMet || "",
					interests: person.interests.join(", "),
					notes: person.notes || "",
				}
			: {},
	});

	return (
		<form className="space-y-6" {...getFormProps(form)} action={action}>
			<ErrorMessage errors={form.errors} />
			<div>
				<label
					htmlFor={fields.name.id}
					className="block text-sm font-medium text-gray-700 mb-1"
				>
					{/* biome-ignore lint/style/noJsxLiterals: required field indicator */}
					{t("people.name")} *
				</label>
				{person && <input {...getInputProps(fields.id, { type: "hidden" })} />}
				<input
					{...getInputProps(fields.name, { type: "text" })}
					className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
				/>
				<ErrorMessage id={fields.name.id} errors={fields.name.errors} />
			</div>

			<div>
				<label
					htmlFor={fields.nickname.id}
					className="block text-sm font-medium text-gray-700 mb-1"
				>
					{t("people.nickname")}
				</label>
				<input
					{...getInputProps(fields.nickname, { type: "text" })}
					className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
				/>
				<ErrorMessage id={fields.nickname.id} errors={fields.nickname.errors} />
			</div>

			<div>
				<label
					htmlFor={fields.birthday.id}
					className="block text-sm font-medium text-gray-700 mb-1"
				>
					{t("people.birthday")}
				</label>
				<input
					{...getInputProps(fields.birthday, { type: "date" })}
					className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
				/>
				<ErrorMessage id={fields.birthday.id} errors={fields.birthday.errors} />
			</div>

			<div>
				<label
					htmlFor={fields.howWeMet.id}
					className="block text-sm font-medium text-gray-700 mb-1"
				>
					{t("people.howWeMet")}
				</label>
				<textarea
					{...getTextareaProps(fields.howWeMet)}
					rows={3}
					className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
				/>
				<ErrorMessage id={fields.howWeMet.id} errors={fields.howWeMet.errors} />
			</div>

			<div>
				<label
					htmlFor={fields.interests.id}
					className="block text-sm font-medium text-gray-700 mb-1"
				>
					{t("people.interests")}
				</label>
				<input
					{...getInputProps(fields.interests, { type: "text" })}
					placeholder={t("people.interestsPlaceholder")}
					className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
				/>
				<ErrorMessage
					id={fields.interests.id}
					errors={fields.interests.errors}
				/>
			</div>

			<div>
				<label
					htmlFor={fields.notes.id}
					className="block text-sm font-medium text-gray-700 mb-1"
				>
					{t("people.notes")}
				</label>
				<textarea
					{...getTextareaProps(fields.notes)}
					rows={4}
					className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
				/>
				<ErrorMessage id={fields.notes.id} errors={fields.notes.errors} />
			</div>

			<div className="flex justify-end space-x-4">
				<button
					type="button"
					onClick={() => router.back()}
					className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
				>
					{t("people.cancel")}
				</button>
				<button
					type="submit"
					disabled={isPending || !form.valid}
					className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{isPending
						? t("people.saving")
						: person
							? t("people.update")
							: t("people.save")}
				</button>
			</div>
		</form>
	);
}

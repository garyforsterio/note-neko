"use client";

import {
	getFormProps,
	getInputProps,
	getTextareaProps,
	useForm,
} from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import { createDiaryEntryAction, updateDiaryEntryAction } from "#actions/diary";
import { useRouter } from "#i18n/navigation";

import { useActionState } from "react";
import ErrorMessage from "#components/ErrorMessage";
import type { DiaryEntryWithRelations } from "#lib/dal";
import { diaryEntrySchema } from "#schema/diary";

// Needs to account for user's timezone
function getLocalDateString(date: Date) {
	const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
	const formattedDate = localDate.toISOString().split("T")[0];
	return formattedDate;
}

// Strip markdown links from content for editing
function stripMarkdownLinks(content: string): string {
	// Replace [text](url) with just text
	return content.replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1");
}

interface DiaryFormProps {
	entry?: DiaryEntryWithRelations;
}

export default function DiaryForm({ entry }: DiaryFormProps) {
	const t = useTranslations();
	const router = useRouter();
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const [lastResult, action, isPending] = useActionState(
		entry ? updateDiaryEntryAction : createDiaryEntryAction,
		undefined,
	);

	const [form, fields] = useForm({
		// Sync the result of last submission
		lastResult,

		// Reuse the validation logic on the client
		onValidate: ({ formData }) => {
			return parseWithZod(formData, { schema: diaryEntrySchema });
		},

		// To derive all validation attributes
		constraint: getZodConstraint(diaryEntrySchema),

		// Validate the form on blur event triggered
		shouldValidate: "onBlur",
		shouldRevalidate: "onInput",

		// Default values
		defaultValue: entry
			? {
					id: entry.id,
					content: stripMarkdownLinks(entry.content), // Strip links for editing
					date: getLocalDateString(entry.date),
				}
			: {
					date: getLocalDateString(new Date()),
				},
	});

	return (
		<form className="space-y-6" {...getFormProps(form)} action={action}>
			<ErrorMessage errors={form.errors} />
			<div className="mb-4">
				<label
					htmlFor={fields.date.id}
					className="block text-sm font-medium text-gray-700 mb-1"
				>
					{t("diary.date")} *
				</label>
				{entry && <input {...getInputProps(fields.id, { type: "hidden" })} />}
				<input
					{...getInputProps(fields.date, { type: "date" })}
					className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
				/>
				<ErrorMessage id={fields.date.id} errors={fields.date.errors} />
			</div>

			<div>
				<label
					htmlFor={fields.content.id}
					className="block text-sm font-medium text-gray-700 mb-1"
				>
					{t("diary.content")} *
				</label>
				<textarea
					{...getTextareaProps(fields.content)}
					ref={textareaRef}
					rows={16}
					className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					placeholder={t("diary.contentPlaceholder")}
				/>
				<ErrorMessage id={fields.content.id} errors={fields.content.errors} />
			</div>

			{isPending && (
				<div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
					<div className="flex items-center">
						<svg
							className="animate-spin h-5 w-5 text-blue-600 mr-3"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							aria-label="Loading"
						>
							<title>Loading...</title>
							<circle
								className="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								strokeWidth="4"
							/>
							<path
								className="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							/>
						</svg>
						<div>
							<p className="text-blue-800 font-medium">
								{t("diary.processing")}
							</p>
							<p className="text-blue-600 text-sm">
								{t("diary.processingDescription")}
							</p>
						</div>
					</div>
				</div>
			)}

			<div className="flex justify-end space-x-4">
				<button
					type="button"
					onClick={() => router.back()}
					className="px-4 py-2 text-gray-600 hover:text-gray-800"
					disabled={isPending}
				>
					{t("common.cancel")}
				</button>
				<button
					type="submit"
					disabled={isPending || !form.valid}
					className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{isPending
						? t("common.saving")
						: entry
							? t("common.save")
							: t("common.create")}
				</button>
			</div>
		</form>
	);
}

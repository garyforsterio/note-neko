"use client";

import {
	getFormProps,
	getInputProps,
	getTextareaProps,
	useForm,
} from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { createDiaryEntryAction, updateDiaryEntryAction } from "#actions/diary";
import { Link, useRouter } from "#i18n/navigation";

import { useActionState } from "react";
import ErrorMessage from "#components/ErrorMessage";
import { useProcessing } from "#contexts/ProcessingContext";
import { useToast } from "#hooks/use-toast";
import { useUserLocation } from "#hooks/useUserLocation";
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
	const { toast, dismiss } = useToast();
	const { startProcessing, updateStatus, completeProcessing } = useProcessing();
	const processingToastIdRef = useRef<string | null>(null);
	const { location, requestLocation } = useUserLocation();

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

	// Handle successful form submission
	useEffect(() => {
		if (
			lastResult?.status === "success" &&
			lastResult &&
			"entryId" in lastResult &&
			typeof lastResult.entryId === "string"
		) {
			const entryId = lastResult.entryId;

			// Start background processing for new entries
			startProcessing(entryId, ""); // Content not needed anymore

			// Show persistent processing toast
			const toastResult = toast({
				variant: "loading",
				title: t("diary.analyzingEntry"),
				description: t("diary.analyzingDescription"),
				action: (
					<Link
						href="/diary/new"
						className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium inline-block"
					>
						{t("diary.addAnotherEntry")}
					</Link>
				),
			});
			processingToastIdRef.current = toastResult.id;

			startBackgroundProcessing(entryId);
			// Navigate immediately to the new entry
			router.push(`/diary/${entryId}`);
		}
	}, [lastResult, startProcessing, toast, t, router]);

	// Function to handle streaming background processing
	const startBackgroundProcessing = async (entryId: string) => {
		try {
			updateStatus(entryId, "processing");

			const response = await fetch("/api/diary/process", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					entryId,
					location: location
						? {
								latitude: location.latitude,
								longitude: location.longitude,
							}
						: undefined,
				}),
			});

			if (!response.body) {
				throw new Error("No response stream");
			}

			const reader = response.body.getReader();
			const decoder = new TextDecoder();

			while (true) {
				const { done, value } = await reader.read();
				if (done) break;

				const chunk = decoder.decode(value);
				const lines = chunk.split("\n");

				for (const line of lines) {
					if (line.startsWith("data: ")) {
						try {
							const data = JSON.parse(line.slice(6));

							if (data.type === "complete") {
								completeProcessing(entryId, data.success, data.error);

								// Dismiss the processing toast
								if (processingToastIdRef.current) {
									dismiss(processingToastIdRef.current);
									processingToastIdRef.current = null;
								}

								// Refresh the current page to show updated entry content
								if (data.success) {
									router.refresh();
								} else {
									// Show error toast if processing failed
									toast({
										variant: "destructive",
										title: t("diary.processingFailed"),
										description: data.error || t("error.generic"),
									});
								}
							}
						} catch (e) {
							console.error("Failed to parse streaming message:", e);
						}
					}
				}
			}
		} catch (error) {
			console.error("Background processing error:", error);
			completeProcessing(entryId, false, "Network error");

			// Dismiss the processing toast
			if (processingToastIdRef.current) {
				dismiss(processingToastIdRef.current);
				processingToastIdRef.current = null;
			}

			// Show error toast
			toast({
				variant: "destructive",
				title: t("diary.processingFailed"),
				description: t("error.generic"),
			});
		}
	};

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

			{!entry && !location && (
				<div className="bg-gray-50 border border-gray-200 rounded-md p-4">
					<div className="flex items-start space-x-3">
						<svg
							className="w-5 h-5 text-gray-400 mt-0.5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<title>Location icon</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
							/>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
							/>
						</svg>
						<div className="flex-1">
							<p className="text-sm text-gray-700">
								{t("diary.locationPermission")}
							</p>
							<button
								type="button"
								onClick={requestLocation}
								className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
							>
								{t("diary.enableLocation")}
							</button>
						</div>
					</div>
				</div>
			)}

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
							<p className="text-blue-800 font-medium">{t("common.saving")}</p>
							<p className="text-blue-600 text-sm">{t("diary.savingEntry")}</p>
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

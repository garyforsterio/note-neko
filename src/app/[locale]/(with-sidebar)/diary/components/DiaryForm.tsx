"use client";

import { useTranslations } from "next-intl";
import { useRef, useState, useTransition } from "react";
import { createDiaryEntryAction, updateDiaryEntryAction } from "#actions/diary";
import { createPersonWithoutRedirectAction } from "#actions/people";
import { useGooglePlaces } from "#hooks/useGooglePlaces";
import { useRouter } from "#i18n/navigation";

import type { Person } from "@prisma/client";
import * as Sentry from "@sentry/nextjs";
import { useActionState } from "react";
import type { ActionState } from "#actions/types";
import { DiaryContent } from "#components/DiaryContent";
import ErrorMessage from "#components/ErrorMessage";
import type { DiaryEntryWithRelations } from "#lib/dal";
import FormattingToolbar from "./FormattingToolbar";
import LocationMentionSheet from "./LocationMentionSheet";
import PeopleMention from "./PeopleMention";

interface DiaryFormProps {
	entry?: DiaryEntryWithRelations;
	people: Person[];
}

export default function DiaryForm({ entry, people }: DiaryFormProps) {
	const t = useTranslations();
	const router = useRouter();
	const [selectedPeople, setSelectedPeople] = useState<string[]>(
		entry?.mentions.map((m) => m.person.id) || [],
	);
	const [locations, setLocations] = useState<
		Array<{
			name: string;
			placeId: string;
			lat: number;
			lng: number;
		}>
	>(entry?.locations || []);
	const [showLocationMention, setShowLocationMention] = useState(false);
	const [showPeopleMention, setShowPeopleMention] = useState(false);
	const [mentionSearchTerm, setMentionSearchTerm] = useState("");
	const [isPreview, setIsPreview] = useState(false);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const locationPredictions = useGooglePlaces(
		mentionSearchTerm,
		showLocationMention,
	);

	const [state, action, isPending] = useActionState<ActionState, FormData>(
		entry ? updateDiaryEntryAction : createDiaryEntryAction,
		{},
	);

	const [isAddingPerson, startTransition] = useTransition();

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key !== "Enter" || !(showPeopleMention || showLocationMention)) {
			return;
		}

		e.preventDefault();

		if (showPeopleMention) {
			const filteredPeople = people.filter((person) =>
				person.name.toLowerCase().includes(mentionSearchTerm.toLowerCase()),
			);
			if (filteredPeople.length > 0 && filteredPeople[0]) {
				handlePersonSelect(filteredPeople[0]);
				return;
			}

			if (mentionSearchTerm.trim()) {
				// Create new person
				handlePersonSelect({
					name: mentionSearchTerm.trim(),
				});
				return;
			}
			return;
		}

		if (showLocationMention && locationPredictions[0]) {
			handleLocationSelect({
				name: locationPredictions[0].name,
				placeId: locationPredictions[0].placeId,
				lat: locationPredictions[0].lat,
				lng: locationPredictions[0].lng,
			});
		}
	};

	const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const newValue = e.target.value;

		// Handle @ mentions
		const cursorPosition = e.target.selectionStart;
		const textBeforeCursor = newValue.slice(0, cursorPosition);
		const mentionMatch = textBeforeCursor.match(/@([^@\n]*)$/);

		if (mentionMatch) {
			const searchTerm = mentionMatch[1] || "";
			setMentionSearchTerm(searchTerm);
			setShowPeopleMention(true);
			setShowLocationMention(false);
		} else {
			setShowPeopleMention(false);
		}

		// Handle ^ location mentions
		const locationMatch = textBeforeCursor.match(/\^([^\^\n]*)$/);

		if (locationMatch) {
			const searchTerm = locationMatch[1] || "";
			setMentionSearchTerm(searchTerm);
			setShowLocationMention(true);
			setShowPeopleMention(false);
		} else {
			setShowLocationMention(false);
		}
	};

	const handlePersonSelect = async (person: { id?: string; name: string }) => {
		startTransition(async () => {
			const textarea = textareaRef.current;

			if (!textarea) return;

			const content = textarea.value;

			const cursorPosition = textarea.selectionStart;
			const textBeforeCursor = content.slice(0, cursorPosition);
			const textAfterCursor = content.slice(cursorPosition);
			const mentionMatch = textBeforeCursor.match(/@([^@\n]*)$/);

			if (mentionMatch) {
				const mentionStart = cursorPosition - mentionMatch[0].length;
				let personId = person.id;
				let personName = person.name;

				// If this is a new person (id is undefined), create them first
				if (!personId) {
					const result = await createPersonWithoutRedirectAction(personName);
					if (result.success && result.data) {
						personId = result.data.id;
						personName = result.data.name;
					} else {
						// Handle error case
						Sentry.captureException(result.error);
						return;
					}
				}

				const newValue = `${textBeforeCursor.slice(0, mentionStart)}[person:${personId}]${textAfterCursor}`;

				textarea.value = newValue;
				// Ensure that the person is not already in the selectedPeople array
				const newSelectedPeople = selectedPeople.filter((p) => p !== personId);
				setSelectedPeople([...newSelectedPeople, personId]);
				setShowPeopleMention(false);
			}
		});
	};

	const handleLocationSelect = (location: {
		name: string;
		placeId: string;
		lat: number;
		lng: number;
	}) => {
		const textarea = textareaRef.current;
		if (!textarea) return;

		const content = textarea.value;

		const cursorPosition = textarea.selectionStart;
		const textBeforeCursor = content.slice(0, cursorPosition);
		const textAfterCursor = content.slice(cursorPosition);
		const locationMatch = textBeforeCursor.match(/\^([^\^\n]*)$/);

		if (locationMatch) {
			const mentionStart = cursorPosition - locationMatch[0].length;
			const newValue = `${textBeforeCursor.slice(0, mentionStart)}[location:${location.placeId}]${textAfterCursor}`;

			textarea.value = newValue;
			// Ensure that the location is not already in the locations array
			const newLocations = locations.filter(
				(l) => l.placeId !== location.placeId,
			);
			setLocations([...newLocations, location]);
			setShowLocationMention(false);
			setMentionSearchTerm("");
		}
	};

	return (
		<form action={action} className="space-y-6">
			<ErrorMessage message={state.error} />
			<div className="mb-4">
				<label
					htmlFor="date"
					className="block text-sm font-medium text-gray-700 mb-1"
				>
					{t("diary.date")}
				</label>
				<input
					type="date"
					id="date"
					name="date"
					defaultValue={
						(entry?.date ? new Date(entry.date) : new Date())
							.toISOString()
							.split("T")[0]
					}
					className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
				/>
			</div>
			<input
				type="hidden"
				name="mentions"
				value={JSON.stringify(selectedPeople)}
			/>
			<input type="hidden" name="locations" value={JSON.stringify(locations)} />
			{entry && <input type="hidden" name="id" value={entry.id} />}

			<div className="relative">
				<div className="flex space-x-4 mb-4">
					<button
						type="button"
						onClick={() => setIsPreview(false)}
						className={`px-4 py-2 rounded-md ${
							!isPreview ? "bg-blue-600 text-white" : "bg-gray-100"
						}`}
					>
						{t("diary.edit")}
					</button>
					<button
						type="button"
						onClick={() => setIsPreview(true)}
						className={`px-4 py-2 rounded-md ${
							isPreview ? "bg-blue-600 text-white" : "bg-gray-100"
						}`}
					>
						{t("diary.preview")}
					</button>
				</div>

				{!isPreview && (
					<FormattingToolbar
						textareaRef={textareaRef}
						onMentionPerson={() => {
							setShowPeopleMention(true);
							setMentionSearchTerm("");
						}}
						onMentionLocation={() => {
							setShowLocationMention(true);
							setMentionSearchTerm("");
						}}
					/>
				)}

				<div
					hidden={!isPreview}
					className="prose max-w-none p-4 bg-white rounded-md border border-gray-300"
				>
					<DiaryContent
						content={textareaRef.current?.value || ""}
						people={entry?.mentions.map((m) => m.person) || []}
						locations={locations}
					/>
				</div>
				<textarea
					hidden={isPreview}
					name="content"
					ref={textareaRef}
					defaultValue={entry?.content}
					onChange={handleTextChange}
					onKeyDown={handleKeyDown}
					className="w-full h-64 p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					placeholder={t("diary.contentPlaceholder")}
				/>

				<PeopleMention
					isOpen={showPeopleMention}
					onClose={() => setShowPeopleMention(false)}
					onSelect={handlePersonSelect}
					people={people}
					searchTerm={mentionSearchTerm}
					addingPerson={isAddingPerson}
				/>

				<LocationMentionSheet
					isOpen={showLocationMention}
					onClose={() => setShowLocationMention(false)}
					onLocationSelect={handleLocationSelect}
					searchTerm={mentionSearchTerm}
					predictions={locationPredictions}
				/>
			</div>

			<div className="flex justify-end space-x-4">
				<button
					type="button"
					onClick={() => router.back()}
					className="px-4 py-2 text-gray-600 hover:text-gray-800"
				>
					{t("common.cancel")}
				</button>
				<button
					type="submit"
					disabled={isPending}
					aria-disabled={isPending}
					className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
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

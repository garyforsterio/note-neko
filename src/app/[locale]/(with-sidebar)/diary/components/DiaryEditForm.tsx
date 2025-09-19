"use client";

import type { Person, Prisma } from "@prisma/client";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { useState, useTransition } from "react";
import { updateDiaryEntryAction } from "#actions/diary";
import { DiaryContent } from "#components/DiaryContent";
import RefineEditor from "#components/diary/RefineEditor";
import RewriteEditor from "#components/diary/RewriteEditor";
import { useToast } from "#hooks/use-toast";
import { Link, useRouter } from "#i18n/navigation";
import type { DiaryEntryWithRelations } from "#lib/dal";

interface DiaryEditFormProps {
	entry: DiaryEntryWithRelations;
	allPeople: Person[];
}

export default function DiaryEditForm({
	entry,
	allPeople,
}: DiaryEditFormProps) {
	const t = useTranslations();
	const router = useRouter();
	const locale = useLocale();
	const { toast } = useToast();
	const [isPending, startTransition] = useTransition();

	const [mode, setMode] = useState<"refine" | "rewrite">("refine");
	const [content, setContent] = useState(entry.content);
	const [date, setDate] = useState(entry.date.toISOString().split("T")[0]);
	const [people, setPeople] = useState(entry.mentions.map((m) => m.person));
	const [locations, setLocations] = useState<
		Prisma.DiaryLocationCreateWithoutDiaryEntryInput[]
	>(
		entry.locations.map((loc) => ({
			name: loc.name,
			placeId: loc.placeId,
			lat: loc.lat,
			lng: loc.lng,
		})),
	);

	const handleSave = () => {
		startTransition(async () => {
			try {
				const formData = new FormData();
				formData.append("id", entry.id);
				formData.append("content", content);
				formData.append(
					"date",
					date ? new Date(date).toISOString() : entry.date.toISOString(),
				);

				// Add people and locations
				formData.append("peopleIds", JSON.stringify(people.map((p) => p.id)));
				formData.append("locations", JSON.stringify(locations));

				const result = await updateDiaryEntryAction(undefined, formData);

				if (result?.status === "error") {
					toast({
						variant: "destructive",
						title: t("error.updateFailed"),
						description: result.error?.content?.[0] || t("error.generic"),
					});
				} else {
					toast({
						title: t("diary.saved"),
						description: t("diary.entrySaved"),
					});
					router.push(`/diary/${entry.id}`);
				}
			} catch (_error) {
				toast({
					variant: "destructive",
					title: t("error.updateFailed"),
					description: t("error.generic"),
				});
			}
		});
	};

	return (
		<div className="space-y-6">
			{/* Date Input */}
			<div className="bg-white p-4 rounded-lg border border-gray-200">
				<label
					htmlFor="date"
					className="block text-sm font-medium text-gray-700 mb-1"
				>
					{t("diary.date")} *
				</label>
				<input
					type="date"
					id="date"
					value={date}
					onChange={(e) => setDate(e.target.value)}
					className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
				/>
			</div>

			{/* Editor and Preview */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<div className="bg-white p-4 rounded-lg border border-gray-200">
					<div className="flex items-center justify-between mb-3">
						<h2 className="text-lg font-semibold">{t("diary.editor")}</h2>
						{/* Mode Toggle */}
						<div className="flex gap-2">
							<button
								type="button"
								onClick={() => setMode("refine")}
								className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
									mode === "refine"
										? "bg-blue-600 text-white"
										: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
								}`}
							>
								{t("diary.refineMode")}
							</button>
							<button
								type="button"
								onClick={() => setMode("rewrite")}
								className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
									mode === "rewrite"
										? "bg-blue-600 text-white"
										: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
								}`}
							>
								{t("diary.rewriteMode")}
							</button>
						</div>
					</div>
					{mode === "refine" ? (
						<RefineEditor
							content={content}
							people={people}
							locations={locations}
							allPeople={allPeople}
							onChange={setContent}
							onEntitiesChange={(newPeople, newLocations) => {
								setPeople(newPeople);
								setLocations(newLocations);
							}}
						/>
					) : (
						<RewriteEditor content={content} onChange={setContent} />
					)}
				</div>

				{/* Preview */}
				<div className="bg-white p-4 rounded-lg border border-gray-200">
					<h2 className="text-lg font-semibold mb-3">{t("diary.preview")}</h2>
					<div className="p-4 bg-gray-50 rounded-md">
						<DiaryContent
							content={content}
							people={people}
							locations={locations}
							locale={locale}
						/>
					</div>
				</div>
			</div>

			{/* Actions */}
			<div className="flex justify-end gap-4 pt-4 border-t">
				<Link
					href={`/diary/${entry.id}`}
					className="px-4 py-2 text-gray-600 hover:text-gray-800"
				>
					{t("common.cancel")}
				</Link>
				<button
					type="button"
					onClick={handleSave}
					disabled={isPending}
					className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{isPending ? t("common.saving") : t("common.save")}
				</button>
			</div>
		</div>
	);
}

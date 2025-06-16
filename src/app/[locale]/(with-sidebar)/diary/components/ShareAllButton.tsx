"use client";

import { format } from "date-fns";
import { Share2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import { DiaryContent } from "#components/DiaryContent";
import type { DiaryEntryWithRelations } from "#lib/dal";

interface ShareAllButtonProps {
	startDate?: Date;
	endDate?: Date;
	entries: DiaryEntryWithRelations[];
}

export default function ShareAllButton({
	startDate,
	endDate,
	entries,
}: ShareAllButtonProps) {
	const t = useTranslations();
	const contentRef = useRef<HTMLDivElement>(null);

	if (entries.length === 0) {
		return null;
	}

	const handleShare = async () => {
		if (!navigator.share) {
			alert(t("diary.shareNotSupported"));
			return;
		}

		const firstEntry = entries[0];
		const lastEntry = entries[entries.length - 1];

		if (!firstEntry || !lastEntry) {
			//  Impossible state
			return;
		}

		try {
			await navigator.share({
				title: `${format(firstEntry.date, "MMMM d, yyyy")} - ${format(lastEntry.date, "MMMM d, yyyy")}`,
				text: contentRef.current?.textContent || "",
			});
		} catch (error) {
			if (error instanceof Error && error.name !== "AbortError") {
				console.error("Error sharing:", error);
				alert(t("diary.shareError"));
			}
		}
	};

	return (
		<>
			<button
				type="button"
				onClick={handleShare}
				className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:text-blue-600 transition-colors cursor-pointer"
				title={t("diary.shareAllEntries")}
				aria-label={t("diary.shareAllEntries")}
			>
				<Share2 className="h-4 w-4" />
			</button>
			<div ref={contentRef} hidden>
				{entries.map((entry, index) => (
					<div key={entry.id}>
						<div className="whitespace-pre-line">
							{format(new Date(entry.date), "MMMM d, yyyy")}
							{"\n\n"}
							<DiaryContent
								content={entry.content}
								people={entry.mentions.map((mention) => mention.person)}
								locations={entry.locations}
							/>
						</div>
						{index < entries.length - 1 && "\n\n---\n\n"}
					</div>
				))}
			</div>
		</>
	);
}

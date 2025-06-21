"use client";

import * as Sentry from "@sentry/nextjs";
import { format } from "date-fns";
import { Share2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import { DiaryContent } from "#components/DiaryContent";
import type { DiaryEntryWithRelations } from "#lib/dal";

interface ShareButtonProps {
	entry: DiaryEntryWithRelations;
}

export default function ShareButton({ entry }: ShareButtonProps) {
	const t = useTranslations();
	const contentRef = useRef<HTMLDivElement>(null);

	const handleShare = async () => {
		if (!navigator.share) {
			alert(t("diary.shareNotSupported"));
			return;
		}

		try {
			await navigator.share({
				title: format(new Date(entry.date), "MMMM d, yyyy"),
				text: contentRef.current?.textContent || "",
			});
		} catch (error) {
			if (error instanceof Error && error.name !== "AbortError") {
				Sentry.captureException(error);
				alert(t("diary.shareError"));
			}
		}
	};

	return (
		<>
			<button
				type="button"
				onClick={handleShare}
				className="p-2 text-gray-500 hover:text-blue-600 transition-colors cursor-pointer"
				title={t("diary.shareEntry")}
				aria-label={t("diary.shareEntry")}
			>
				<Share2 className="h-4 w-4" />
			</button>
			<div ref={contentRef} hidden>
				<DiaryContent
					content={entry.content}
					people={entry.mentions.map((mention) => mention.person)}
					locations={entry.locations}
				/>
			</div>
		</>
	);
}

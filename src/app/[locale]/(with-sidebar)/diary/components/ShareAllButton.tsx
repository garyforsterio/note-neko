"use client";

import * as Sentry from "@sentry/nextjs";
import { format } from "date-fns";
import { Check, Copy, Share2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { DiaryContent } from "#components/DiaryContent";
import type { DiaryEntryWithRelations } from "#lib/dal";

interface ShareAllButtonProps {
	entries: DiaryEntryWithRelations[];
	locale: string;
}

export default function ShareAllButton({
	entries,
	locale,
}: ShareAllButtonProps) {
	const t = useTranslations();
	const contentRef = useRef<HTMLDivElement>(null);
	const [isCopied, setIsCopied] = useState(false);
	if (entries.length === 0) {
		return null;
	}

	function getContent(): { title: string; text: string } {
		const firstEntry = entries[0];
		const lastEntry = entries[entries.length - 1];

		if (!firstEntry || !lastEntry) {
			throw new Error("entries is empty");
		}

		return {
			title: `${format(firstEntry.date, "MMMM d, yyyy")} - ${format(lastEntry.date, "MMMM d, yyyy")}`,
			text: contentRef.current?.textContent || "",
		};
	}

	async function handleShare() {
		if (!navigator.share) {
			alert(t("diary.shareNotSupported"));
			return;
		}

		const { title, text } = getContent();

		try {
			await navigator.share({
				title,
				text,
			});
		} catch (error) {
			if (error instanceof Error && error.name !== "AbortError") {
				Sentry.captureException(error);
				alert(t("diary.shareError"));
			}
		}
	}

	function handleCopy() {
		const { title, text } = getContent();
		const content = `${title}\n${text}`;
		navigator.clipboard.writeText(content);
		setIsCopied(true);
	}

	return (
		<>
			<button
				type="button"
				onClick={handleCopy}
				className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all cursor-pointer"
				title={t("diary.copyEntry")}
				aria-label={t("diary.copyEntry")}
			>
				{isCopied ? (
					<Check className="h-4 w-4" />
				) : (
					<Copy className="h-4 w-4" />
				)}
			</button>
			<button
				type="button"
				onClick={handleShare}
				className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all cursor-pointer"
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
								locale={locale}
							/>
						</div>
						{index < entries.length - 1 && "\n\n---\n\n"}
					</div>
				))}
			</div>
		</>
	);
}

"use client";

import * as Sentry from "@sentry/nextjs";
import { format } from "date-fns";
import { Check, Copy, Share2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { DiaryContent } from "#components/DiaryContent";
import type { DiaryEntryWithRelations } from "#lib/dal";

interface ShareButtonProps {
	entry: DiaryEntryWithRelations;
	locale: string;
}

export default function ShareButton({ entry, locale }: ShareButtonProps) {
	const [isCopied, setIsCopied] = useState(false);
	const t = useTranslations();
	const contentRef = useRef<HTMLDivElement>(null);

	function getContent(): { title: string; text: string } {
		return {
			title: format(new Date(entry.date), "MMMM d, yyyy"),
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
				className="p-2 text-gray-500 hover:text-blue-600 transition-colors cursor-pointer"
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
					locale={locale}
				/>
			</div>
		</>
	);
}

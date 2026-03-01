"use client";

import { Pencil, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { processDiaryEntryAction } from "#actions/diary";
import { Link } from "#i18n/navigation";
import type { DiaryEntryWithRelations } from "#lib/dal";
import DeleteButton from "./DeleteButton";
import ShareButton from "./ShareButton";

interface DiaryActionsBaseProps {
	entry: DiaryEntryWithRelations;
	locale: string;
}

type DiaryActionsProps = DiaryActionsBaseProps &
	(
		| { onEdit: () => void; editHref?: never }
		| { editHref: string; onEdit?: never }
	);

export function DiaryActions({ entry, locale, ...props }: DiaryActionsProps) {
	const t = useTranslations();
	const [isProcessing, startProcessing] = useTransition();

	const editAction = "onEdit" in props ? props.onEdit : undefined;
	const editHref = "editHref" in props ? props.editHref : undefined;

	const handleProcess = () => {
		startProcessing(async () => {
			await processDiaryEntryAction(entry.id);
		});
	};

	return (
		<div className="flex items-center gap-1 shrink-0">
			{editAction ? (
				<button
					type="button"
					onClick={editAction}
					className="p-2 text-gray-500 hover:text-blue-600 transition-colors cursor-pointer"
					title={t("common.edit")}
				>
					<Pencil className="h-4 w-4" />
				</button>
			) : (
				<Link
					href={editHref ?? "#"}
					className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
					title={t("common.edit")}
					aria-label={t("common.edit")}
				>
					<Pencil className="h-4 w-4" />
				</Link>
			)}
			<button
				type="button"
				onClick={handleProcess}
				disabled={isProcessing}
				className="p-2 text-gray-500 hover:text-amber-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
				title={
					entry.processed ? t("diary.reprocess") : t("diary.processWithAI")
				}
			>
				<Sparkles className={`h-4 w-4 ${isProcessing ? "animate-spin" : ""}`} />
			</button>
			<ShareButton entry={entry} locale={locale} />
			<DeleteButton id={entry.id} />
		</div>
	);
}

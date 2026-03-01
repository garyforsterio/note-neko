"use client";

import { Pencil } from "lucide-react";
import { useTranslations } from "next-intl";
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

	const editAction = "onEdit" in props ? props.onEdit : undefined;
	const editHref = "editHref" in props ? props.editHref : undefined;

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
			<ShareButton entry={entry} locale={locale} />
			<DeleteButton id={entry.id} />
		</div>
	);
}

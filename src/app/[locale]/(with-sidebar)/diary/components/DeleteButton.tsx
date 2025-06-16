"use client";

import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useActionState } from "react";
import { deleteDiaryEntryAction } from "#actions/diary";
import type { ActionState } from "#actions/types";

interface DeleteButtonProps {
	id: string;
}

export default function DeleteButton({ id }: DeleteButtonProps) {
	const t = useTranslations();
	const [state, formAction, isPending] = useActionState<ActionState, FormData>(
		deleteDiaryEntryAction,
		{},
	);

	return (
		<form action={formAction}>
			<input type="hidden" name="id" value={id} />
			<button
				type="submit"
				className="p-2 text-gray-500 hover:text-red-600 transition-colors cursor-pointer"
				aria-label={t("diary.deleteEntry")}
				title={t("diary.deleteEntry")}
				disabled={isPending}
				onClick={(e) => {
					if (!confirm(t("diary.confirmDelete"))) {
						e.preventDefault();
					}
				}}
			>
				<Trash2 className="h-4 w-4" />
			</button>
		</form>
	);
}

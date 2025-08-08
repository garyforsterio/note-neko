"use client";

import { ArrowDown, ArrowUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function SortToggle() {
	const t = useTranslations();
	const router = useRouter();
	const searchParams = useSearchParams();
	const currentSort = searchParams.get("sort-order") || "desc";

	const toggleSort = useCallback(() => {
		const params = new URLSearchParams(searchParams.toString());
		const newSort = currentSort === "desc" ? "asc" : "desc";
		params.set("sort-order", newSort);
		router.push(`/diary?${params.toString()}`);
	}, [router, searchParams, currentSort]);

	return (
		<button
			type="button"
			onClick={toggleSort}
			className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-md transition-colors"
			title={
				currentSort === "desc"
					? t("diary.sortEarliestFirst")
					: t("diary.sortLatestFirst")
			}
		>
			{currentSort === "desc" ? (
				<>
					<ArrowDown className="h-4 w-4" />
					{t("diary.latestFirst")}
				</>
			) : (
				<>
					<ArrowUp className="h-4 w-4" />
					{t("diary.earliestFirst")}
				</>
			)}
		</button>
	);
}

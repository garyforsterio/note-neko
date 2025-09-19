"use client";

import { ArrowDown, ArrowUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";

export function SortToggle() {
	const t = useTranslations();
	const router = useRouter();
	const searchParams = useSearchParams();
	const currentSort = searchParams.get("sort-order") || "desc";

	const toggleSort = () => {
		const params = new URLSearchParams(searchParams);
		const newSort = currentSort === "desc" ? "asc" : "desc";
		params.set("sort-order", newSort);
		params.set("page", "1");
		router.push(`/diary?${params.toString()}`);
	};

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

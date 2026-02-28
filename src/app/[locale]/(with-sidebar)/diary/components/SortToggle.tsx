"use client";

import { ArrowDown, ArrowUp } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useRouter } from "#i18n/navigation";

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
			className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 bg-white border border-gray-200 hover:border-gray-300 px-3 py-2 rounded-full transition-all shadow-sm hover:shadow cursor-pointer"
			title={
				currentSort === "desc"
					? t("diary.sortEarliestFirst")
					: t("diary.sortLatestFirst")
			}
		>
			<span className="text-xs uppercase tracking-wide opacity-70">
				{/* biome-ignore lint/style/noJsxLiterals: punctuation */}
				{t("diary.date")}:
			</span>
			{currentSort === "desc" ? (
				<>
					{t("diary.latestFirst")}
					<ArrowDown size={14} />
				</>
			) : (
				<>
					{t("diary.earliestFirst")}
					<ArrowUp size={14} />
				</>
			)}
		</button>
	);
}

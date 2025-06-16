import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "#i18n/navigation";
import { getTranslations } from "#lib/i18n/server";

interface DiaryPaginationProps {
	currentPage: number;
	totalPages: number;
	pageSize: number;
	startDate?: Date;
	endDate?: Date;
}

function getDateString(date: Date | undefined): string {
	if (!date) return "";
	return date.toISOString().split("T")[0] as string;
}

export async function DiaryPagination({
	currentPage,
	totalPages,
	pageSize,
	startDate,
	endDate,
}: DiaryPaginationProps) {
	const t = await getTranslations();
	if (totalPages <= 1) return null;

	const getPaginationUrl = (page: number) => {
		const params = new URLSearchParams({
			page: page.toString(),
			pageSize: pageSize.toString(),
		});

		if (startDate) {
			params.append("startDate", getDateString(startDate));
		}
		if (endDate) {
			params.append("endDate", getDateString(endDate));
		}

		return `/diary?${params.toString()}`;
	};

	return (
		<div className="mt-8 flex justify-center items-center gap-2">
			<Link
				href={getPaginationUrl(currentPage - 1)}
				className={`p-2 rounded-md ${
					currentPage > 1
						? "text-gray-600 hover:bg-gray-100"
						: "text-gray-300 cursor-not-allowed"
				}`}
				aria-disabled={currentPage <= 1}
			>
				<ChevronLeft className="h-5 w-5" />
			</Link>

			<span className="text-sm text-gray-600">
				{t("diary.pageInfo", { page: currentPage, totalPages })}
			</span>

			<Link
				href={getPaginationUrl(currentPage + 1)}
				className={`p-2 rounded-md ${
					currentPage < totalPages
						? "text-gray-600 hover:bg-gray-100"
						: "text-gray-300 cursor-not-allowed"
				}`}
				aria-disabled={currentPage >= totalPages}
			>
				<ChevronRight className="h-5 w-5" />
			</Link>
		</div>
	);
}

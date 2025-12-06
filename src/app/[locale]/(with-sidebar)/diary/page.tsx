import { getDiaryEntries } from "#lib/dal";
import { getTranslations } from "#lib/i18n/server";
import { calculateMissingDiaryStats } from "#lib/utils/diary";
import { DiaryEntry } from "./components/DiaryEntry";
import { DiaryHeader } from "./components/DiaryHeader";
import { DiaryPagination } from "./components/DiaryPagination";

interface PageProps {
	searchParams: Promise<{
		page?: string;
		"page-size"?: string;
		"start-date"?: string;
		"end-date"?: string;
		"sort-order"?: string;
	}>;
}

export async function generateMetadata() {
	const t = await getTranslations();

	return {
		title: t("diary.title"),
	};
}

export default async function DiaryPage({ searchParams }: PageProps) {
	const t = await getTranslations();
	const params = await searchParams;

	const {
		page,
		"page-size": pageSize,
		"start-date": startDate,
		"end-date": endDate,
		"sort-order": sortOrder,
	} = params;

	const parsedPage = page ? Number(page) : 1;
	const parsedPageSize = pageSize ? Number(pageSize) : 10;
	const parsedStartDate = startDate ? new Date(startDate) : undefined;
	const parsedEndDate = endDate ? new Date(endDate) : undefined;
	const parsedSortOrder =
		sortOrder === "asc" || sortOrder === "desc" ? sortOrder : "desc";

	const { entries, total } = await getDiaryEntries({
		page: parsedPage,
		pageSize: parsedPageSize,
		startDate: parsedStartDate,
		endDate: parsedEndDate,
		sortOrder: parsedSortOrder,
	});

	const totalPages = Math.ceil(total / parsedPageSize);

	// Calculate missing entries stats
	let missingCount = 0;
	let nextMissingDate: string | undefined;

	if (
		parsedPage === 1 &&
		parsedSortOrder === "desc" &&
		!parsedStartDate &&
		!parsedEndDate &&
		entries.length > 0
	) {
		const stats = calculateMissingDiaryStats(entries[0]?.date);
		missingCount = stats.missingCount;
		nextMissingDate = stats.nextMissingDate;
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<DiaryHeader
				startDate={parsedStartDate}
				endDate={parsedEndDate}
				entries={entries}
				missingCount={missingCount}
				nextMissingDate={nextMissingDate}
			/>

			<div className="space-y-6">
				{entries.length === 0 ? (
					<div className="bg-white p-6 rounded-lg shadow-md">
						<p className="text-gray-500 text-sm">{t("diary.noEntries")}</p>
					</div>
				) : (
					entries.map((entry) => <DiaryEntry key={entry.id} entry={entry} />)
				)}
			</div>

			<DiaryPagination
				currentPage={parsedPage}
				totalPages={totalPages}
				pageSize={parsedPageSize}
				params={params}
			/>
		</div>
	);
}

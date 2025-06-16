import { getDiaryEntries } from "#lib/dal";
import { getTranslations } from "#lib/i18n/server";
import { DiaryEntry } from "./components/DiaryEntry";
import { DiaryHeader } from "./components/DiaryHeader";
import { DiaryPagination } from "./components/DiaryPagination";

interface PageProps {
	searchParams: Promise<{
		page?: string;
		pageSize?: string;
		startDate?: string;
		endDate?: string;
	}>;
}

export default async function DiaryPage({ searchParams }: PageProps) {
	const t = await getTranslations();

	const { page, pageSize, startDate, endDate } = await searchParams;

	const parsedPage = page ? Number(page) : 1;
	const parsedPageSize = pageSize ? Number(pageSize) : 10;
	const parsedStartDate = startDate ? new Date(startDate) : undefined;
	const parsedEndDate = endDate ? new Date(endDate) : undefined;

	const { entries, total } = await getDiaryEntries({
		page: parsedPage,
		pageSize: parsedPageSize,
		startDate: parsedStartDate,
		endDate: parsedEndDate,
	});

	const totalPages = Math.ceil(total / parsedPageSize);

	return (
		<div className="container mx-auto px-4 py-8">
			<DiaryHeader
				startDate={parsedStartDate}
				endDate={parsedEndDate}
				entries={entries}
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
				startDate={parsedStartDate}
				endDate={parsedEndDate}
			/>
		</div>
	);
}

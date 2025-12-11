import { Skeleton } from "#components/ui/skeleton";
import { DiaryHeader } from "./components/DiaryHeader";

export default async function DiaryLoading() {
	return (
		<div className="container mx-auto px-4 py-8">
			{/* Header */}
			<DiaryHeader entries={[]} allEntryIds={[]} />

			{/* Entries */}
			<div className="space-y-6">
				{Array.from({ length: 5 }).map((_, i) => (
					<div
						// biome-ignore lint/suspicious/noArrayIndexKey: skeleton only
						key={i}
						className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
					>
						{/* Header Section */}
						<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 border-b pb-6 border-gray-100">
							<div>
								{/* Day */}
								<Skeleton className="h-10 w-48 mb-2" />
								{/* Date + Calendar Icon */}
								<div className="flex items-center gap-3 mt-2">
									<Skeleton className="h-6 w-36" />
									<Skeleton className="h-9 w-9 rounded-full" />
								</div>
								{/* Location */}
								<div className="flex items-center gap-2 mt-3">
									<Skeleton className="h-3 w-3" />
									<Skeleton className="h-4 w-32" />
								</div>
							</div>

							{/* Weather Section */}
							<div className="flex gap-6 py-4 md:py-0">
								<div className="flex flex-col items-center gap-1">
									<Skeleton className="h-6 w-16" />
									<Skeleton className="h-3 w-12" />
								</div>
								<div className="w-px bg-gray-200 h-10 self-center" />
								<div className="flex flex-col items-center gap-1">
									<Skeleton className="h-6 w-16" />
									<Skeleton className="h-3 w-12" />
								</div>
								<div className="w-px bg-gray-200 h-10 self-center" />
								<div className="flex flex-col items-center gap-1">
									<Skeleton className="h-6 w-16" />
									<Skeleton className="h-3 w-12" />
								</div>
							</div>
						</div>

						{/* Content Section */}
						<div className="space-y-4 mb-8">
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-[98%]" />
							<Skeleton className="h-4 w-[95%]" />
							<Skeleton className="h-4 w-[90%]" />
							<Skeleton className="h-4 w-[80%]" />
						</div>

						{/* Footer/Actions Section */}
						<div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4 border-t pt-6 border-gray-100">
							<div className="flex flex-col gap-3 w-full sm:w-auto">
								<Skeleton className="h-6 w-48" />
								<Skeleton className="h-6 w-32" />
							</div>

							<div className="flex items-center gap-1 shrink-0">
								<Skeleton className="h-8 w-8 rounded-md" />
								<Skeleton className="h-8 w-8 rounded-md" />
								<Skeleton className="h-8 w-8 rounded-md" />
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Pagination */}
			<div className="mt-8 flex justify-center gap-2">
				<Skeleton className="h-10 w-10 rounded-md" />
				<Skeleton className="h-10 w-10 rounded-md" />
				<Skeleton className="h-10 w-10 rounded-md" />
				<Skeleton className="h-10 w-10 rounded-md" />
				<Skeleton className="h-10 w-10 rounded-md" />
			</div>
		</div>
	);
}

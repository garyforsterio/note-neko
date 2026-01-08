import { Skeleton } from "#components/ui/skeleton";

export default function DiaryEntryPageLoading() {
	return (
		<div className="space-y-6 max-w-4xl mx-auto px-4 py-8">
			{/* Unified Card Container */}
			<div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
				{/* Map - Media Header Style Skeleton */}
				<Skeleton className="h-[250px] w-full" />

				<div className="p-6 md:p-8 space-y-8">
					{/* Header Section (Date & Weather) */}
					<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b pb-6 border-gray-100">
						<div>
							{/* Date Day */}
							<Skeleton className="h-10 w-48 mb-2" />
							<div className="flex items-center gap-3 mt-2">
								{/* Date Full */}
								<Skeleton className="h-6 w-32" />
								{/* Calendar Icon */}
								<Skeleton className="h-8 w-8 rounded-full" />
							</div>

							<div className="flex items-center gap-2 mt-3 text-sm h-6">
								{/* Location */}
								<Skeleton className="h-4 w-4" />
								<Skeleton className="h-4 w-40" />
							</div>
						</div>

						{/* Weather Stats */}
						<div className="flex gap-6 py-4 md:py-0">
							<div className="flex flex-col items-center gap-1">
								<Skeleton className="h-6 w-12" />
								<Skeleton className="h-3 w-10" />
							</div>
							<div className="w-px bg-gray-200 h-10 self-center" />
							<div className="flex flex-col items-center gap-1">
								<Skeleton className="h-6 w-12" />
								<Skeleton className="h-3 w-10" />
							</div>
							<div className="w-px bg-gray-200 h-10 self-center" />
							<div className="flex flex-col items-center gap-1">
								<Skeleton className="h-6 w-12" />
								<Skeleton className="h-3 w-10" />
							</div>
						</div>
					</div>

					{/* Content Section */}
					<div className="space-y-4">
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-3/4" />
						<Skeleton className="h-4 w-5/6" />
						<Skeleton className="h-4 w-2/3" />
						<Skeleton className="h-4 w-4/5" />
						<Skeleton className="h-4 w-3/4" />
					</div>

					{/* Footer/Actions Section */}
					<div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4 border-t pt-6 border-gray-100">
						<div className="flex flex-col gap-3 w-full sm:w-auto">
							<Skeleton className="h-6 w-32" />
							<div className="flex flex-wrap gap-2">
								{[...Array(3)].map((_, i) => (
									// biome-ignore lint/suspicious/noArrayIndexKey: skeleton
									<Skeleton key={i} className="h-8 w-24 rounded-full" />
								))}
							</div>
						</div>

						<div className="flex items-center gap-1 shrink-0">
							<Skeleton className="h-8 w-8 rounded-full" />
							<Skeleton className="h-8 w-8 rounded-full" />
							<Skeleton className="h-8 w-8 rounded-full" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

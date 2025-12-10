import { Skeleton } from "#components/ui/skeleton";

export default function NewDiaryEntryLoading() {
	return (
		<div className="container mx-auto px-4 py-8">
			{/* Form Container */}
			<div className="space-y-6 max-w-4xl mx-auto">
				{/* Header Section */}
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 border-b pb-6 border-gray-100">
					<div>
						{/* Day of week */}
						<Skeleton className="h-10 w-48 mb-3" />

						{/* Date & Calendar Button */}
						<div className="flex items-center gap-3">
							<Skeleton className="h-7 w-40" />
							<Skeleton className="h-9 w-9 rounded-full" />
						</div>

						{/* Location line */}
						<div className="mt-4 flex items-center gap-2">
							<Skeleton className="h-4 w-4 rounded-full" />
							<Skeleton className="h-4 w-32" />
						</div>
					</div>

					{/* Stats Placeholders */}
					<div className="flex gap-6 py-4 md:py-0">
						<div className="flex flex-col items-center gap-2">
							<Skeleton className="h-8 w-8 rounded-full" />
							<Skeleton className="h-3 w-12" />
						</div>
						<div className="w-px h-10 bg-gray-100" />
						<div className="flex flex-col items-center gap-2">
							<Skeleton className="h-8 w-8 rounded-full" />
							<Skeleton className="h-3 w-12" />
						</div>
						<div className="w-px h-10 bg-gray-100" />
						<div className="flex flex-col items-center gap-2">
							<Skeleton className="h-8 w-8 rounded-full" />
							<Skeleton className="h-3 w-12" />
						</div>
					</div>
				</div>

				{/* Content Area */}
				<div>
					<Skeleton className="h-96 w-full rounded-xl" />
					<div className="mt-3 flex justify-between">
						<Skeleton className="h-3 w-64" />
						<Skeleton className="h-3 w-12" />
					</div>
				</div>

				{/* Footer Buttons */}
				<div className="flex justify-end space-x-4 pt-4">
					<Skeleton className="h-10 w-24 rounded-md" />
					<Skeleton className="h-10 w-32 rounded-full" />
				</div>
			</div>
		</div>
	);
}

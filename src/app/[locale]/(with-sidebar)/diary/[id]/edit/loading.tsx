import { Skeleton } from "#components/ui/skeleton";

export default function EditDiaryEntryLoading() {
	return (
		<div className="container mx-auto px-4 py-8">
			<Skeleton className="h-8 w-48 mb-8" />

			<div className="space-y-6">
				{/* Mode Toggle */}
				<div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
					<Skeleton className="h-4 w-20" />
					<div className="flex gap-2">
						<Skeleton className="h-8 w-20" />
						<Skeleton className="h-8 w-20" />
					</div>
				</div>

				{/* Editor/Preview Grid */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* Editor Column */}
					<div>
						<Skeleton className="h-6 w-16 mb-3" />
						<div className="space-y-4">
							<Skeleton className="h-10 w-full" />
							<Skeleton className="h-64 w-full" />
							<div className="space-y-2">
								<Skeleton className="h-4 w-20" />
								<Skeleton className="h-10 w-full" />
							</div>
							<div className="space-y-2">
								<Skeleton className="h-4 w-24" />
								<Skeleton className="h-10 w-full" />
							</div>
						</div>
					</div>

					{/* Preview Column */}
					<div>
						<Skeleton className="h-6 w-16 mb-3" />
						<div className="border border-gray-300 rounded-md p-4 bg-white">
							<div className="space-y-3">
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-4/5" />
								<Skeleton className="h-4 w-3/4" />
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-2/3" />
							</div>
						</div>
					</div>
				</div>

				{/* Action buttons */}
				<div className="flex justify-end gap-4 pt-4 border-t">
					<Skeleton className="h-10 w-16" />
					<Skeleton className="h-10 w-16" />
				</div>
			</div>
		</div>
	);
}

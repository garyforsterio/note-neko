import { Skeleton } from "#components/ui/skeleton";

export default function NewDiaryEntryLoading() {
	return (
		<div className="container mx-auto px-4 py-8">
			<Skeleton className="h-8 w-48 mb-6" />

			<div className="space-y-6">
				{/* Date input */}
				<div className="mb-4">
					<Skeleton className="h-5 w-24 mb-1" />
					<Skeleton className="h-10 w-full" />
				</div>

				{/* Edit/Preview toggle */}
				<div className="flex space-x-4 mb-4">
					<Skeleton className="h-10 w-20" />
					<Skeleton className="h-10 w-20" />
				</div>

				{/* Content textarea */}
				<Skeleton className="h-64 w-full" />

				{/* Action buttons */}
				<div className="flex justify-end space-x-4">
					<Skeleton className="h-10 w-24" />
					<Skeleton className="h-10 w-24" />
				</div>
			</div>
		</div>
	);
}

import { Skeleton } from "#components/ui/skeleton";

export default function EditPersonLoading() {
	return (
		<div className="container mx-auto px-4 py-8">
			<Skeleton className="h-8 w-48 mb-6" />

			<div className="space-y-6">
				{/* Name input */}
				<div>
					<Skeleton className="h-5 w-24 mb-1" />
					<Skeleton className="h-10 w-full" />
				</div>

				{/* Nickname input */}
				<div>
					<Skeleton className="h-5 w-24 mb-1" />
					<Skeleton className="h-10 w-full" />
				</div>

				{/* Birthday input */}
				<div>
					<Skeleton className="h-5 w-24 mb-1" />
					<Skeleton className="h-10 w-full" />
				</div>

				{/* How we met textarea */}
				<div>
					<Skeleton className="h-5 w-32 mb-1" />
					<Skeleton className="h-24 w-full" />
				</div>

				{/* Interests input */}
				<div>
					<Skeleton className="h-5 w-24 mb-1" />
					<Skeleton className="h-10 w-full" />
				</div>

				{/* Notes textarea */}
				<div>
					<Skeleton className="h-5 w-20 mb-1" />
					<Skeleton className="h-32 w-full" />
				</div>

				{/* Action buttons */}
				<div className="flex justify-end space-x-4">
					<Skeleton className="h-10 w-24" />
					<Skeleton className="h-10 w-24" />
				</div>
			</div>
		</div>
	);
}

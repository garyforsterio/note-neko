import { Skeleton } from "#components/ui/skeleton";

export default function PersonLoading() {
	return (
		<div className="container mx-auto px-4 py-8">
			<div className="flex justify-between items-start mb-8">
				<div>
					<Skeleton className="h-10 w-48 mb-2" />
					<Skeleton className="h-4 w-32" />
				</div>
				<div className="flex gap-2">
					<Skeleton className="h-10 w-10 rounded-md" />
					<Skeleton className="h-10 w-10 rounded-md" />
				</div>
			</div>

			<div className="bg-white rounded-lg shadow-md p-6 mb-8">
				<div className="mb-4">
					<Skeleton className="h-6 w-24 mb-1" />
					<Skeleton className="h-4 w-32" />
				</div>

				<div className="mb-4">
					<Skeleton className="h-6 w-32 mb-1" />
					<Skeleton className="h-4 w-full" />
				</div>

				<div className="mb-4">
					<Skeleton className="h-6 w-24 mb-2" />
					<div className="flex flex-wrap gap-2">
						{[...Array(3)].map((_, index) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: we don't have real data here so only index
							<Skeleton key={index} className="h-6 w-20 rounded-full" />
						))}
					</div>
				</div>

				<div className="mb-4">
					<Skeleton className="h-6 w-20 mb-1" />
					<Skeleton className="h-4 w-full" />
				</div>
			</div>

			<div>
				<Skeleton className="h-8 w-48 mb-4" />
				<div className="space-y-4">
					{[...Array(3)].map((_, index) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: we don't have real data here so only index
						<div key={index} className="bg-white rounded-lg shadow-md p-6">
							<div className="flex justify-between items-start mb-2">
								<Skeleton className="h-6 w-32" />
							</div>
							<Skeleton className="h-4 w-full mb-2" />
							<Skeleton className="h-4 w-3/4 mb-2" />
							<Skeleton className="h-4 w-1/2" />
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

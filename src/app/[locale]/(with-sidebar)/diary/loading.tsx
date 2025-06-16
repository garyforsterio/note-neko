import { Skeleton } from "#components/ui/skeleton";
import { DiaryHeader } from "./components/DiaryHeader";

export default async function DiaryLoading() {
	return (
		<div className="container mx-auto px-4 py-8">
			{/* Header */}
			<DiaryHeader entries={[]} />

			{/* Entries */}
			<div className="space-y-6">
				{[...Array(5)].map((_, index) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: we don't have real data here so only index
					<div key={index} className="bg-white p-6 rounded-lg shadow-md">
						<div className="flex justify-between items-start mb-4">
							<Skeleton className="h-6 w-32" />
							<Skeleton className="h-6 w-24" />
						</div>
						<Skeleton className="h-4 w-full mb-2" />
						<Skeleton className="h-4 w-3/4 mb-2" />
						<Skeleton className="h-4 w-1/2" />
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

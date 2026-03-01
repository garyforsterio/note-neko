import { Skeleton } from "#components/ui/skeleton";

export default function NotificationsLoading() {
	return (
		<div className="container mx-auto px-4 py-8">
			<Skeleton className="h-9 w-48 mb-8" />

			<Skeleton className="h-4 w-32 mb-4" />
			<div className="space-y-3">
				{Array.from({ length: 3 }).map((_, i) => (
					<div
						// biome-ignore lint/suspicious/noArrayIndexKey: skeleton only
						key={i}
						className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5"
					>
						<div className="flex items-start gap-4">
							<Skeleton className="w-9 h-9 rounded-full flex-shrink-0" />
							<div className="flex-1 space-y-2">
								<Skeleton className="h-4 w-3/4" />
								<Skeleton className="h-3 w-1/2" />
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

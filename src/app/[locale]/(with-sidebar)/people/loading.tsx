import { Skeleton } from "#components/ui/skeleton";
import PageHeader from "./components/PageHeader";

export default function PeopleLoading() {
	return (
		<div className="container mx-auto px-4 py-8">
			<PageHeader />

			<div className="relative flex items-start gap-8">
				{/* Main List */}
				<div className="flex-1 space-y-12">
					{[...Array(3)].map((_, groupIndex) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: skeleton data
						<div key={groupIndex}>
							<Skeleton className="h-8 w-8 mb-6 rounded" />
							<div className="space-y-6">
								{[...Array(2)].map((_, entryIndex) => (
									<div
										// biome-ignore lint/suspicious/noArrayIndexKey: skeleton data
										key={entryIndex}
										className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
									>
										{/* Header */}
										<div className="flex justify-between items-start mb-6 pb-6 border-b border-gray-100">
											<div className="flex items-center gap-6">
												<Skeleton className="h-16 w-16 rounded-full shrink-0" />
												<div>
													<Skeleton className="h-8 w-48 mb-2" />
													<div className="flex gap-4">
														<Skeleton className="h-6 w-20 rounded-full" />
														<Skeleton className="h-6 w-24" />
													</div>
												</div>
											</div>
										</div>

										{/* Content */}
										<div className="space-y-4 mb-6">
											<Skeleton className="h-4 w-full" />
											<Skeleton className="h-4 w-3/4" />
										</div>

										{/* Footer */}
										<div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4 border-t pt-6 border-gray-100">
											<div className="flex gap-2">
												<Skeleton className="h-6 w-16 rounded-full" />
												<Skeleton className="h-6 w-20 rounded-full" />
												<Skeleton className="h-6 w-14 rounded-full" />
											</div>

											<div className="flex gap-2 shrink-0">
												<Skeleton className="h-8 w-8 rounded-md" />
												<Skeleton className="h-8 w-8 rounded-md" />
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					))}
				</div>

				{/* Side Navigation Skeleton */}
				<div className="hidden md:flex sticky top-24 flex-col gap-1 p-2 bg-white rounded-full shadow-sm border border-gray-100 max-h-[80vh] overflow-y-auto w-12 items-center shrink-0">
					{[...Array(15)].map((_, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: skeleton data
						<Skeleton key={i} className="w-8 h-8 rounded-full shrink-0" />
					))}
				</div>
			</div>
		</div>
	);
}

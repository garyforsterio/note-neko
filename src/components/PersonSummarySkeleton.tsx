import { Skeleton } from "#components/ui/skeleton";
import { getTranslations } from "#lib/i18n/server";

export async function PersonSummarySkeleton() {
	const t = await getTranslations();

	return (
		<div className="bg-white rounded-lg shadow-md p-6 mb-8">
			<h2 className="text-xl font-bold mb-4 flex items-center gap-2">
				<span className="text-purple-600">🤖</span>
				{t("people.aiSummary.title")}
			</h2>

			{/* Loading message */}
			<div className="mb-6">
				<p className="text-gray-500 italic mb-4">
					{t("people.aiSummary.loading")}
				</p>
			</div>

			{/* Main Summary Skeleton */}
			<div className="mb-6">
				<Skeleton className="h-4 w-full mb-2" />
				<Skeleton className="h-4 w-full mb-2" />
				<Skeleton className="h-4 w-3/4 mb-4" />
				<Skeleton className="h-4 w-full mb-2" />
				<Skeleton className="h-4 w-5/6" />
			</div>

			{/* Key Insights Skeleton */}
			<div className="mb-6">
				<Skeleton className="h-6 w-32 mb-3" />
				<div className="space-y-2">
					{[...Array(4)].map((_) => (
						<div key={crypto.randomUUID()} className="flex items-start gap-2">
							<span className="text-purple-500 mt-1">•</span>
							<Skeleton className="h-4 w-full" />
						</div>
					))}
				</div>
			</div>

			{/* Relationship Dynamics Skeleton */}
			<div className="border-t border-gray-200 pt-4">
				<Skeleton className="h-6 w-48 mb-3" />
				<Skeleton className="h-4 w-full mb-2" />
				<Skeleton className="h-4 w-4/5" />
			</div>

			{/* Attribution */}
			<div className="mt-6 pt-4 border-t border-gray-100">
				<Skeleton className="h-3 w-64" />
			</div>
		</div>
	);
}

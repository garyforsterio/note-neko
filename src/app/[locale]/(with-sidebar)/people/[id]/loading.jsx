
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PersonLoading;
var skeleton_1 = require("#components/ui/skeleton");
function PersonLoading() {
    return (<div className="container mx-auto px-4 py-8 space-y-8">
			{/* Main Person Card Skeleton */}
			<div className="bg-white p-5 md:p-8 rounded-2xl shadow-sm border border-gray-100">
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 border-b pb-6 border-gray-100">
					<div>
						<skeleton_1.Skeleton className="h-10 w-64 rounded-md mb-2"/>
						<div className="flex items-center gap-3 mt-2">
							<skeleton_1.Skeleton className="h-6 w-32 rounded-md"/>
						</div>
					</div>

					<div className="flex items-center gap-2">
						<skeleton_1.Skeleton className="h-10 w-10 rounded-md"/>
						<skeleton_1.Skeleton className="h-10 w-10 rounded-md"/>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
					<div className="space-y-4">
						<skeleton_1.Skeleton className="h-24 w-full rounded-xl"/>
						<skeleton_1.Skeleton className="h-24 w-full rounded-xl"/>
					</div>
					<div className="space-y-4">
						<skeleton_1.Skeleton className="h-32 w-full rounded-xl"/>
					</div>
				</div>

				<skeleton_1.Skeleton className="h-40 w-full rounded-xl"/>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<div className="lg:col-span-2 space-y-8">
					<skeleton_1.Skeleton className="h-64 w-full rounded-2xl"/>
				</div>
				<div className="space-y-6">
					<skeleton_1.Skeleton className="h-48 w-full rounded-2xl"/>
					<skeleton_1.Skeleton className="h-48 w-full rounded-2xl"/>
				</div>
			</div>
		</div>);
}

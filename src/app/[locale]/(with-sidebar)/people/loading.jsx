
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PeopleLoading;
var skeleton_1 = require("#components/ui/skeleton");
var PageHeader_1 = require("./components/PageHeader");
function PeopleLoading() {
    return (<div className="container mx-auto px-4 py-8">
			<PageHeader_1.default />

			<div className="relative flex items-start gap-8">
				{/* Main List */}
				<div className="flex-1 space-y-12">
					{__spreadArray([], Array(3), true).map((_, groupIndex) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: skeleton data
        <div key={groupIndex}>
							<skeleton_1.Skeleton className="h-8 w-8 mb-6 rounded"/>
							<div className="space-y-6">
								{__spreadArray([], Array(2), true).map((_, entryIndex) => (<div 
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton data
            key={entryIndex} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
										{/* Header */}
										<div className="flex justify-between items-start mb-6 pb-6 border-b border-gray-100">
											<div className="flex items-center gap-6">
												<skeleton_1.Skeleton className="h-16 w-16 rounded-full shrink-0"/>
												<div>
													<skeleton_1.Skeleton className="h-8 w-48 mb-2"/>
													<div className="flex gap-4">
														<skeleton_1.Skeleton className="h-6 w-20 rounded-full"/>
														<skeleton_1.Skeleton className="h-6 w-24"/>
													</div>
												</div>
											</div>
										</div>

										{/* Content */}
										<div className="space-y-4 mb-6">
											<skeleton_1.Skeleton className="h-4 w-full"/>
											<skeleton_1.Skeleton className="h-4 w-3/4"/>
										</div>

										{/* Footer */}
										<div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4 border-t pt-6 border-gray-100">
											<div className="flex gap-2">
												<skeleton_1.Skeleton className="h-6 w-16 rounded-full"/>
												<skeleton_1.Skeleton className="h-6 w-20 rounded-full"/>
												<skeleton_1.Skeleton className="h-6 w-14 rounded-full"/>
											</div>

											<div className="flex gap-2 shrink-0">
												<skeleton_1.Skeleton className="h-8 w-8 rounded-md"/>
												<skeleton_1.Skeleton className="h-8 w-8 rounded-md"/>
											</div>
										</div>
									</div>))}
							</div>
						</div>))}
				</div>

				{/* Side Navigation Skeleton */}
				<div className="hidden md:flex sticky top-24 flex-col gap-1 p-2 bg-white rounded-full shadow-sm border border-gray-100 max-h-[80vh] overflow-y-auto w-12 items-center shrink-0">
					{__spreadArray([], Array(15), true).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: skeleton data
        <skeleton_1.Skeleton key={i} className="w-8 h-8 rounded-full shrink-0"/>))}
				</div>
			</div>
		</div>);
}


Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NewPersonLoading;
var skeleton_1 = require("#components/ui/skeleton");
function NewPersonLoading() {
    return (<div className="container mx-auto px-4 py-8">
			<skeleton_1.Skeleton className="h-8 w-48 mb-6"/>

			<div className="space-y-6">
				{/* Name input */}
				<div>
					<skeleton_1.Skeleton className="h-5 w-24 mb-1"/>
					<skeleton_1.Skeleton className="h-10 w-full"/>
				</div>

				{/* Nickname input */}
				<div>
					<skeleton_1.Skeleton className="h-5 w-24 mb-1"/>
					<skeleton_1.Skeleton className="h-10 w-full"/>
				</div>

				{/* Birthday input */}
				<div>
					<skeleton_1.Skeleton className="h-5 w-24 mb-1"/>
					<skeleton_1.Skeleton className="h-10 w-full"/>
				</div>

				{/* How we met textarea */}
				<div>
					<skeleton_1.Skeleton className="h-5 w-32 mb-1"/>
					<skeleton_1.Skeleton className="h-24 w-full"/>
				</div>

				{/* Interests input */}
				<div>
					<skeleton_1.Skeleton className="h-5 w-24 mb-1"/>
					<skeleton_1.Skeleton className="h-10 w-full"/>
				</div>

				{/* Notes textarea */}
				<div>
					<skeleton_1.Skeleton className="h-5 w-20 mb-1"/>
					<skeleton_1.Skeleton className="h-32 w-full"/>
				</div>

				{/* Action buttons */}
				<div className="flex justify-end space-x-4">
					<skeleton_1.Skeleton className="h-10 w-24"/>
					<skeleton_1.Skeleton className="h-10 w-24"/>
				</div>
			</div>
		</div>);
}

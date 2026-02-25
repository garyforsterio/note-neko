
var __awaiter = (this && this.__awaiter) || ((thisArg, _arguments, P, generator) => {
    function adopt(value) { return value instanceof P ? value : new P((resolve) => { resolve(value); }); }
    return new (P || (P = Promise))((resolve, reject) => {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
});
var __generator = (this && this.__generator) || ((thisArg, body) => {
    var _ = { label: 0, sent: () => { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return (v) => step([n, v]); }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DiaryLoading;
var skeleton_1 = require("#components/ui/skeleton");
var DiaryHeader_1 = require("./components/DiaryHeader");
function DiaryLoading() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, (_a) => [2 /*return*/, (<div className="container mx-auto px-4 py-8">
			{/* Header */}
			<DiaryHeader_1.DiaryHeader entries={[]} allEntryIds={[]} googleMapsApiKey="" isLoading={true}/>

			{/* Entries */}
			<div className="space-y-6">
				{Array.from({ length: 5 }).map((_, i) => (<div 
                    // biome-ignore lint/suspicious/noArrayIndexKey: skeleton only
                    key={i} className="bg-white p-5 md:p-8 rounded-2xl shadow-sm border border-gray-100">
						{/* Header Section */}
						<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 border-b pb-6 border-gray-100">
							<div>
								{/* Day */}
								<skeleton_1.Skeleton className="h-10 w-48 mb-2"/>
								{/* Date + Calendar Icon */}
								<div className="flex items-center gap-3 mt-2">
									<skeleton_1.Skeleton className="h-7 w-36"/>
									<skeleton_1.Skeleton className="h-9 w-9 rounded-full"/>
								</div>
								{/* Location */}
								<div className="flex items-center gap-2 mt-3">
									<skeleton_1.Skeleton className="h-3 w-3"/>
									<skeleton_1.Skeleton className="h-4 w-32"/>
								</div>
							</div>

							{/* Weather Section */}
							<div className="flex justify-around items-center md:gap-6 py-4 md:py-0 select-none w-full md:w-auto">
								<div className="flex flex-col items-center gap-1">
									<div className="flex flex-col items-center gap-0.5">
										<skeleton_1.Skeleton className="h-4 w-4"/> {/* Icon size 16 or 18 */}
										<skeleton_1.Skeleton className="h-5 w-16"/>{" "}
										{/* Smaller metric text */}
									</div>
									<skeleton_1.Skeleton className="h-3 w-12 hidden md:block"/>{" "}
									{/* Hidden label */}
								</div>
								<div className="hidden md:block w-px bg-gray-200 h-10 self-center"/>
								<div className="flex flex-col items-center gap-1">
									<div className="flex flex-col items-center gap-0.5">
										<skeleton_1.Skeleton className="h-4 w-4"/>
										<skeleton_1.Skeleton className="h-5 w-16"/>
									</div>
									<skeleton_1.Skeleton className="h-3 w-12 hidden md:block"/>
								</div>
								<div className="hidden md:block w-px bg-gray-200 h-10 self-center"/>
								<div className="flex flex-col items-center gap-1">
									<div className="flex flex-col items-center gap-0.5">
										<skeleton_1.Skeleton className="h-4 w-4"/>
										<skeleton_1.Skeleton className="h-5 w-16"/>
									</div>
									<skeleton_1.Skeleton className="h-3 w-12 hidden md:block"/>
								</div>
							</div>
						</div>

						{/* Content Section */}
						<div className="space-y-4 mb-8">
							<skeleton_1.Skeleton className="h-4 w-full"/>
							<skeleton_1.Skeleton className="h-4 w-[98%]"/>
							<skeleton_1.Skeleton className="h-4 w-[95%]"/>
							<skeleton_1.Skeleton className="h-4 w-[90%]"/>
							<skeleton_1.Skeleton className="h-4 w-[80%]"/>
						</div>

						{/* Footer/Actions Section */}
						<div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4 border-t pt-6 border-gray-100">
							<div className="flex flex-col gap-3 w-full sm:w-auto">
								<skeleton_1.Skeleton className="h-6 w-48"/>
								<skeleton_1.Skeleton className="h-6 w-32"/>
							</div>

							<div className="flex items-center gap-1 shrink-0">
								<skeleton_1.Skeleton className="h-8 w-8 rounded-md"/>
								<skeleton_1.Skeleton className="h-8 w-8 rounded-md"/>
							</div>
						</div>
					</div>))}
			</div>

			{/* Pagination */}
			<div className="mt-8 flex justify-center gap-2">
				<skeleton_1.Skeleton className="h-10 w-10 rounded-md"/>
				<skeleton_1.Skeleton className="h-10 w-10 rounded-md"/>
				<skeleton_1.Skeleton className="h-10 w-10 rounded-md"/>
				<skeleton_1.Skeleton className="h-10 w-10 rounded-md"/>
				<skeleton_1.Skeleton className="h-10 w-10 rounded-md"/>
			</div>
		</div>)]);
    });
}

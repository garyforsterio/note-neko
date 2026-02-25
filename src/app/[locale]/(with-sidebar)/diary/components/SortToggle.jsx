"use client";

Object.defineProperty(exports, "__esModule", { value: true });
exports.SortToggle = SortToggle;
var lucide_react_1 = require("lucide-react");
var navigation_1 = require("next/navigation");
var next_intl_1 = require("next-intl");
var navigation_2 = require("#i18n/navigation");
function SortToggle() {
    var t = (0, next_intl_1.useTranslations)();
    var router = (0, navigation_2.useRouter)();
    var searchParams = (0, navigation_1.useSearchParams)();
    var currentSort = searchParams.get("sort-order") || "desc";
    var toggleSort = () => {
        var params = new URLSearchParams(searchParams);
        var newSort = currentSort === "desc" ? "asc" : "desc";
        params.set("sort-order", newSort);
        params.set("page", "1");
        router.push("/diary?".concat(params.toString()));
    };
    return (<button type="button" onClick={toggleSort} className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 bg-white border border-gray-200 hover:border-gray-300 px-3 py-2 rounded-full transition-all shadow-sm hover:shadow cursor-pointer" title={currentSort === "desc"
            ? t("diary.sortEarliestFirst")
            : t("diary.sortLatestFirst")}>
			<span className="text-xs uppercase tracking-wide opacity-70">
				{t("diary.date")}:
			</span>
			{currentSort === "desc" ? (<>
					{t("diary.latestFirst")}
					<lucide_react_1.ArrowDown size={14}/>
				</>) : (<>
					{t("diary.earliestFirst")}
					<lucide_react_1.ArrowUp size={14}/>
				</>)}
		</button>);
}

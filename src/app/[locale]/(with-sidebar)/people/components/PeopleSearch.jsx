"use client";

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PeopleSearch;
var lucide_react_1 = require("lucide-react");
var navigation_1 = require("next/navigation");
var next_intl_1 = require("next-intl");
var react_1 = require("react");
var navigation_2 = require("#i18n/navigation");
function PeopleSearch() {
    var t = (0, next_intl_1.useTranslations)();
    var searchParams = (0, navigation_1.useSearchParams)();
    var pathname = (0, navigation_2.usePathname)();
    var router = (0, navigation_2.useRouter)();
    var _a = (0, react_1.useState)(searchParams.get("q") || ""), query = _a[0], setQuery = _a[1];
    (0, react_1.useEffect)(() => {
        var timer = setTimeout(() => {
            var params = new URLSearchParams(searchParams);
            if (query) {
                params.set("q", query);
            }
            else {
                params.delete("q");
            }
            router.replace("".concat(pathname, "?").concat(params.toString()));
        }, 300);
        return () => clearTimeout(timer);
    }, [query, pathname, router, searchParams]);
    return (<div className="relative max-w-sm w-full mr-4">
			<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
				<lucide_react_1.Search className="h-5 w-5 text-gray-400"/>
			</div>
			<input type="text" value={query} onChange={(e) => setQuery(e.target.value)} className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder={t("people.searchPlaceholder")}/>
		</div>);
}

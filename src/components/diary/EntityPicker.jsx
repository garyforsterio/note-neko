"use client";

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
exports.default = EntityPicker;
var lucide_react_1 = require("lucide-react");
var next_intl_1 = require("next-intl");
var react_1 = require("react");
var locations_1 = require("#actions/locations");
function EntityPicker(_a) {
    var type = _a.type, onSelect = _a.onSelect, onClose = _a.onClose, people = _a.people, position = _a.position, _b = _a.initialQuery, initialQuery = _b === void 0 ? "" : _b;
    var t = (0, next_intl_1.useTranslations)();
    var _c = (0, react_1.useState)(initialQuery), search = _c[0], setSearch = _c[1];
    var _d = (0, react_1.useState)([]), results = _d[0], setResults = _d[1];
    var _e = (0, react_1.useState)(false), loading = _e[0], setLoading = _e[1];
    var containerRef = (0, react_1.useRef)(null);
    var searchInputRef = (0, react_1.useRef)(null);
    // Search entities
    (0, react_1.useEffect)(() => {
        if (type === "person") {
            // For people, use local filtering
            var filtered = people.filter((person) => {
                var _a;
                return person.name.toLowerCase().includes(search.toLowerCase()) ||
                    ((_a = person.nickname) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(search.toLowerCase()));
            });
            setResults(filtered);
        }
        else {
            // For locations, use Google Places search
            var searchLocations = () => __awaiter(this, void 0, void 0, function () {
                var locationResults, diaryLocations, error_1;
                return __generator(this, (_a) => {
                    switch (_a.label) {
                        case 0:
                            if (!search.trim()) {
                                setResults([]);
                                return [2 /*return*/];
                            }
                            setLoading(true);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, 4, 5]);
                            return [4 /*yield*/, (0, locations_1.searchLocationsAction)(search)];
                        case 2:
                            locationResults = _a.sent();
                            diaryLocations = locationResults.map((loc) => ({
                                name: loc.name,
                                placeId: loc.placeId,
                                lat: loc.lat,
                                lng: loc.lng,
                            }));
                            setResults(diaryLocations);
                            return [3 /*break*/, 5];
                        case 3:
                            error_1 = _a.sent();
                            console.error("Error searching locations:", error_1);
                            setResults([]);
                            return [3 /*break*/, 5];
                        case 4:
                            setLoading(false);
                            return [7 /*endfinally*/];
                        case 5: return [2 /*return*/];
                    }
                });
            });
            // Debounce the search
            var timeoutId_1 = setTimeout(searchLocations, 500);
            return () => clearTimeout(timeoutId_1);
        }
    }, [search, type, people]);
    // Focus search input on mount and trigger initial search if query provided
    (0, react_1.useEffect)(() => {
        var _a;
        (_a = searchInputRef.current) === null || _a === void 0 ? void 0 : _a.focus();
        // If we have an initial query for locations, trigger the search immediately
        if (initialQuery && type === "location") {
            // The search useEffect will handle this when search state is set
        }
    }, [initialQuery, type]);
    // Close on click outside
    (0, react_1.useEffect)(() => {
        var handleClickOutside = (event) => {
            if (containerRef.current &&
                !containerRef.current.contains(event.target)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);
    // Close on escape key
    (0, react_1.useEffect)(() => {
        var handleEscape = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [onClose]);
    var handleSelect = (entity) => {
        onSelect(entity);
        onClose();
    };
    var isPerson = (entity) => "userId" in entity;
    return (<div ref={containerRef} className="absolute z-50 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-3" style={position}>
			<div className="flex items-center gap-2 mb-3">
				{type === "person" ? (<lucide_react_1.User className="w-4 h-4 text-gray-500"/>) : (<lucide_react_1.MapPin className="w-4 h-4 text-gray-500"/>)}
				<input ref={searchInputRef} type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t(type === "person" ? "diary.searchPeople" : "diary.searchLocations")} className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"/>
			</div>

			<div className="max-h-48 overflow-y-auto">
				{loading ? (<div className="text-center py-4 text-sm text-gray-500">
						{t("common.loading")}
					</div>) : results.length === 0 ? (<div className="text-center py-4 text-sm text-gray-500">
						{t("common.noResults")}
					</div>) : (<div className="space-y-1">
						{results.map((entity, index) => (<button type="button" key={isPerson(entity) ? entity.id : "".concat(entity.placeId, "-").concat(index)} onClick={() => handleSelect(entity)} className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-100 rounded flex items-center gap-2">
								{isPerson(entity) ? (<>
										<lucide_react_1.User className="w-4 h-4 text-gray-400"/>
										<span>{entity.nickname || entity.name}</span>
									</>) : (<>
										<lucide_react_1.MapPin className="w-4 h-4 text-gray-400"/>
										<span>{entity.name}</span>
									</>)}
							</button>))}
					</div>)}
			</div>
		</div>);
}

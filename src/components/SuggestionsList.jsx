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
exports.SuggestionsList = SuggestionsList;
var lucide_react_1 = require("lucide-react");
var next_intl_1 = require("next-intl");
var react_1 = require("react");
var suggestions_1 = require("#actions/suggestions");
function SuggestionsList(_a) {
    var initialSuggestions = _a.suggestions;
    var t = (0, next_intl_1.useTranslations)("people.suggestions");
    var _b = (0, react_1.useState)(initialSuggestions), suggestions = _b[0], setSuggestions = _b[1];
    var _c = (0, react_1.useTransition)(), isPending = _c[0], startTransition = _c[1];
    if (suggestions.length === 0)
        return null;
    var handleResolve = (id, accepted) => {
        setSuggestions((prev) => prev.filter((s) => s.id !== id));
        startTransition(() => __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, (_a) => {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, suggestions_1.resolveSuggestion)(id, accepted)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.error("Failed to resolve suggestion", error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }));
    };
    return (<div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
			<div className="flex items-center gap-2 mb-4 text-indigo-900">
				<lucide_react_1.Sparkles className="h-5 w-5 text-indigo-600"/>
				<h3 className="font-semibold text-lg">{t("title")}</h3>
			</div>
			<div className="space-y-3">
				{suggestions.map((suggestion) => {
            var _a;
            return (<div key={suggestion.id} className="bg-white p-4 rounded-xl shadow-sm border border-indigo-100 flex flex-col gap-3">
						<div>
							<p className="font-medium text-gray-900">
								{suggestion.type === "UPDATE_FIELD" ? (<span>
										{t("updateField", {
                        field: suggestion.targetField || "Unknown",
                    })}
										:{" "}
										<span className="text-indigo-600">{suggestion.value}</span>
									</span>) : suggestion.type === "ADD_RELATIONSHIP" ? (<span>
										{t("addRelationship")}:{" "}
										<strong>{(_a = suggestion.relatedPerson) === null || _a === void 0 ? void 0 : _a.name}</strong>
										{suggestion.relationshipType && (<span> ({suggestion.relationshipType})</span>)}
									</span>) : (t("newSuggestion"))}
							</p>
							{suggestion.reason && (<p className="text-sm text-gray-500 mt-1">
									{suggestion.reason}
								</p>)}
						</div>
						<div className="flex gap-2 justify-end">
							<button type="button" onClick={() => handleResolve(suggestion.id, false)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer" title={t("reject")} disabled={isPending}>
								<lucide_react_1.X size={20}/>
							</button>
							<button type="button" onClick={() => handleResolve(suggestion.id, true)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors cursor-pointer" title={t("accept")} disabled={isPending}>
								<lucide_react_1.Check size={20}/>
							</button>
						</div>
					</div>);
        })}
			</div>
		</div>);
}

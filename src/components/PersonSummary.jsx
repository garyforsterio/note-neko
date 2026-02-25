
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
exports.PersonSummary = PersonSummary;
var lucide_react_1 = require("lucide-react");
var generatePersonSummary_1 = require("#actions/generatePersonSummary");
var server_1 = require("#lib/i18n/server");
function PersonSummary(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var t, summary, error_1;
        var personId = _b.personId;
        return __generator(this, (_c) => {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, server_1.getTranslations)()];
                case 1:
                    t = _c.sent();
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, (0, generatePersonSummary_1.generatePersonSummary)(personId)];
                case 3:
                    summary = _c.sent();
                    if (!summary.summary ||
                        summary.summary.includes("Not enough information")) {
                        return [2 /*return*/, (<div className="bg-white p-5 md:p-8 rounded-2xl shadow-sm border border-gray-100 mb-8">
					<h2 className="text-xl font-bold mb-4 flex items-center gap-2">
						<lucide_react_1.Sparkles className="text-purple-600" size={24}/>
						{t("people.aiSummary.title")}
					</h2>
					<p className="text-gray-500 italic">{t("people.aiSummary.noData")}</p>
				</div>)];
                    }
                    return [2 /*return*/, (<div className="bg-white p-5 md:p-8 rounded-2xl shadow-sm border border-gray-100 mb-8">
				<h2 className="text-xl font-bold mb-6 flex items-center gap-2">
					<lucide_react_1.Sparkles className="text-purple-600" size={24}/>
					{t("people.aiSummary.title")}
				</h2>

				{/* Main Summary */}
				<div className="mb-8">
					<p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">
						{summary.summary}
					</p>
				</div>

				<div className="grid md:grid-cols-2 gap-8">
					{/* Conversation Topics */}
					{summary.conversationTopics.length > 0 && (<div>
							<h3 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
								<lucide_react_1.MessageCircle className="text-blue-500" size={20}/>
								{t("people.aiSummary.conversationTopics")}
							</h3>
							<ul className="space-y-3">
								{summary.conversationTopics.map((topic) => (<li key={topic} className="flex items-start gap-2">
										<span className="text-blue-500 mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0"/>
										<span className="text-gray-700">{topic}</span>
									</li>))}
							</ul>
						</div>)}

					{/* Activity Suggestions */}
					{summary.activitySuggestions.length > 0 && (<div>
							<h3 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
								<lucide_react_1.Target className="text-green-500" size={20}/>
								{t("people.aiSummary.activitySuggestions")}
							</h3>
							<ul className="space-y-3">
								{summary.activitySuggestions.map((activity) => (<li key={activity} className="flex items-start gap-2">
										<span className="text-green-500 mt-1.5 h-1.5 w-1.5 rounded-full bg-green-500 shrink-0"/>
										<span className="text-gray-700">{activity}</span>
									</li>))}
							</ul>
						</div>)}

					{/* Relationship Tips */}
					{summary.relationshipTips.length > 0 && (<div>
							<h3 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
								<lucide_react_1.Lightbulb className="text-purple-500" size={20}/>
								{t("people.aiSummary.relationshipTips")}
							</h3>
							<ul className="space-y-3">
								{summary.relationshipTips.map((tip) => (<li key={tip} className="flex items-start gap-2">
										<span className="text-purple-500 mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0"/>
										<span className="text-gray-700">{tip}</span>
									</li>))}
							</ul>
						</div>)}

					{/* Suggested Interests */}
					{summary.suggestedInterests.length > 0 && (<div>
							<h3 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
								<lucide_react_1.Search className="text-orange-500" size={20}/>
								{t("people.aiSummary.suggestedInterests")}
							</h3>
							<div className="flex flex-wrap gap-2">
								{summary.suggestedInterests.map((interest) => (<span key={interest} className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-sm border border-orange-200">
										{interest}
									</span>))}
							</div>
							<p className="text-xs text-gray-500 mt-2">
								{t("people.aiSummary.suggestedInterestsNote")}
							</p>
						</div>)}
				</div>

				{/* AI Attribution */}
				<div className="mt-8 pt-6 border-t border-gray-100">
					<p className="text-sm text-gray-400 italic flex items-center gap-2">
						<lucide_react_1.Sparkles size={14}/>
						{t("people.aiSummary.attribution")}
					</p>
				</div>
			</div>)];
                case 4:
                    error_1 = _c.sent();
                    console.error("Failed to load person summary:", error_1);
                    return [2 /*return*/, (<div className="bg-white p-5 md:p-8 rounded-2xl shadow-sm border border-gray-100 mb-8">
				<h2 className="text-xl font-bold mb-4 flex items-center gap-2">
					<lucide_react_1.Sparkles className="text-purple-600" size={24}/>
					{t("people.aiSummary.title")}
				</h2>
				<div className="bg-red-50 border border-red-200 rounded-lg p-4">
					<p className="text-red-700">{t("people.aiSummary.error")}</p>
				</div>
			</div>)];
                case 5: return [2 /*return*/];
            }
        });
    });
}

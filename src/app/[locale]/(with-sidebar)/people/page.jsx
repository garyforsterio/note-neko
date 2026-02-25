
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
exports.generateMetadata = generateMetadata;
exports.default = PeoplePage;
var GlobalNetworkGraph_1 = require("#components/GlobalNetworkGraph");
var dal_1 = require("#lib/dal");
var server_1 = require("#lib/i18n/server");
var PageHeader_1 = require("./components/PageHeader");
var PersonList_1 = require("./components/PersonList");
function generateMetadata() {
    return __awaiter(this, void 0, void 0, function () {
        var t;
        return __generator(this, (_a) => {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, server_1.getTranslations)()];
                case 1:
                    t = _a.sent();
                    return [2 /*return*/, {
                            title: t("people.title"),
                        }];
            }
        });
    });
}
function PeoplePage(props) {
    return __awaiter(this, void 0, void 0, function () {
        var t, searchParams, query, people;
        return __generator(this, (_a) => {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, server_1.getTranslations)()];
                case 1:
                    t = _a.sent();
                    return [4 /*yield*/, props.searchParams];
                case 2:
                    searchParams = _a.sent();
                    query = typeof searchParams.q === "string" ? searchParams.q : undefined;
                    return [4 /*yield*/, (0, dal_1.getPeople)(query)];
                case 3:
                    people = _a.sent();
                    return [2 /*return*/, (<div className="container mx-auto px-4 py-8">
			<PageHeader_1.default />

			{people.length > 0 && !query && <GlobalNetworkGraph_1.GlobalNetworkGraph people={people}/>}

			{people.length === 0 ? (<div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
					<p className="text-gray-500">
						{query ? t("common.noResults") : t("people.noPeople")}
					</p>
				</div>) : (<PersonList_1.default people={people}/>)}
		</div>)];
            }
        });
    });
}

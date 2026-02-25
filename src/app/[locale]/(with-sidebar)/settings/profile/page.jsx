
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
exports.default = ProfileSettingsPage;
var server_1 = require("next-intl/server");
var dal_1 = require("#lib/dal");
var ProfileSettingsForm_1 = require("./components/ProfileSettingsForm");
function generateMetadata() {
    return __awaiter(this, void 0, void 0, function () {
        var t;
        return __generator(this, (_a) => {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, server_1.getTranslations)()];
                case 1:
                    t = _a.sent();
                    return [2 /*return*/, {
                            title: t("settings.sections.profile.title"),
                        }];
            }
        });
    });
}
function ProfileSettingsPage() {
    return __awaiter(this, void 0, void 0, function () {
        var t, user, initialDefaultLocation;
        return __generator(this, (_a) => {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, server_1.getTranslations)("settings")];
                case 1:
                    t = _a.sent();
                    return [4 /*yield*/, (0, dal_1.getUserProfile)()];
                case 2:
                    user = _a.sent();
                    initialDefaultLocation = null;
                    if ((user === null || user === void 0 ? void 0 : user.defaultLocationPlaceId) &&
                        (user === null || user === void 0 ? void 0 : user.defaultLocationName) &&
                        (user === null || user === void 0 ? void 0 : user.defaultLocationLat) !== null && // Ensure these are not null
                        (user === null || user === void 0 ? void 0 : user.defaultLocationLng) !== null) {
                        initialDefaultLocation = {
                            placeId: user.defaultLocationPlaceId,
                            name: user.defaultLocationName,
                            lat: user.defaultLocationLat,
                            lng: user.defaultLocationLng,
                        };
                    }
                    return [2 /*return*/, (<div className="container mx-auto px-4 py-8">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-3xl font-bold mb-8">
					{t("sections.profile.title")}
				</h1>

				<div className="bg-white rounded-lg shadow-md p-6">
					<h2 className="text-lg font-semibold mb-4">
						{t("sections.profile.title")}
					</h2>
					<p className="text-gray-600 mb-6">
						{t("sections.profile.description")}
					</p>

					<ProfileSettingsForm_1.ProfileSettingsForm initialDefaultLocation={initialDefaultLocation}/>
				</div>
			</div>
		</div>)];
            }
        });
    });
}

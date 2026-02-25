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
exports.ProfileSettingsForm = ProfileSettingsForm;
var lucide_react_1 = require("lucide-react");
var next_intl_1 = require("next-intl");
var react_1 = require("react");
var react_dom_1 = require("react-dom");
var profile_1 = require("#actions/profile");
var EntityPicker_1 = require("#components/diary/EntityPicker");
var use_toast_1 = require("#hooks/use-toast");
function SubmitButton() {
    var pending = (0, react_dom_1.useFormStatus)().pending;
    var t = (0, next_intl_1.useTranslations)("settings.profile");
    return (<button type="submit" disabled={pending} className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
			{pending && <lucide_react_1.Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
			{t("saveChanges")}
		</button>);
}
function ProfileSettingsForm(_a) {
    var initialDefaultLocation = _a.initialDefaultLocation;
    var _b = (0, react_1.useState)(initialDefaultLocation), selectedLocation = _b[0], setSelectedLocation = _b[1];
    var _c = (0, react_1.useState)(false), isPickerOpen = _c[0], setIsPickerOpen = _c[1];
    var toast = (0, use_toast_1.useToast)().toast;
    var t = (0, next_intl_1.useTranslations)("settings.profile");
    var handleSubmit = (event) => __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, (_a) => {
            switch (_a.label) {
                case 0:
                    event.preventDefault();
                    return [4 /*yield*/, (0, profile_1.updateDefaultLocationAction)(selectedLocation)];
                case 1:
                    result = _a.sent();
                    if (result === null || result === void 0 ? void 0 : result.success) {
                        toast({
                            title: t("saveSuccess"),
                            description: result.message,
                        });
                    }
                    else {
                        toast({
                            title: t("saveError"),
                            description: (result === null || result === void 0 ? void 0 : result.message) || t("failedToSaveDefaultLocation"),
                            variant: "destructive",
                        });
                    }
                    return [2 /*return*/];
            }
        });
    });
    var handleLocationSelect = (entity) => {
        // We only care about locations here
        if ("placeId" in entity) {
            setSelectedLocation({
                placeId: entity.placeId,
                name: entity.name,
                lat: entity.lat,
                lng: entity.lng,
            });
        }
        setIsPickerOpen(false);
    };
    var handleClearLocation = () => {
        setSelectedLocation(null);
    };
    return (<form onSubmit={handleSubmit} className="space-y-6">
			<div>
				<label htmlFor="defaultLocation" className="block text-sm font-medium text-gray-700">
					{t("defaultLocationLabel")}
				</label>
				<p className="mt-1 text-sm text-gray-500">
					{t("defaultLocationDescription")}
				</p>
				<div className="mt-2 relative">
					{selectedLocation ? (<div className="flex items-center justify-between p-3 border rounded-md bg-gray-50">
							<div className="flex items-center gap-2">
								<lucide_react_1.MapPin className="w-4 h-4 text-gray-500"/>
								<span>{selectedLocation.name}</span>
							</div>
							<button type="button" onClick={handleClearLocation} className="text-gray-500 hover:text-gray-700" aria-label="Clear location">
								<lucide_react_1.X className="w-4 h-4"/>
							</button>
						</div>) : (<button type="button" onClick={() => setIsPickerOpen(true)} className="w-full text-left px-3 py-2 border rounded-md text-gray-500 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500">
							{t("searchLocationPlaceholder")}
						</button>)}

					{isPickerOpen && (<EntityPicker_1.default type="location" onSelect={handleLocationSelect} onClose={() => setIsPickerOpen(false)} people={[]} position={{ top: 45, left: 0 }}/>)}
				</div>
			</div>

			<SubmitButton />
		</form>);
}

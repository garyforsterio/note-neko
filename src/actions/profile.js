"use server";

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
exports.updateDefaultLocationAction = updateDefaultLocationAction;
var server_1 = require("next-intl/server");
var zod_1 = require("zod");
var auth_1 = require("#lib/auth");
var dal_1 = require("#lib/dal");
var defaultLocationSchema = zod_1.z.object({
    placeId: zod_1.z.string().min(1, "Place ID is required"),
    name: zod_1.z.string().min(1, "Location name is required"),
    lat: zod_1.z.number(),
    lng: zod_1.z.number(),
});
function updateDefaultLocationAction(data) {
    return __awaiter(this, void 0, void 0, function () {
        var t, validatedData, error_1;
        return __generator(this, (_a) => {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, auth_1.requireAuth)()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, server_1.getTranslations)("settings.profile")];
                case 2:
                    t = _a.sent();
                    if (!data) {
                        return [2 /*return*/, { success: false, message: t("failedToSaveDefaultLocation") }];
                    }
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 5, , 6]);
                    validatedData = defaultLocationSchema.parse(data);
                    return [4 /*yield*/, (0, dal_1.updateUserDefaultLocation)(validatedData)];
                case 4:
                    _a.sent();
                    return [2 /*return*/, { success: true, message: t("defaultLocationSaved") }];
                case 5:
                    error_1 = _a.sent();
                    console.error("Error updating default location:", error_1);
                    if (error_1 instanceof zod_1.z.ZodError) {
                        return [2 /*return*/, { success: false, message: t("invalidLocationData") }];
                    }
                    return [2 /*return*/, { success: false, message: t("failedToSaveDefaultLocation") }];
                case 6: return [2 /*return*/];
            }
        });
    });
}

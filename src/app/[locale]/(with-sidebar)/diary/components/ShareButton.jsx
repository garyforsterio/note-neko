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
exports.default = ShareButton;
var Sentry = require("@sentry/nextjs");
var date_fns_1 = require("date-fns");
var lucide_react_1 = require("lucide-react");
var next_intl_1 = require("next-intl");
var react_1 = require("react");
var DiaryContent_1 = require("#components/DiaryContent");
function ShareButton(_a) {
    var entry = _a.entry, locale = _a.locale;
    var _b = (0, react_1.useState)(false), isCopied = _b[0], setIsCopied = _b[1];
    var t = (0, next_intl_1.useTranslations)();
    var contentRef = (0, react_1.useRef)(null);
    function getContent() {
        var _a;
        return {
            title: (0, date_fns_1.format)(new Date(entry.date), "MMMM d, yyyy"),
            text: ((_a = contentRef.current) === null || _a === void 0 ? void 0 : _a.textContent) || "",
        };
    }
    function handleShare() {
        return __awaiter(this, void 0, void 0, function () {
            var _a, title, text, error_1;
            return __generator(this, (_b) => {
                switch (_b.label) {
                    case 0:
                        if (!navigator.share) {
                            alert(t("diary.shareNotSupported"));
                            return [2 /*return*/];
                        }
                        _a = getContent(), title = _a.title, text = _a.text;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, navigator.share({
                                title: title,
                                text: text,
                            })];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _b.sent();
                        if (error_1 instanceof Error && error_1.name !== "AbortError") {
                            Sentry.captureException(error_1);
                            alert(t("diary.shareError"));
                        }
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    function handleCopy() {
        var _a = getContent(), title = _a.title, text = _a.text;
        var content = "".concat(title, "\n").concat(text);
        navigator.clipboard.writeText(content);
        setIsCopied(true);
    }
    return (<>
			<button type="button" onClick={handleCopy} className="p-2 text-gray-500 hover:text-blue-600 transition-colors cursor-pointer" title={t("diary.copyEntry")} aria-label={t("diary.copyEntry")}>
				{isCopied ? (<lucide_react_1.Check className="h-4 w-4"/>) : (<lucide_react_1.Copy className="h-4 w-4"/>)}
			</button>
			<button type="button" onClick={handleShare} className="p-2 text-gray-500 hover:text-blue-600 transition-colors cursor-pointer" title={t("diary.shareEntry")} aria-label={t("diary.shareEntry")}>
				<lucide_react_1.Share2 className="h-4 w-4"/>
			</button>
			<div ref={contentRef} hidden>
				<DiaryContent_1.DiaryContent content={entry.content} people={entry.mentions.map((mention) => mention.person)} locations={entry.locations} locale={locale}/>
			</div>
		</>);
}

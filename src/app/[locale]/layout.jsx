
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
exports.viewport = void 0;
exports.generateStaticParams = generateStaticParams;
exports.generateMetadata = generateMetadata;
exports.default = RootLayout;
var next_1 = require("@vercel/analytics/next");
var next_2 = require("@vercel/speed-insights/next");
var google_1 = require("next/font/google");
var navigation_1 = require("next/navigation");
var next_intl_1 = require("next-intl");
var server_1 = require("next-intl/server");
var toaster_1 = require("#components/ui/toaster");
var routing_1 = require("#i18n/routing");
require("./globals.css");
var inter = (0, google_1.Inter)({ subsets: ["latin"] });
exports.viewport = {
    width: "device-width",
    initialScale: 1,
    interactiveWidget: "resizes-visual",
};
function generateStaticParams() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, (_a) => [2 /*return*/, routing_1.routing.locales.map((locale) => ({ locale: locale }))]);
    });
}
function generateMetadata() {
    return __awaiter(this, void 0, void 0, function () {
        var t;
        return __generator(this, (_a) => {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, server_1.getTranslations)()];
                case 1:
                    t = _a.sent();
                    return [2 /*return*/, {
                            title: {
                                template: "%s | ".concat(t("home.hero.title")),
                                default: t("home.hero.title"),
                            },
                            description: t("home.hero.subtitle"),
                        }];
            }
        });
    });
}
function RootLayout(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var locale;
        var children = _b.children, params = _b.params;
        return __generator(this, (_c) => {
            switch (_c.label) {
                case 0: return [4 /*yield*/, params];
                case 1:
                    locale = (_c.sent()).locale;
                    if (!(0, next_intl_1.hasLocale)(routing_1.routing.locales, locale)) {
                        (0, navigation_1.notFound)();
                    }
                    return [2 /*return*/, (<html lang={locale}>
			<body className={inter.className}>
				<next_intl_1.NextIntlClientProvider>
					{children}
					<toaster_1.Toaster />
				</next_intl_1.NextIntlClientProvider>
				<next_1.Analytics />
				<next_2.SpeedInsights />
			</body>
		</html>)];
            }
        });
    });
}

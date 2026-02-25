
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.proxy = proxy;
var server_1 = require("next/server");
var middleware_1 = require("next-intl/middleware");
var routing_1 = require("#i18n/routing");
var auth_1 = require("#lib/auth");
var i18nMiddleware = (0, middleware_1.default)(routing_1.routing);
var AUTH_PATHS = [
    "/auth/login",
    "/auth/signup",
    "/auth/forgot-password",
    "/auth/reset-password",
];
var PUBLIC_PATHS = __spreadArray(["", "/"], AUTH_PATHS, true);
function proxy(request) {
    return __awaiter(this, void 0, void 0, function () {
        var pathname, locale, pathnameWithoutLocale, result, url, result, url;
        return __generator(this, (_a) => {
            switch (_a.label) {
                case 0:
                    pathname = request.nextUrl.pathname;
                    locale = pathname.split("/")[1] || "en";
                    pathnameWithoutLocale = pathname.replace("/".concat(locale), "");
                    if (PUBLIC_PATHS.includes(pathnameWithoutLocale)) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, auth_1.validateTokens)()];
                case 1:
                    result = _a.sent();
                    if (!result) {
                        url = new URL("/".concat(locale, "/auth/login"), request.url);
                        url.searchParams.set("from", pathname);
                        return [2 /*return*/, server_1.NextResponse.redirect(url)];
                    }
                    // If access token was refreshed, redirect to same URL with 307 status
                    if (result.wasRefreshed) {
                        return [2 /*return*/, server_1.NextResponse.redirect(request.url, 307)];
                    }
                    return [2 /*return*/, server_1.NextResponse.next()];
                case 2:
                    if (!AUTH_PATHS.includes(pathnameWithoutLocale)) return [3 /*break*/, 4];
                    return [4 /*yield*/, (0, auth_1.validateTokens)()];
                case 3:
                    result = _a.sent();
                    if (result) {
                        url = new URL("/".concat(locale, "/diary"), request.url);
                        return [2 /*return*/, server_1.NextResponse.redirect(url)];
                    }
                    _a.label = 4;
                case 4: return [2 /*return*/, i18nMiddleware(request)];
            }
        });
    });
}
exports.config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!api|images|.well-known|monitoring|manifest.json|_next/static|_next/image|favicon.ico).*)",
    ],
};

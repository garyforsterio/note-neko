
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
exports.validateTokens = void 0;
exports.createUserSession = createUserSession;
exports.requireAuth = requireAuth;
exports.deleteUserSession = deleteUserSession;
var Sentry = require("@sentry/nextjs");
var jose_1 = require("jose");
var headers_1 = require("next/headers");
var react_1 = require("react");
var navigation_1 = require("#i18n/navigation");
var db_1 = require("#lib/db");
var JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key");
function generateTokens(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var accessToken, refreshToken, refreshTokenExpiry;
        return __generator(this, (_a) => {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new jose_1.SignJWT({ userId: userId })
                        .setProtectedHeader({ alg: "HS256" })
                        .setExpirationTime("1h")
                        .sign(JWT_SECRET)];
                case 1:
                    accessToken = _a.sent();
                    refreshToken = crypto.randomUUID();
                    refreshTokenExpiry = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
                    return [4 /*yield*/, db_1.db.refreshToken.create({
                            data: {
                                token: refreshToken,
                                userId: userId,
                                expiresAt: refreshTokenExpiry,
                            },
                        })];
                case 2:
                    _a.sent();
                    return [2 /*return*/, { accessToken: accessToken, refreshToken: refreshToken }];
            }
        });
    });
}
function setTokens(accessToken, refreshToken) {
    return __awaiter(this, void 0, void 0, function () {
        var cookieStore;
        return __generator(this, (_a) => {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, headers_1.cookies)()];
                case 1:
                    cookieStore = _a.sent();
                    cookieStore.set("accessToken", accessToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production",
                        sameSite: "lax",
                        maxAge: 60 * 60, // 1 hour
                    });
                    cookieStore.set("refreshToken", refreshToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production",
                        sameSite: "lax",
                        maxAge: 60 * 60 * 24 * 30, // 30 days
                    });
                    return [2 /*return*/];
            }
        });
    });
}
function createUserSession(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, accessToken, refreshToken;
        return __generator(this, (_b) => {
            switch (_b.label) {
                case 0: return [4 /*yield*/, generateTokens(userId)];
                case 1:
                    _a = _b.sent(), accessToken = _a.accessToken, refreshToken = _a.refreshToken;
                    return [4 /*yield*/, setTokens(accessToken, refreshToken)];
                case 2:
                    _b.sent();
                    return [2 /*return*/, accessToken];
            }
        });
    });
}
function refreshAccessToken(refreshToken) {
    return __awaiter(this, void 0, void 0, function () {
        var storedToken, accessToken;
        return __generator(this, (_a) => {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.db.refreshToken.findUnique({
                        where: { token: refreshToken },
                        include: { user: true },
                    })];
                case 1:
                    storedToken = _a.sent();
                    if (!storedToken) {
                        console.debug("No stored token found");
                        return [2 /*return*/, null];
                    }
                    if (!(storedToken.expiresAt < new Date())) return [3 /*break*/, 3];
                    return [4 /*yield*/, db_1.db.refreshToken.delete({
                            where: { id: storedToken.id },
                        })];
                case 2:
                    _a.sent();
                    console.debug("Token expired, deleting");
                    return [2 /*return*/, null];
                case 3: return [4 /*yield*/, createUserSession(storedToken.userId)];
                case 4:
                    accessToken = _a.sent();
                    return [4 /*yield*/, db_1.db.refreshToken.delete({
                            where: { id: storedToken.id },
                        })];
                case 5:
                    _a.sent();
                    console.debug("Access token refreshed");
                    return [2 /*return*/, accessToken];
            }
        });
    });
}
exports.validateTokens = (0, react_1.cache)(() => __awaiter(void 0, void 0, void 0, function () {
    var cookieStore, refreshToken, accessToken, wasRefreshed, payload, error_1;
    var _a, _b;
    return __generator(this, (_c) => {
        switch (_c.label) {
            case 0: return [4 /*yield*/, (0, headers_1.cookies)()];
            case 1:
                cookieStore = _c.sent();
                refreshToken = (_a = cookieStore.get("refreshToken")) === null || _a === void 0 ? void 0 : _a.value;
                if (!refreshToken) {
                    console.debug("No refresh token found");
                    return [2 /*return*/, null];
                }
                accessToken = (_b = cookieStore.get("accessToken")) === null || _b === void 0 ? void 0 : _b.value;
                wasRefreshed = false;
                if (accessToken) return [3 /*break*/, 3];
                console.debug("No access token found, refreshing");
                return [4 /*yield*/, refreshAccessToken(refreshToken)];
            case 2:
                accessToken = _c.sent();
                if (!accessToken)
                    return [2 /*return*/, null];
                wasRefreshed = true;
                _c.label = 3;
            case 3:
                _c.trys.push([3, 5, , 6]);
                return [4 /*yield*/, (0, jose_1.jwtVerify)(accessToken, JWT_SECRET)];
            case 4:
                payload = (_c.sent()).payload;
                return [2 /*return*/, {
                        userId: payload.userId,
                        wasRefreshed: wasRefreshed,
                    }];
            case 5:
                error_1 = _c.sent();
                Sentry.captureException(error_1);
                return [2 /*return*/, null];
            case 6: return [2 /*return*/];
        }
    });
}));
function requireAuth() {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, (_a) => {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, exports.validateTokens)()];
                case 1:
                    result = _a.sent();
                    if (!result) {
                        return [2 /*return*/, (0, navigation_1.redirect)({
                                href: "/auth/login",
                                locale: "en",
                            })];
                    }
                    return [2 /*return*/, result];
            }
        });
    });
}
function deleteUserSession() {
    return __awaiter(this, void 0, void 0, function () {
        var cookieStore, refreshToken;
        var _a;
        return __generator(this, (_b) => {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, headers_1.cookies)()];
                case 1:
                    cookieStore = _b.sent();
                    refreshToken = (_a = cookieStore.get("refreshToken")) === null || _a === void 0 ? void 0 : _a.value;
                    if (!refreshToken) return [3 /*break*/, 3];
                    return [4 /*yield*/, db_1.db.refreshToken.delete({
                            where: { token: refreshToken },
                        })];
                case 2:
                    _b.sent();
                    _b.label = 3;
                case 3:
                    cookieStore.delete("accessToken");
                    cookieStore.delete("refreshToken");
                    return [2 /*return*/];
            }
        });
    });
}

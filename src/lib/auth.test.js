
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.hasOwn(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var Sentry = require("@sentry/nextjs");
var jose_1 = require("jose");
var headers_1 = require("next/headers");
var vitest_1 = require("vitest");
var navigation_1 = require("#i18n/navigation");
var db_1 = require("#lib/db");
var auth_1 = require("./auth");
// Mock dependencies
vitest_1.vi.mock("@sentry/nextjs", () => ({
    captureException: vitest_1.vi.fn(),
}));
vitest_1.vi.mock("next/headers", () => ({
    cookies: vitest_1.vi.fn(),
}));
vitest_1.vi.mock("#i18n/navigation", () => ({
    redirect: vitest_1.vi.fn(),
}));
vitest_1.vi.mock("#lib/db", () => ({
    db: {
        refreshToken: {
            create: vitest_1.vi.fn(),
            findUnique: vitest_1.vi.fn(),
            delete: vitest_1.vi.fn(),
        },
        user: {
            findUnique: vitest_1.vi.fn(),
        },
    },
}));
vitest_1.vi.mock("jose", () => ({
    SignJWT: vitest_1.vi.fn(),
    jwtVerify: vitest_1.vi.fn(),
}));
(0, vitest_1.describe)("auth.ts", () => {
    var mockCookieStore = {
        get: vitest_1.vi.fn(),
        set: vitest_1.vi.fn(),
        delete: vitest_1.vi.fn(),
    };
    var mockUser = {
        id: "user-123",
        email: "test@example.com",
    };
    var mockRefreshToken = {
        id: "refresh-123",
        token: "refresh-token-123",
        userId: "user-123",
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        createdAt: new Date(),
        updatedAt: new Date(),
        user: mockUser,
    };
    var mockSignJWT = vitest_1.vi.mocked(jose_1.SignJWT);
    var mockJwtVerify = vitest_1.vi.mocked(jose_1.jwtVerify);
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        vitest_1.vi.mocked(headers_1.cookies).mockResolvedValue(mockCookieStore);
    });
    (0, vitest_1.describe)("createUserSession", () => {
        (0, vitest_1.it)("should create a new user session with tokens", () => __awaiter(void 0, void 0, void 0, function () {
            var mockAccessToken, mockSign, mockSetProtectedHeader, mockSetExpirationTime, result;
            return __generator(this, (_a) => {
                switch (_a.label) {
                    case 0:
                        mockAccessToken = "mock-access-token";
                        mockSign = vitest_1.vi.fn().mockResolvedValue(mockAccessToken);
                        mockSetProtectedHeader = vitest_1.vi.fn().mockReturnThis();
                        mockSetExpirationTime = vitest_1.vi.fn().mockReturnThis();
                        mockSignJWT.mockImplementation(() => ({
                                setProtectedHeader: mockSetProtectedHeader,
                                setExpirationTime: mockSetExpirationTime,
                                sign: mockSign,
                            }));
                        // Mock database create
                        vitest_1.vi.mocked(db_1.db.refreshToken.create).mockResolvedValue({
                            id: "refresh-123",
                            token: "mock-uuid",
                            userId: "user-123",
                            expiresAt: new Date(),
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        });
                        return [4 /*yield*/, (0, auth_1.createUserSession)("user-123")];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(result).toBe(mockAccessToken);
                        (0, vitest_1.expect)(db_1.db.refreshToken.create).toHaveBeenCalledWith({
                            data: {
                                token: "mock-uuid",
                                userId: "user-123",
                                expiresAt: vitest_1.expect.any(Date),
                            },
                        });
                        (0, vitest_1.expect)(mockCookieStore.set).toHaveBeenCalledTimes(2);
                        return [2 /*return*/];
                }
            });
        }));
    });
    (0, vitest_1.describe)("validateTokens", () => {
        (0, vitest_1.it)("should return null when no refresh token is found", () => __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, (_a) => {
                switch (_a.label) {
                    case 0:
                        mockCookieStore.get.mockReturnValue(undefined);
                        return [4 /*yield*/, (0, auth_1.validateTokens)()];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(result).toBeNull();
                        return [2 /*return*/];
                }
            });
        }));
        (0, vitest_1.it)("should return user data when access token is valid", () => __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, (_a) => {
                switch (_a.label) {
                    case 0:
                        mockCookieStore.get.mockImplementation((name) => {
                            if (name === "refreshToken")
                                return { value: "refresh-token-123" };
                            if (name === "accessToken")
                                return { value: "access-token-123" };
                            return undefined;
                        });
                        mockJwtVerify.mockResolvedValue({
                            payload: { userId: "user-123" },
                            protectedHeader: { alg: "HS256" },
                            key: {},
                        });
                        return [4 /*yield*/, (0, auth_1.validateTokens)()];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(result).toEqual({
                            userId: "user-123",
                            wasRefreshed: false,
                        });
                        return [2 /*return*/];
                }
            });
        }));
        (0, vitest_1.it)("should refresh token when access token is missing", () => __awaiter(void 0, void 0, void 0, function () {
            var mockSign, mockSetProtectedHeader, mockSetExpirationTime, result;
            return __generator(this, (_a) => {
                switch (_a.label) {
                    case 0:
                        mockCookieStore.get.mockImplementation((name) => {
                            if (name === "refreshToken")
                                return { value: "refresh-token-123" };
                            if (name === "accessToken")
                                return undefined;
                            return undefined;
                        });
                        // Mock database operations for refresh
                        vitest_1.vi.mocked(db_1.db.refreshToken.findUnique).mockResolvedValue(mockRefreshToken);
                        vitest_1.vi.mocked(db_1.db.refreshToken.delete).mockResolvedValue(mockRefreshToken);
                        vitest_1.vi.mocked(db_1.db.refreshToken.create).mockResolvedValue({
                            id: "new-refresh-123",
                            token: "mock-uuid",
                            userId: "user-123",
                            expiresAt: new Date(),
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        });
                        mockSign = vitest_1.vi.fn().mockResolvedValue("new-access-token");
                        mockSetProtectedHeader = vitest_1.vi.fn().mockReturnThis();
                        mockSetExpirationTime = vitest_1.vi.fn().mockReturnThis();
                        mockSignJWT.mockImplementation(() => ({
                                setProtectedHeader: mockSetProtectedHeader,
                                setExpirationTime: mockSetExpirationTime,
                                sign: mockSign,
                            }));
                        mockJwtVerify.mockResolvedValue({
                            payload: { userId: "user-123" },
                            protectedHeader: { alg: "HS256" },
                            key: {},
                        });
                        return [4 /*yield*/, (0, auth_1.validateTokens)()];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(result).toEqual({
                            userId: "user-123",
                            wasRefreshed: true,
                        });
                        (0, vitest_1.expect)(db_1.db.refreshToken.findUnique).toHaveBeenCalledWith({
                            where: { token: "refresh-token-123" },
                            include: { user: true },
                        });
                        return [2 /*return*/];
                }
            });
        }));
        (0, vitest_1.it)("should return null when refresh token is expired", () => __awaiter(void 0, void 0, void 0, function () {
            var expiredToken, result;
            return __generator(this, (_a) => {
                switch (_a.label) {
                    case 0:
                        mockCookieStore.get.mockImplementation((name) => {
                            if (name === "refreshToken")
                                return { value: "refresh-token-123" };
                            if (name === "accessToken")
                                return undefined;
                            return undefined;
                        });
                        expiredToken = __assign(__assign({}, mockRefreshToken), { expiresAt: new Date(Date.now() - 1000 * 60 * 60) });
                        vitest_1.vi.mocked(db_1.db.refreshToken.findUnique).mockResolvedValue(expiredToken);
                        vitest_1.vi.mocked(db_1.db.refreshToken.delete).mockResolvedValue(expiredToken);
                        return [4 /*yield*/, (0, auth_1.validateTokens)()];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(result).toBeNull();
                        (0, vitest_1.expect)(db_1.db.refreshToken.delete).toHaveBeenCalledWith({
                            where: { id: expiredToken.id },
                        });
                        return [2 /*return*/];
                }
            });
        }));
        (0, vitest_1.it)("should return null when refresh token is not found in database", () => __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, (_a) => {
                switch (_a.label) {
                    case 0:
                        mockCookieStore.get.mockImplementation((name) => {
                            if (name === "refreshToken")
                                return { value: "invalid-token" };
                            if (name === "accessToken")
                                return undefined;
                            return undefined;
                        });
                        vitest_1.vi.mocked(db_1.db.refreshToken.findUnique).mockResolvedValue(null);
                        return [4 /*yield*/, (0, auth_1.validateTokens)()];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(result).toBeNull();
                        return [2 /*return*/];
                }
            });
        }));
        (0, vitest_1.it)("should handle JWT verification errors", () => __awaiter(void 0, void 0, void 0, function () {
            var jwtError, result;
            return __generator(this, (_a) => {
                switch (_a.label) {
                    case 0:
                        mockCookieStore.get.mockImplementation((name) => {
                            if (name === "refreshToken")
                                return { value: "refresh-token-123" };
                            if (name === "accessToken")
                                return { value: "invalid-token" };
                            return undefined;
                        });
                        jwtError = new Error("Invalid token");
                        mockJwtVerify.mockRejectedValue(jwtError);
                        return [4 /*yield*/, (0, auth_1.validateTokens)()];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(result).toBeNull();
                        (0, vitest_1.expect)(Sentry.captureException).toHaveBeenCalledWith(jwtError);
                        return [2 /*return*/];
                }
            });
        }));
    });
    (0, vitest_1.describe)("requireAuth", () => {
        (0, vitest_1.it)("should return user data when authentication is valid", () => __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, (_a) => {
                switch (_a.label) {
                    case 0:
                        mockCookieStore.get.mockImplementation((name) => {
                            if (name === "refreshToken")
                                return { value: "refresh-token-123" };
                            if (name === "accessToken")
                                return { value: "access-token-123" };
                            return undefined;
                        });
                        mockJwtVerify.mockResolvedValue({
                            payload: { userId: "user-123" },
                            protectedHeader: { alg: "HS256" },
                            key: {},
                        });
                        return [4 /*yield*/, (0, auth_1.requireAuth)()];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(result).toEqual({
                            userId: "user-123",
                            wasRefreshed: false,
                        });
                        return [2 /*return*/];
                }
            });
        }));
        (0, vitest_1.it)("should redirect to login when authentication fails", () => __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, (_a) => {
                switch (_a.label) {
                    case 0:
                        mockCookieStore.get.mockReturnValue(undefined);
                        return [4 /*yield*/, (0, auth_1.requireAuth)()];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(navigation_1.redirect).toHaveBeenCalledWith({
                            href: "/auth/login",
                            locale: "en",
                        });
                        return [2 /*return*/];
                }
            });
        }));
    });
    (0, vitest_1.describe)("deleteUserSession", () => {
        (0, vitest_1.it)("should delete tokens and cookies", () => __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, (_a) => {
                switch (_a.label) {
                    case 0:
                        mockCookieStore.get.mockImplementation((name) => {
                            if (name === "refreshToken")
                                return { value: "refresh-token-123" };
                            return undefined;
                        });
                        vitest_1.vi.mocked(db_1.db.refreshToken.delete).mockResolvedValue(mockRefreshToken);
                        return [4 /*yield*/, (0, auth_1.deleteUserSession)()];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(db_1.db.refreshToken.delete).toHaveBeenCalledWith({
                            where: { token: "refresh-token-123" },
                        });
                        (0, vitest_1.expect)(mockCookieStore.delete).toHaveBeenCalledWith("accessToken");
                        (0, vitest_1.expect)(mockCookieStore.delete).toHaveBeenCalledWith("refreshToken");
                        return [2 /*return*/];
                }
            });
        }));
        (0, vitest_1.it)("should handle case when no refresh token exists", () => __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, (_a) => {
                switch (_a.label) {
                    case 0:
                        mockCookieStore.get.mockReturnValue(undefined);
                        return [4 /*yield*/, (0, auth_1.deleteUserSession)()];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(db_1.db.refreshToken.delete).not.toHaveBeenCalled();
                        (0, vitest_1.expect)(mockCookieStore.delete).toHaveBeenCalledWith("accessToken");
                        (0, vitest_1.expect)(mockCookieStore.delete).toHaveBeenCalledWith("refreshToken");
                        return [2 /*return*/];
                }
            });
        }));
    });
});

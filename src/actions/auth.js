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
exports.signUp = signUp;
exports.login = login;
exports.logout = logout;
exports.requestPasswordReset = requestPasswordReset;
exports.resetPassword = resetPassword;
var zod_1 = require("@conform-to/zod");
var bcryptjs_1 = require("bcryptjs");
var server_1 = require("next-intl/server");
var navigation_1 = require("#i18n/navigation");
var auth_1 = require("#lib/auth");
var db_1 = require("#lib/db");
var server_2 = require("#lib/i18n/server");
var auth_2 = require("#schema/auth");
var RESET_TOKEN_EXPIRY = 1000 * 60 * 60; // 1 hour
function signUp(_lastResult, formData) {
    return __awaiter(this, void 0, void 0, function () {
        var t, submission, existingUser, passwordHash, locale;
        return __generator(this, (_a) => {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, server_2.getTranslations)()];
                case 1:
                    t = _a.sent();
                    submission = (0, zod_1.parseWithZod)(formData, { schema: auth_2.signUpSchema });
                    if (submission.status !== "success") {
                        return [2 /*return*/, submission.reply()];
                    }
                    return [4 /*yield*/, db_1.db.user.findUnique({
                            where: { email: submission.value.email },
                        })];
                case 2:
                    existingUser = _a.sent();
                    if (existingUser) {
                        return [2 /*return*/, submission.reply({
                                formErrors: [t("auth.signup.error.emailExists")],
                            })];
                    }
                    return [4 /*yield*/, (0, bcryptjs_1.hash)(submission.value.password, 12)];
                case 3:
                    passwordHash = _a.sent();
                    return [4 /*yield*/, db_1.db.user.create({
                            data: {
                                email: submission.value.email,
                                passwordHash: passwordHash,
                            },
                        })];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, (0, server_1.getLocale)()];
                case 5:
                    locale = _a.sent();
                    return [2 /*return*/, (0, navigation_1.redirect)({
                            href: "/auth/login?registered=true",
                            locale: locale,
                        })];
            }
        });
    });
}
function login(_lastResult, formData) {
    return __awaiter(this, void 0, void 0, function () {
        var t, submission, user, isValid, locale;
        return __generator(this, (_a) => {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, server_2.getTranslations)()];
                case 1:
                    t = _a.sent();
                    submission = (0, zod_1.parseWithZod)(formData, { schema: auth_2.loginSchema });
                    if (submission.status !== "success") {
                        return [2 /*return*/, submission.reply()];
                    }
                    return [4 /*yield*/, db_1.db.user.findUnique({
                            where: { email: submission.value.email },
                        })];
                case 2:
                    user = _a.sent();
                    if (!user) {
                        return [2 /*return*/, submission.reply({
                                formErrors: [t("auth.login.error.invalidCredentials")],
                            })];
                    }
                    return [4 /*yield*/, (0, bcryptjs_1.compare)(submission.value.password, user.passwordHash)];
                case 3:
                    isValid = _a.sent();
                    if (!isValid) {
                        return [2 /*return*/, submission.reply({
                                formErrors: [t("auth.login.error.invalidCredentials")],
                            })];
                    }
                    return [4 /*yield*/, (0, auth_1.createUserSession)(user.id)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, (0, server_1.getLocale)()];
                case 5:
                    locale = _a.sent();
                    return [2 /*return*/, (0, navigation_1.redirect)({
                            href: "/diary",
                            locale: locale,
                        })];
            }
        });
    });
}
function logout() {
    return __awaiter(this, void 0, void 0, function () {
        var locale;
        return __generator(this, (_a) => {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, auth_1.deleteUserSession)()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, server_1.getLocale)()];
                case 2:
                    locale = _a.sent();
                    return [2 /*return*/, (0, navigation_1.redirect)({
                            href: "/auth/login",
                            locale: locale,
                        })];
            }
        });
    });
}
function requestPasswordReset(_lastResult, formData) {
    return __awaiter(this, void 0, void 0, function () {
        var submission, user, resetToken, resetTokenExpiry;
        return __generator(this, (_a) => {
            switch (_a.label) {
                case 0:
                    submission = (0, zod_1.parseWithZod)(formData, { schema: auth_2.forgotPasswordSchema });
                    if (submission.status !== "success") {
                        return [2 /*return*/, submission.reply()];
                    }
                    return [4 /*yield*/, db_1.db.user.findUnique({
                            where: { email: submission.value.email },
                        })];
                case 1:
                    user = _a.sent();
                    if (!user) {
                        // Don't reveal that the user doesn't exist
                        return [2 /*return*/, submission.reply()];
                    }
                    resetToken = crypto.randomUUID();
                    resetTokenExpiry = new Date(Date.now() + RESET_TOKEN_EXPIRY);
                    return [4 /*yield*/, db_1.db.user.update({
                            where: { id: user.id },
                            data: {
                                resetToken: resetToken,
                                resetTokenExpiry: resetTokenExpiry,
                            },
                        })];
                case 2:
                    _a.sent();
                    // const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}`;
                    return [2 /*return*/, submission.reply()];
            }
        });
    });
}
function resetPassword(_lastResult, formData) {
    return __awaiter(this, void 0, void 0, function () {
        var t, submission, user, passwordHash, locale;
        return __generator(this, (_a) => {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, server_2.getTranslations)()];
                case 1:
                    t = _a.sent();
                    submission = (0, zod_1.parseWithZod)(formData, { schema: auth_2.resetPasswordSchema });
                    if (submission.status !== "success") {
                        return [2 /*return*/, submission.reply()];
                    }
                    return [4 /*yield*/, db_1.db.user.findFirst({
                            where: {
                                resetToken: submission.value.token,
                                resetTokenExpiry: {
                                    gt: new Date(),
                                },
                            },
                        })];
                case 2:
                    user = _a.sent();
                    if (!user) {
                        return [2 /*return*/, submission.reply({
                                formErrors: [t("auth.resetPassword.error.invalidToken")],
                            })];
                    }
                    return [4 /*yield*/, (0, bcryptjs_1.hash)(submission.value.password, 12)];
                case 3:
                    passwordHash = _a.sent();
                    return [4 /*yield*/, db_1.db.user.update({
                            where: { id: user.id },
                            data: {
                                passwordHash: passwordHash,
                                resetToken: null,
                                resetTokenExpiry: null,
                            },
                        })];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, (0, server_1.getLocale)()];
                case 5:
                    locale = _a.sent();
                    return [2 /*return*/, (0, navigation_1.redirect)({
                            href: "/auth/login?reset=true",
                            locale: locale,
                        })];
            }
        });
    });
}

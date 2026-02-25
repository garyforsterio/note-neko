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
exports.default = Navigation;
var lucide_react_1 = require("lucide-react");
var next_intl_1 = require("next-intl");
var auth_1 = require("#actions/auth");
var navigation_1 = require("#i18n/navigation");
var utils_1 = require("#lib/utils");
var navigation = [
    {
        name: "Diary",
        href: "/diary",
        icon: lucide_react_1.BookOpen,
    },
    {
        name: "People",
        href: "/people",
        icon: lucide_react_1.Users,
    },
    {
        name: "Settings",
        href: "/settings",
        icon: lucide_react_1.Settings,
        subItems: [
            {
                name: "profile",
                href: "/settings/profile",
                icon: lucide_react_1.User,
            },
            {
                name: "social",
                href: "/settings/social",
                icon: lucide_react_1.Share2,
            },
            {
                name: "privacy",
                href: "/settings/privacy",
                icon: lucide_react_1.Shield,
            },
            {
                name: "account",
                href: "/settings/account",
                icon: lucide_react_1.CreditCard,
            },
        ],
    },
];
function Navigation() {
    var t = (0, next_intl_1.useTranslations)();
    var pathname = (0, navigation_1.usePathname)();
    return (<>
			{/* Desktop Sidebar */}
			<div className="hidden md:fixed md:inset-y-0 md:flex md:w-72 md:flex-col">
				<div className="flex min-h-0 flex-1 flex-col border-r border-gray-100 bg-white shadow-[1px_0_20px_0_rgba(0,0,0,0.02)]">
					{/* Brand */}
					<div className="flex h-20 flex-shrink-0 items-center px-8">
						<navigation_1.Link href="/" className="text-2xl font-serif font-bold text-gray-900 tracking-tight">
							Note Neko
						</navigation_1.Link>
					</div>

					{/* Navigation Links */}
					<nav className="flex-1 space-y-2 px-4 py-6">
						{navigation.map((item) => {
            var isActive = pathname.startsWith(item.href);
            var isSettingsSection = item.name === "Settings" && pathname.startsWith("/settings");
            return (<div key={item.name} className="space-y-1">
									<navigation_1.Link href={item.href} className={(0, utils_1.cn)(isActive
                    ? "bg-gray-900 text-white shadow-md shadow-gray-200"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900", "group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ease-in-out")}>
										<item.icon className={(0, utils_1.cn)(isActive
                    ? "text-white"
                    : "text-gray-400 group-hover:text-gray-600", "mr-3 flex-shrink-0 h-5 w-5 transition-colors")} aria-hidden="true"/>
										{item.name}
									</navigation_1.Link>

									{/* Settings Subitems */}
									{isSettingsSection && item.subItems && (<div className="mt-2 ml-4 pl-4 border-l border-gray-100 space-y-0.5">
											{item.subItems.map((subItem) => {
                        var isSubActive = pathname === subItem.href ||
                            pathname.startsWith("".concat(subItem.href, "/"));
                        return (<navigation_1.Link key={subItem.name} href={subItem.href} className={(0, utils_1.cn)(isSubActive
                                ? "bg-gray-100 text-gray-900 font-semibold"
                                : "text-gray-500 hover:bg-gray-50 hover:text-gray-700", "group flex items-center px-4 py-2 text-sm rounded-lg transition-colors")}>
														<subItem.icon className={(0, utils_1.cn)(isSubActive
                                ? "text-gray-900"
                                : "text-gray-400 group-hover:text-gray-600", "mr-3 flex-shrink-0 h-4 w-4")} aria-hidden="true"/>
														{t("settings.navigation.".concat(subItem.name))}
													</navigation_1.Link>);
                    })}

											{/* Logout Button */}
											<div className="pt-2 mt-2 border-t border-gray-100">
												<button type="button" onClick={() => __awaiter(this, void 0, void 0, function () {
                        return __generator(this, (_a) => {
                            switch (_a.label) {
                                case 0:
                                    if (!confirm(t("settings.logout.confirm"))) return [3 /*break*/, 2];
                                    return [4 /*yield*/, (0, auth_1.logout)()];
                                case 1:
                                    _a.sent();
                                    _a.label = 2;
                                case 2: return [2 /*return*/];
                            }
                        });
                    })} className="group flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer">
													<lucide_react_1.LogOut className="mr-3 flex-shrink-0 h-4 w-4"/>
													{t("settings.logout.title")}
												</button>
											</div>
										</div>)}
								</div>);
        })}
					</nav>
				</div>
			</div>

			{/* Mobile Bottom Navigation */}
			<div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 pb-[env(safe-area-inset-bottom)]">
				<div className="flex justify-around items-center h-16 px-2">
					{navigation.map((item) => {
            var isActive = pathname.startsWith(item.href);
            return (<navigation_1.Link key={item.name} href={item.href} className={(0, utils_1.cn)("flex flex-col items-center justify-center w-full h-full space-y-1 active:scale-95 transition-transform", isActive
                    ? "text-gray-900"
                    : "text-gray-400 hover:text-gray-600")}>
								<item.icon className={(0, utils_1.cn)("h-6 w-6 transition-colors", isActive ? "text-gray-900" : "text-gray-400")}/>
								<span className="text-[10px] font-medium">{item.name}</span>
							</navigation_1.Link>);
        })}
				</div>
			</div>
		</>);
}


var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPathname = exports.useRouter = exports.usePathname = exports.redirect = exports.Link = void 0;
var navigation_1 = require("next-intl/navigation");
var routing_1 = require("./routing");
// Lightweight wrappers around Next.js' navigation
// APIs that consider the routing configuration
exports.Link = (_a = (0, navigation_1.createNavigation)(routing_1.routing), _a.Link), exports.redirect = _a.redirect, exports.usePathname = _a.usePathname, exports.useRouter = _a.useRouter, exports.getPathname = _a.getPathname;

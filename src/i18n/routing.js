
Object.defineProperty(exports, "__esModule", { value: true });
exports.routing = void 0;
var routing_1 = require("next-intl/routing");
exports.routing = (0, routing_1.defineRouting)({
    // A list of all locales that are supported
    locales: ["en", "ja"],
    // Used when no locale matches
    defaultLocale: "en",
});

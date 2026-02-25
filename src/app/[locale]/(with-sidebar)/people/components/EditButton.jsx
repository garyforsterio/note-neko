"use client";

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = EditButton;
var lucide_react_1 = require("lucide-react");
var next_intl_1 = require("next-intl");
var navigation_1 = require("#i18n/navigation");
var utils_1 = require("#lib/utils");
function EditButton(_a) {
    var personId = _a.personId, size = _a.size;
    var t = (0, next_intl_1.useTranslations)();
    return (<navigation_1.Link href={"/people/".concat(personId, "/edit")} className="p-2 text-gray-500 hover:text-blue-600 transition-colors cursor-pointer" aria-label={t("people.editProfile")} title={t("people.editProfile")}>
			<lucide_react_1.Pencil className={(0, utils_1.cn)(size === "small" ? "h-4 w-4" : "h-6 w-6")}/>
		</navigation_1.Link>);
}

"use client";

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DeleteButton;
var react_1 = require("@conform-to/react");
var zod_1 = require("@conform-to/zod");
var lucide_react_1 = require("lucide-react");
var next_intl_1 = require("next-intl");
var react_2 = require("react");
var people_1 = require("#actions/people");
var ErrorMessage_1 = require("#components/ErrorMessage");
var utils_1 = require("#lib/utils");
var people_2 = require("#schema/people");
function DeleteButton(_a) {
    var personId = _a.personId, personName = _a.personName, size = _a.size;
    var t = (0, next_intl_1.useTranslations)();
    var _b = (0, react_2.useActionState)(people_1.deletePersonAction, undefined), lastResult = _b[0], action = _b[1], isPending = _b[2];
    var _c = (0, react_1.useForm)({
        // Sync the result of last submission
        lastResult: lastResult,
        // Reuse the validation logic on the client
        onValidate: (_a) => {
            var formData = _a.formData;
            return (0, zod_1.parseWithZod)(formData, { schema: people_2.deletePersonSchema });
        },
        // To derive all validation attributes
        constraint: (0, zod_1.getZodConstraint)(people_2.deletePersonSchema),
        // Default values
        defaultValue: {
            id: personId,
        },
    }), form = _c[0], fields = _c[1];
    return (<form {...(0, react_1.getFormProps)(form)} action={action}>
			<ErrorMessage_1.default errors={form.errors}/>
			<input {...(0, react_1.getInputProps)(fields.id, { type: "hidden" })}/>
			<button type="submit" disabled={isPending} className="p-2 text-gray-500 hover:text-red-600 transition-colors cursor-pointer disabled:opacity-50" title={t("people.deleteProfile")} aria-label={t("people.deleteProfile")} onClick={(e) => {
            if (!confirm(t("people.confirmDelete", { name: personName }))) {
                e.preventDefault();
            }
        }}>
				<lucide_react_1.Trash2 className={(0, utils_1.cn)(size === "small" ? "h-4 w-4" : "h-6 w-6")}/>
			</button>
		</form>);
}

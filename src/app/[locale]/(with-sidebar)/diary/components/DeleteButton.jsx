"use client";

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DeleteButton;
var react_1 = require("@conform-to/react");
var zod_1 = require("@conform-to/zod");
var lucide_react_1 = require("lucide-react");
var next_intl_1 = require("next-intl");
var react_2 = require("react");
var diary_1 = require("#actions/diary");
var ErrorMessage_1 = require("#components/ErrorMessage");
var diary_2 = require("#schema/diary");
function DeleteButton(_a) {
    var id = _a.id;
    var t = (0, next_intl_1.useTranslations)();
    var _b = (0, react_2.useActionState)(diary_1.deleteDiaryEntryAction, undefined), lastResult = _b[0], action = _b[1], isPending = _b[2];
    var _c = (0, react_1.useForm)({
        // Sync the result of last submission
        lastResult: lastResult,
        // Reuse the validation logic on the client
        onValidate: (_a) => {
            var formData = _a.formData;
            return (0, zod_1.parseWithZod)(formData, { schema: diary_2.deleteDiaryEntrySchema });
        },
        // To derive all validation attributes
        constraint: (0, zod_1.getZodConstraint)(diary_2.deleteDiaryEntrySchema),
        // Default values
        defaultValue: {
            id: id,
        },
    }), form = _c[0], fields = _c[1];
    return (<form {...(0, react_1.getFormProps)(form)} action={action}>
			<ErrorMessage_1.default errors={form.errors}/>
			<input {...(0, react_1.getInputProps)(fields.id, { type: "hidden" })}/>
			<button type="submit" className="p-2 text-gray-500 hover:text-red-600 transition-colors cursor-pointer disabled:opacity-50" aria-label={t("diary.deleteEntry")} title={t("diary.deleteEntry")} disabled={isPending} onClick={(e) => {
            if (!confirm(t("diary.confirmDelete"))) {
                e.preventDefault();
            }
        }}>
				<lucide_react_1.Trash2 className="h-4 w-4"/>
			</button>
		</form>);
}

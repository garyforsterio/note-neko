"use client";

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PersonForm;
var react_1 = require("@conform-to/react");
var zod_1 = require("@conform-to/zod");
var next_intl_1 = require("next-intl");
var react_2 = require("react");
var people_1 = require("#actions/people");
var ErrorMessage_1 = require("#components/ErrorMessage");
var navigation_1 = require("#i18n/navigation");
var people_2 = require("#schema/people");
function PersonForm(_a) {
    var person = _a.person;
    var router = (0, navigation_1.useRouter)();
    var t = (0, next_intl_1.useTranslations)();
    var _b = (0, react_2.useActionState)(person ? people_1.updatePersonAction : people_1.createPersonAction, undefined), lastResult = _b[0], action = _b[1], isPending = _b[2];
    var _c = (0, react_1.useForm)({
        // Sync the result of last submission
        lastResult: lastResult,
        // Reuse the validation logic on the client
        onValidate: (_a) => {
            var formData = _a.formData;
            return (0, zod_1.parseWithZod)(formData, { schema: people_2.personSchema });
        },
        // To derive all validation attributes
        constraint: (0, zod_1.getZodConstraint)(people_2.personSchema),
        // Validate the form on blur event triggered
        shouldValidate: "onBlur",
        shouldRevalidate: "onInput",
        // Default values
        defaultValue: person
            ? {
                id: person.id,
                name: person.name,
                nickname: person.nickname || "",
                birthday: person.birthday
                    ? new Date(person.birthday).toISOString().split("T")[0]
                    : "",
                howWeMet: person.howWeMet || "",
                interests: person.interests.join(", "),
                notes: person.notes || "",
            }
            : {},
    }), form = _c[0], fields = _c[1];
    return (<form className="space-y-6" {...(0, react_1.getFormProps)(form)} action={action}>
			<ErrorMessage_1.default errors={form.errors}/>
			<div>
				<label htmlFor={fields.name.id} className="block text-sm font-medium text-gray-700 mb-1">
					{t("people.name")} *
				</label>
				{person && <input {...(0, react_1.getInputProps)(fields.id, { type: "hidden" })}/>}
				<input {...(0, react_1.getInputProps)(fields.name, { type: "text" })} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"/>
				<ErrorMessage_1.default id={fields.name.id} errors={fields.name.errors}/>
			</div>

			<div>
				<label htmlFor={fields.nickname.id} className="block text-sm font-medium text-gray-700 mb-1">
					{t("people.nickname")}
				</label>
				<input {...(0, react_1.getInputProps)(fields.nickname, { type: "text" })} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"/>
				<ErrorMessage_1.default id={fields.nickname.id} errors={fields.nickname.errors}/>
			</div>

			<div>
				<label htmlFor={fields.birthday.id} className="block text-sm font-medium text-gray-700 mb-1">
					{t("people.birthday")}
				</label>
				<input {...(0, react_1.getInputProps)(fields.birthday, { type: "date" })} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"/>
				<ErrorMessage_1.default id={fields.birthday.id} errors={fields.birthday.errors}/>
			</div>

			<div>
				<label htmlFor={fields.howWeMet.id} className="block text-sm font-medium text-gray-700 mb-1">
					{t("people.howWeMet")}
				</label>
				<textarea {...(0, react_1.getTextareaProps)(fields.howWeMet)} rows={3} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"/>
				<ErrorMessage_1.default id={fields.howWeMet.id} errors={fields.howWeMet.errors}/>
			</div>

			<div>
				<label htmlFor={fields.interests.id} className="block text-sm font-medium text-gray-700 mb-1">
					{t("people.interests")}
				</label>
				<input {...(0, react_1.getInputProps)(fields.interests, { type: "text" })} placeholder={t("people.interestsPlaceholder")} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"/>
				<ErrorMessage_1.default id={fields.interests.id} errors={fields.interests.errors}/>
			</div>

			<div>
				<label htmlFor={fields.notes.id} className="block text-sm font-medium text-gray-700 mb-1">
					{t("people.notes")}
				</label>
				<textarea {...(0, react_1.getTextareaProps)(fields.notes)} rows={4} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"/>
				<ErrorMessage_1.default id={fields.notes.id} errors={fields.notes.errors}/>
			</div>

			<div className="flex justify-end space-x-4">
				<button type="button" onClick={() => router.back()} className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
					{t("people.cancel")}
				</button>
				<button type="submit" disabled={isPending || !form.valid} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
					{isPending
            ? t("people.saving")
            : person
                ? t("people.update")
                : t("people.save")}
				</button>
			</div>
		</form>);
}

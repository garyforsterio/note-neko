"use client";

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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPasswordForm = ResetPasswordForm;
var react_1 = require("@conform-to/react");
var zod_1 = require("@conform-to/zod");
var next_intl_1 = require("next-intl");
var react_2 = require("react");
var auth_1 = require("#actions/auth");
var ErrorMessage_1 = require("#components/ErrorMessage");
var navigation_1 = require("#i18n/navigation");
var auth_2 = require("#schema/auth");
function ResetPasswordForm(_a) {
    var token = _a.token;
    var t = (0, next_intl_1.useTranslations)();
    var _b = (0, react_2.useActionState)(auth_1.resetPassword, null), lastResult = _b[0], formAction = _b[1], isPending = _b[2];
    var _c = (0, react_1.useForm)({
        lastResult: lastResult,
        defaultValue: __assign({ token: token, password: "", confirmPassword: "" }, lastResult === null || lastResult === void 0 ? void 0 : lastResult.initialValue),
        onValidate: (_a) => {
            var formData = _a.formData;
            return (0, zod_1.parseWithZod)(formData, { schema: auth_2.resetPasswordSchema });
        },
        constraint: (0, zod_1.getZodConstraint)(auth_2.resetPasswordSchema),
        shouldValidate: "onBlur",
        shouldRevalidate: "onInput",
    }), form = _c[0], fields = _c[1];
    return (<form className="mt-8 space-y-6" {...(0, react_1.getFormProps)(form)} action={formAction}>
			<ErrorMessage_1.default errors={form.errors}/>
			<div className="rounded-md shadow-sm -space-y-px">
				<div>
					<label htmlFor={fields.password.id} className="sr-only">
						{t("auth.resetPassword.password")}
					</label>
					<input {...(0, react_1.getInputProps)(fields.password, { type: "password" })} autoComplete="new-password" className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder={t("auth.resetPassword.password")}/>
					<ErrorMessage_1.default id={fields.password.id} errors={fields.password.errors}/>
				</div>
				<div>
					<label htmlFor={fields.confirmPassword.id} className="sr-only">
						{t("auth.resetPassword.confirmPassword")}
					</label>
					<input {...(0, react_1.getInputProps)(fields.confirmPassword, { type: "password" })} autoComplete="new-password" className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder={t("auth.resetPassword.confirmPassword")}/>
					<ErrorMessage_1.default id={fields.confirmPassword.id} errors={fields.confirmPassword.errors}/>
				</div>
			</div>

			<div className="flex items-center justify-end">
				<div className="text-sm">
					<navigation_1.Link href="/auth/login" className="font-medium text-indigo-600 hover:text-indigo-500">
						{t("auth.resetPassword.backToLogin")}
					</navigation_1.Link>
				</div>
			</div>

			<div>
				<button type="submit" disabled={isPending || !form.valid} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
					{isPending
            ? t("auth.resetPassword.submitting")
            : t("auth.resetPassword.submit")}
				</button>
			</div>
		</form>);
}

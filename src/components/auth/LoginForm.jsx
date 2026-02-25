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
exports.LoginForm = LoginForm;
var react_1 = require("@conform-to/react");
var zod_1 = require("@conform-to/zod");
var navigation_1 = require("next/navigation");
var next_intl_1 = require("next-intl");
var react_2 = require("react");
var auth_1 = require("#actions/auth");
var ErrorMessage_1 = require("#components/ErrorMessage");
var navigation_2 = require("#i18n/navigation");
var auth_2 = require("#schema/auth");
function LoginForm() {
    var t = (0, next_intl_1.useTranslations)();
    var searchParams = (0, navigation_1.useSearchParams)();
    var _a = (0, react_2.useActionState)(auth_1.login, undefined), lastResult = _a[0], action = _a[1], isPending = _a[2];
    var _b = (0, react_1.useForm)({
        // Sync the result of last submission
        lastResult: lastResult,
        defaultValue: __assign({ email: "", password: "" }, lastResult === null || lastResult === void 0 ? void 0 : lastResult.initialValue),
        // Reuse the validation logic on the client
        onValidate: (_a) => {
            var formData = _a.formData;
            return (0, zod_1.parseWithZod)(formData, { schema: auth_2.loginSchema });
        },
        // To derive all validation attributes
        constraint: (0, zod_1.getZodConstraint)(auth_2.loginSchema),
        // Validate the form on blur event triggered
        shouldValidate: "onBlur",
        shouldRevalidate: "onInput",
    }), form = _b[0], fields = _b[1];
    var registered = searchParams.get("registered") === "true";
    return (<form className="mt-8 space-y-6" {...(0, react_1.getFormProps)(form)} action={action}>
			<ErrorMessage_1.default errors={form.errors}/>
			{registered && (<div className="rounded-md bg-green-50 p-4">
					<div className="text-sm text-green-700">
						{t("auth.login.registered")}
					</div>
				</div>)}
			<div className="rounded-md shadow-sm -space-y-px">
				<div>
					<label htmlFor={fields.email.id} className="sr-only">
						{t("auth.login.email")}
					</label>
					<input {...(0, react_1.getInputProps)(fields.email, { type: "email" })} defaultValue={fields.email.defaultValue} autoComplete="email" className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder={t("auth.login.email")}/>
					<ErrorMessage_1.default id={fields.email.id} errors={fields.email.errors}/>
				</div>
				<div>
					<label htmlFor={fields.password.id} className="sr-only">
						{t("auth.login.password")}
					</label>
					<input {...(0, react_1.getInputProps)(fields.password, { type: "password" })} autoComplete="current-password" className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder={t("auth.login.password")}/>
					<ErrorMessage_1.default id={fields.password.id} errors={fields.password.errors}/>
				</div>
			</div>

			<div className="flex items-center justify-between">
				<div className="text-sm">
					<navigation_2.Link href="/auth/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
						{t("auth.login.forgotPassword")}
					</navigation_2.Link>
				</div>
				<div className="text-sm">
					<navigation_2.Link href="/auth/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
						{t("auth.login.noAccount")}
					</navigation_2.Link>
				</div>
			</div>

			<div>
				<button type="submit" disabled={!form.valid || isPending} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
					{isPending ? t("auth.login.submitting") : t("auth.login.submit")}
				</button>
			</div>
		</form>);
}

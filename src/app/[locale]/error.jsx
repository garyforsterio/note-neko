"use client";

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RootError;
var Sentry = require("@sentry/nextjs");
var next_intl_1 = require("next-intl");
var react_1 = require("react");
function RootError(_a) {
    var error = _a.error, reset = _a.reset;
    var t = (0, next_intl_1.useTranslations)();
    (0, react_1.useEffect)(() => {
        Sentry.captureException(error);
        console.error(error);
    }, [error]);
    return (<div>
			<h2>{t("error.title")}</h2>
			<button type="button" onClick={() => reset()}>
				{t("error.tryAgain")}
			</button>
		</div>);
}

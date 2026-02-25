"use client";

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GlobalError;
var Sentry = require("@sentry/nextjs");
var react_1 = require("react");
function GlobalError(_a) {
    var error = _a.error, reset = _a.reset;
    (0, react_1.useEffect)(() => {
        Sentry.captureException(error);
    }, [error]);
    return (<html lang="en">
			<body>
				<div>
					<h2>Something went wrong!</h2>
					<button type="button" onClick={() => reset()}>
						Try again
					</button>
				</div>
			</body>
		</html>);
}

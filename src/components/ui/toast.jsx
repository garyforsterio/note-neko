"use client";

var __rest = (this && this.__rest) || ((s, e) => {
    var t = {};
    for (var p in s) if (Object.hasOwn(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToastAction = exports.ToastClose = exports.ToastDescription = exports.ToastTitle = exports.Toast = exports.ToastViewport = exports.ToastProvider = void 0;
var ToastPrimitives = require("@radix-ui/react-toast");
var React = require("react");
var utils_1 = require("#lib/utils");
var ToastProvider = ToastPrimitives.Provider;
exports.ToastProvider = ToastProvider;
var ToastViewport = React.forwardRef((_a, ref) => {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<ToastPrimitives.Viewport ref={ref} className={(0, utils_1.cn)("fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]", className)} {...props}/>);
});
exports.ToastViewport = ToastViewport;
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;
var toastVariants = {
    default: "border bg-white text-gray-950",
    destructive: "destructive border-red-600 bg-red-600 text-white",
    success: "border-green-200 bg-green-50 text-green-800",
    info: "border-blue-200 bg-blue-50 text-blue-800",
    loading: "border-blue-200 bg-blue-50 text-blue-800",
};
var Toast = React.forwardRef((_a, ref) => {
    var className = _a.className, _b = _a.variant, variant = _b === void 0 ? "default" : _b, props = __rest(_a, ["className", "variant"]);
    return (<ToastPrimitives.Root ref={ref} className={(0, utils_1.cn)("group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full", toastVariants[variant], className)} {...props}/>);
});
exports.Toast = Toast;
Toast.displayName = ToastPrimitives.Root.displayName;
var ToastAction = React.forwardRef((_a, ref) => {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<ToastPrimitives.Action ref={ref} className={(0, utils_1.cn)("inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-red-700 group-[.destructive]:hover:text-white group-[.destructive]:focus:ring-destructive", className)} {...props}/>);
});
exports.ToastAction = ToastAction;
ToastAction.displayName = ToastPrimitives.Action.displayName;
var ToastClose = React.forwardRef((_a, ref) => {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<ToastPrimitives.Close ref={ref} className={(0, utils_1.cn)("absolute right-2 top-2 rounded-md p-1 text-gray-500 opacity-0 transition-opacity hover:text-gray-900 focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600", className)} toast-close="" {...props}>
		<svg width="12" height="12" viewBox="0 0 15 15" fill="currentColor" role="img" aria-label="Close">
			<path fillRule="evenodd" d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" clipRule="evenodd"/>
		</svg>
	</ToastPrimitives.Close>);
});
exports.ToastClose = ToastClose;
ToastClose.displayName = ToastPrimitives.Close.displayName;
var ToastTitle = React.forwardRef((_a, ref) => {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<ToastPrimitives.Title ref={ref} className={(0, utils_1.cn)("text-sm font-semibold", className)} {...props}/>);
});
exports.ToastTitle = ToastTitle;
ToastTitle.displayName = ToastPrimitives.Title.displayName;
var ToastDescription = React.forwardRef((_a, ref) => {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<ToastPrimitives.Description ref={ref} className={(0, utils_1.cn)("text-sm opacity-90", className)} {...props}/>);
});
exports.ToastDescription = ToastDescription;
ToastDescription.displayName = ToastPrimitives.Description.displayName;

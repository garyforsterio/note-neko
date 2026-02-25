"use client";

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RewriteEditor;
var next_intl_1 = require("next-intl");
var react_1 = require("react");
function RewriteEditor(_a) {
    var content = _a.content, onChange = _a.onChange;
    var t = (0, next_intl_1.useTranslations)();
    var textareaRef = (0, react_1.useRef)(null);
    // Auto-resize textarea
    (0, react_1.useEffect)(() => {
        var textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = "".concat(textarea.scrollHeight, "px");
        }
    });
    return (<div className="space-y-2">
			<textarea ref={textareaRef} value={content} onChange={(e) => onChange(e.target.value)} className="w-full p-6 text-lg text-gray-700 bg-gray-50/50 border-0 rounded-xl focus:outline-none focus:ring-0 focus:bg-white transition-colors placeholder:text-gray-300 resize-none shadow-inner" placeholder={t("diary.contentPlaceholder")}/>
		</div>);
}

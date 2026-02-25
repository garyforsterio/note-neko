
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ActionSheet;
var lucide_react_1 = require("lucide-react");
var react_1 = require("react");
var react_dom_1 = require("react-dom");
function ActionSheet(_a) {
    var isOpen = _a.isOpen, onClose = _a.onClose, title = _a.title, children = _a.children;
    (0, react_1.useEffect)(() => {
        var handleEscape = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);
    if (!isOpen)
        return null;
    return (0, react_dom_1.createPortal)(<>
			{/* Mobile Action Sheet */}
			<div className="md:hidden fixed inset-x-0 bottom-0 z-50">
				<div className="bg-white rounded-t-2xl transform transition-transform duration-300 ease-in-out">
					<div className="p-4 border-b">
						<div className="flex justify-between items-center">
							<h2 className="text-xl font-bold">{title}</h2>
							<button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-700">
								<lucide_react_1.X className="h-6 w-6"/>
							</button>
						</div>
					</div>
					<div className="max-h-[50vh] overflow-y-auto">{children}</div>
				</div>
			</div>

			{/* Desktop Sidebar */}
			<div className="hidden md:block fixed inset-y-0 right-0 w-96 bg-white shadow-lg z-50">
				<div className="h-full flex flex-col">
					<div className="p-6 border-b">
						<div className="flex justify-between items-center">
							<h2 className="text-xl font-bold">{title}</h2>
							<button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-700">
								<lucide_react_1.X className="h-6 w-6"/>
							</button>
						</div>
					</div>
					<div className="flex-1 overflow-y-auto">{children}</div>
				</div>
			</div>
		</>, document.body);
}

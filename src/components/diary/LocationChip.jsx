"use client";

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LocationChip;
var lucide_react_1 = require("lucide-react");
function LocationChip(_a) {
    var location = _a.location, onRemove = _a.onRemove, onEdit = _a.onEdit, _b = _a.className, className = _b === void 0 ? "" : _b;
    return (<span className={"inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium transition-colors border border-emerald-100/50 ".concat(className)}>
			<lucide_react_1.MapPin size={14} className="opacity-70"/>
			<button type="button" onClick={onEdit} className="hover:underline focus:outline-none hover:text-emerald-900">
				{location.name}
			</button>
			{onRemove && (<button type="button" onClick={onRemove} className="ml-1 -mr-1 p-0.5 rounded-full hover:bg-emerald-200/50 text-emerald-600 hover:text-emerald-800 transition-colors focus:outline-none" aria-label={"Remove ".concat(location.name)}>
					<lucide_react_1.X size={14}/>
				</button>)}
		</span>);
}

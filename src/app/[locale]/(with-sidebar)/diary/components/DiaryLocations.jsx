
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiaryLocations = DiaryLocations;
var lucide_react_1 = require("lucide-react");
var maps_1 = require("#lib/utils/maps");
function DiaryLocations(_a) {
    var locations = _a.locations;
    if (locations.length === 0)
        return null;
    return (<div className="flex flex-wrap items-center gap-2">
			{locations.map((location) => (<a key={location.id} href={(0, maps_1.getGoogleMapsUrl)(location.placeId, location.lat, location.lng)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium hover:bg-emerald-100 transition-colors border border-emerald-100/50">
					<lucide_react_1.MapPin size={14} className="opacity-70"/>
					{location.name}
				</a>))}
		</div>);
}

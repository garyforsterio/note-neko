"use client";

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DiaryMap;
var react_google_maps_1 = require("@vis.gl/react-google-maps");
var react_1 = require("react");
function MapContent(_a) {
    var locations = _a.locations;
    var map = (0, react_google_maps_1.useMap)();
    (0, react_1.useEffect)(() => {
        if (!map || locations.length === 0)
            return;
        var bounds = new google.maps.LatLngBounds();
        for (var _i = 0, locations_1 = locations; _i < locations_1.length; _i++) {
            var loc = locations_1[_i];
            bounds.extend({ lat: loc.lat, lng: loc.lng });
        }
        if (locations.length === 1 && locations[0]) {
            map.setCenter({ lat: locations[0].lat, lng: locations[0].lng });
            map.setZoom(15);
        }
        else {
            map.fitBounds(bounds);
        }
    }, [map, locations]);
    return (<>
			{locations.map((loc, index) => (<react_google_maps_1.AdvancedMarker key={loc.placeId || "".concat(loc.lat, "-").concat(loc.lng, "-").concat(index)} position={{ lat: loc.lat, lng: loc.lng }} title={loc.name}>
					<react_google_maps_1.Pin background={"#2563EB"} // Blue-600
         borderColor={"#1D4ED8"} // Blue-700
         glyphColor={"white"}/>
				</react_google_maps_1.AdvancedMarker>))}
		</>);
}
function DiaryMap(_a) {
    var apiKey = _a.apiKey, locations = _a.locations, className = _a.className;
    if (!apiKey)
        return null;
    var defaultCenter = { lat: 0, lng: 0 };
    var center = locations.length > 0 ? locations[0] : defaultCenter;
    var zoom = locations.length > 0 ? 15 : 2;
    return (<div className={className}>
			<react_google_maps_1.APIProvider apiKey={apiKey}>
				<react_google_maps_1.Map defaultCenter={center} defaultZoom={zoom} mapId="DEMO_MAP_ID" // Required for AdvancedMarker
     className="w-full h-full rounded-xl overflow-hidden border border-gray-100 shadow-sm" disableDefaultUI={true} gestureHandling={"cooperative"} reuseMaps={true}>
					<MapContent locations={locations}/>
				</react_google_maps_1.Map>
			</react_google_maps_1.APIProvider>
		</div>);
}

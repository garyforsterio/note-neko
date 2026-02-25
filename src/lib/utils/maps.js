
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGoogleMapsUrl = getGoogleMapsUrl;
function getGoogleMapsUrl(placeId, lat, lng) {
    return "https://www.google.com/maps/search/?api=1&query_place_id=".concat(placeId, "&query=").concat(lat, ",").concat(lng);
}

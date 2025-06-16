export function getGoogleMapsUrl(
	placeId: string,
	lat: number,
	lng: number,
): string {
	return `https://www.google.com/maps/search/?api=1&query_place_id=${placeId}&query=${lat},${lng}`;
}

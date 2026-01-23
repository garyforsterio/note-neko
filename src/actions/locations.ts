"use server";

import { headers } from "next/headers";
import { getLocale } from "next-intl/server";
import { requireAuth } from "#lib/auth";

export interface LocationResult {
	name: string;
	placeId: string;
	lat: number;
	lng: number;
}

export async function searchLocationsAction(
	query: string,
): Promise<LocationResult[]> {
	await requireAuth();

	if (!query.trim()) {
		return [];
	}

	if (!process.env.GOOGLE_MAPS_API_KEY) {
		console.warn(
			"Google Maps API key not configured, skipping location search",
		);
		return [];
	}

	try {
		// Get user location from headers for location bias
		const headersList = await headers();
		const latitude = headersList.get("x-vercel-ip-latitude");
		const longitude = headersList.get("x-vercel-ip-longitude");
		const country = headersList.get("x-vercel-ip-country");

		// Get user's locale for language preference
		const locale = await getLocale();

		// Build Google Places API URL
		let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
			query.trim(),
		)}&fields=place_id,name,geometry&language=${locale}&key=${
			process.env.GOOGLE_MAPS_API_KEY
		}`;

		// Add location bias if available
		if (latitude && longitude) {
			url += `&locationbias=circle:50000@${latitude},${longitude}`;
		} else if (country) {
			url += `&region=${country.toLowerCase()}`;
		}

		console.log("Location search request:", query, {
			latitude,
			longitude,
			country,
			locale,
		});

		const response = await fetch(url);

		if (!response.ok) {
			console.error(
				"Google Places API HTTP error:",
				response.status,
				response.statusText,
			);
			return [];
		}

		const data = (await response.json()) as {
			results: Array<{
				place_id: string;
				name: string;
				geometry: {
					location: {
						lat: number;
						lng: number;
					};
				};
			}>;
			status: string;
		};

		if (data.status !== "OK") {
			console.error("Google Places API error:", data.status);
			return [];
		}

		// Transform results to our interface
		const locations: LocationResult[] = data.results.map((result) => ({
			name: result.name,
			placeId: result.place_id,
			lat: result.geometry.location.lat,
			lng: result.geometry.location.lng,
		}));

		console.log(`Found ${locations.length} locations for query: ${query}`);
		return locations;
	} catch (error) {
		console.error("Error searching locations:", error);
		return [];
	}
}

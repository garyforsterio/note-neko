import { format } from "date-fns";
import {
	Cloud,
	CloudDrizzle,
	CloudFog,
	CloudHail,
	CloudLightning,
	CloudRain,
	CloudSnow,
	CloudSun,
	type LucideIcon,
	Sun,
} from "lucide-react";

export interface WeatherInfo {
	temperatureMin: number | null;
	temperatureMax: number | null;
	weatherCode: number | null;
	sunrise: string | null;
	sunset: string | null;
	moonPhase: number; // 0 to 1
}

/**
 * Calculates the moon phase for a given date.
 * Returns a value between 0 and 1.
 * 0 = New Moon
 * 0.25 = First Quarter
 * 0.5 = Full Moon
 * 0.75 = Last Quarter
 */
function getMoonPhase(date: Date): number {
	let year = date.getFullYear();
	let month = date.getMonth() + 1;
	const day = date.getDate();

	if (month < 3) {
		year--;
		month += 12;
	}

	++month;
	const c = 365.25 * year;
	const e = 30.6 * month;
	let jd = c + e + day - 694039.09; // jd is total days elapsed
	jd /= 29.5305882; // divide by the moon cycle
	const b = Math.floor(jd);
	jd -= b; // subtract integer part to leave fractional part

	return jd < 0 ? jd + 1 : jd; // Ensure positive 0-1
}

export function getWeatherIcon(code: number | null): LucideIcon {
	if (code === null) return CloudSun; // Default
	switch (code) {
		case 0:
			return Sun;
		case 1:
		case 2:
			return CloudSun;
		case 3:
			return Cloud;
		case 45:
		case 48:
			return CloudFog;
		case 51:
		case 53:
		case 55:
			return CloudDrizzle;
		case 56:
		case 57:
			return CloudHail;
		case 61:
		case 63:
		case 65:
			return CloudRain;
		case 66:
		case 67:
			return CloudHail;
		case 71:
		case 73:
		case 75:
			return CloudSnow;
		case 77:
			return CloudSnow;
		case 80:
		case 81:
		case 82:
			return CloudRain;
		case 85:
		case 86:
			return CloudSnow;
		case 95:
		case 96:
		case 99:
			return CloudLightning;
		default:
			return CloudSun;
	}
}

export async function getHistoricWeather(
	lat: number,
	lng: number,
	date: Date,
): Promise<WeatherInfo | null> {
	try {
		const dateStr = format(date, "yyyy-MM-dd");

		// Use Open-Meteo Archive API
		// https://archive-api.open-meteo.com/v1/archive
		const url = new URL("https://archive-api.open-meteo.com/v1/archive");
		url.searchParams.append("latitude", lat.toString());
		url.searchParams.append("longitude", lng.toString());
		url.searchParams.append("start_date", dateStr);
		url.searchParams.append("end_date", dateStr);
		url.searchParams.append(
			"daily",
			"weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset",
		);
		url.searchParams.append("timezone", "auto");

		const response = await fetch(url.toString(), {
			// Cache forever since historic data doesn't change
			cache: "force-cache",
			next: { tags: [`weather-${lat}-${lng}-${dateStr}`] },
		});

		if (!response.ok) {
			console.error(
				`Failed to fetch weather data: ${response.status} ${response.statusText}`,
			);
			return null;
		}

		const data = await response.json();

		if (!data.daily || !data.daily.time || data.daily.time.length === 0) {
			return null;
		}

		const daily = data.daily;

		// Helper to safely get the first element
		const getFirst = <T>(arr: T[] | undefined): T | null => {
			return arr && arr.length > 0 && arr[0] !== undefined ? arr[0] : null;
		};

		const sunriseFull = getFirst(daily.sunrise) as string | null;
		const sunsetFull = getFirst(daily.sunset) as string | null;

		// Extract time from ISO string (YYYY-MM-DDTHH:mm) if present
		const formatTime = (isoString: string | null): string | null => {
			if (!isoString) return null;
			try {
				const parts = isoString.split("T");
				return parts[1] ?? null;
			} catch (_e) {
				return null;
			}
		};

		return {
			temperatureMax: getFirst(daily.temperature_2m_max),
			temperatureMin: getFirst(daily.temperature_2m_min),
			weatherCode: getFirst(daily.weather_code),
			sunrise: formatTime(sunriseFull),
			sunset: formatTime(sunsetFull),
			moonPhase: getMoonPhase(date),
		};
	} catch (error) {
		console.error("Error fetching weather:", error);
		return null;
	}
}

"use client";

import { Moon, Sunrise } from "lucide-react";
import { getWeatherIcon, type WeatherInfo } from "#lib/utils/weather";

interface WeatherWidgetProps {
	weather: WeatherInfo | null | undefined;
	showLabels?: boolean;
}

export function WeatherWidget({
	weather,
	showLabels = true,
}: WeatherWidgetProps) {
	const WeatherIcon = getWeatherIcon(weather?.weatherCode ?? null);

	return (
		<div className="flex justify-around items-center py-4 md:py-0 select-none w-full md:w-auto text-gray-400 md:gap-6">
			{/* Weather */}
			<div className="flex flex-col items-center gap-1">
				<div className="flex flex-col items-center gap-0.5 text-gray-500">
					<WeatherIcon size={18} />
					<span className="font-semibold text-sm md:text-lg whitespace-nowrap">
						{weather?.temperatureMax && weather?.temperatureMin
							? `${weather.temperatureMin}°C / ${weather.temperatureMax}°C`
							: "--°C"}
					</span>
				</div>
				{showLabels && (
					<span className="text-[10px] uppercase tracking-wider font-medium text-gray-400 hidden md:block">
						Weather
					</span>
				)}
			</div>
			<div className="hidden md:block w-px bg-gray-200 h-10 self-center" />
			{/* Sunrise/Sunset */}
			<div className="flex flex-col items-center gap-1">
				<div className="flex flex-col items-center gap-0.5 text-gray-500">
					<Sunrise size={18} />
					<span className="font-semibold text-sm md:text-lg whitespace-nowrap">
						{weather?.sunrise && weather?.sunset
							? `${weather.sunrise} - ${weather.sunset}`
							: "--:--"}
					</span>
				</div>
				{showLabels && (
					<span className="text-[10px] uppercase tracking-wider font-medium text-gray-400 hidden md:block">
						Sun
					</span>
				)}
			</div>
			<div className="hidden md:block w-px bg-gray-200 h-10 self-center" />
			{/* Moon Phase */}
			<div className="flex flex-col items-center gap-1">
				<div className="flex flex-col items-center gap-0.5 text-gray-500">
					<Moon size={18} />
					<span className="font-semibold text-sm md:text-lg whitespace-nowrap">
						{weather ? `${Math.round(weather.moonPhase * 100)}%` : "--%"}
					</span>
				</div>
				{showLabels && (
					<span className="text-[10px] uppercase tracking-wider font-medium text-gray-400 hidden md:block">
						Moon
					</span>
				)}
			</div>
		</div>
	);
}

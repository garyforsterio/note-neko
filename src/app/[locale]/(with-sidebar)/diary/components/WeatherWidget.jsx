"use client";

Object.defineProperty(exports, "__esModule", { value: true });
exports.WeatherWidget = WeatherWidget;
var lucide_react_1 = require("lucide-react");
var next_intl_1 = require("next-intl");
var weather_1 = require("#lib/utils/weather");
function WeatherWidget(_a) {
    var _b;
    var weather = _a.weather, _c = _a.showLabels, showLabels = _c === void 0 ? true : _c;
    var t = (0, next_intl_1.useTranslations)("diary");
    var WeatherIcon = (0, weather_1.getWeatherIcon)((_b = weather === null || weather === void 0 ? void 0 : weather.weatherCode) !== null && _b !== void 0 ? _b : null);
    return (<div className="flex justify-around items-center py-4 md:py-0 select-none w-full md:w-auto text-gray-400 md:gap-6">
			{/* Weather */}
			<div className="flex flex-col items-center gap-1">
				<div className="flex flex-col items-center gap-0.5 text-gray-500">
					<WeatherIcon size={18}/>
					<span className="font-semibold text-sm md:text-lg whitespace-nowrap">
						{(weather === null || weather === void 0 ? void 0 : weather.temperatureMax) && (weather === null || weather === void 0 ? void 0 : weather.temperatureMin)
            ? "".concat(weather.temperatureMin, "\u00B0C / ").concat(weather.temperatureMax, "\u00B0C")
            : "--°C"}
					</span>
				</div>
				{showLabels && (<span className="text-[10px] uppercase tracking-wider font-medium text-gray-400 hidden md:block">
						{t("weatherLabel")}
					</span>)}
			</div>
			<div className="hidden md:block w-px bg-gray-200 h-10 self-center"/>
			{/* Sunrise/Sunset */}
			<div className="flex flex-col items-center gap-1">
				<div className="flex flex-col items-center gap-0.5 text-gray-500">
					<lucide_react_1.Sunrise size={18}/>
					<span className="font-semibold text-sm md:text-lg whitespace-nowrap">
						{(weather === null || weather === void 0 ? void 0 : weather.sunrise) && (weather === null || weather === void 0 ? void 0 : weather.sunset)
            ? "".concat(weather.sunrise, " - ").concat(weather.sunset)
            : "--:--"}
					</span>
				</div>
				{showLabels && (<span className="text-[10px] uppercase tracking-wider font-medium text-gray-400 hidden md:block">
						{t("sunLabel")}
					</span>)}
			</div>
			<div className="hidden md:block w-px bg-gray-200 h-10 self-center"/>
			{/* Moon Phase */}
			<div className="flex flex-col items-center gap-1">
				<div className="flex flex-col items-center gap-0.5 text-gray-500">
					<lucide_react_1.Moon size={18}/>
					<span className="font-semibold text-sm md:text-lg whitespace-nowrap">
						{weather ? "".concat(Math.round(weather.moonPhase * 100), "%") : "--%"}
					</span>
				</div>
				{showLabels && (<span className="text-[10px] uppercase tracking-wider font-medium text-gray-400 hidden md:block">
						{t("moonLabel")}
					</span>)}
			</div>
		</div>);
}

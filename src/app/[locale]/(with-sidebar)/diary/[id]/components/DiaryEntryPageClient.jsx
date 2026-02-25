"use client";

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DiaryEntryPageClient;
var date_fns_1 = require("date-fns");
var lucide_react_1 = require("lucide-react");
var next_intl_1 = require("next-intl");
var react_1 = require("react");
var DiaryContent_1 = require("#components/DiaryContent");
var navigation_1 = require("#i18n/navigation");
var DeleteButton_1 = require("../../components/DeleteButton");
var DiaryEditForm_1 = require("../../components/DiaryEditForm");
var DiaryMap_1 = require("../../components/DiaryMap");
var DiaryMentions_1 = require("../../components/DiaryMentions");
var ShareButton_1 = require("../../components/ShareButton");
var WeatherWidget_1 = require("../../components/WeatherWidget");
function DiaryEntryPageClient(_a) {
    var _b;
    var entry = _a.entry, allPeople = _a.allPeople, googleMapsApiKey = _a.googleMapsApiKey, nextDay = _a.nextDay, weather = _a.weather, mode = _a.mode;
    var t = (0, next_intl_1.useTranslations)();
    var locale = (0, next_intl_1.useLocale)();
    var router = (0, navigation_1.useRouter)();
    var _c = (0, react_1.useState)(mode === "edit"), isEditing = _c[0], setIsEditing = _c[1];
    var date = new Date(entry.date);
    // Use optional chaining for safe access
    var locationDisplayString = entry.locations.length > 0 ? (_b = entry.locations[0]) === null || _b === void 0 ? void 0 : _b.name : null;
    if (isEditing) {
        return (<DiaryEditForm_1.default entry={entry} allPeople={allPeople} googleMapsApiKey={googleMapsApiKey} onCancel={() => {
                setIsEditing(false);
                router.refresh(); // Refresh data in case changes were saved
            }}/>);
    }
    return (<>
			{nextDay && (<div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500 mb-6 max-w-4xl mx-auto">
					<div>
						<h3 className="text-lg font-semibold text-blue-900 mb-1">
							{t("diary.catchUpTitle")}
						</h3>
						<p className="text-blue-700 text-sm">
							{t("diary.catchUpDescription", {
                date: (0, date_fns_1.format)(new Date(nextDay), "MMMM d"),
            })}
						</p>
					</div>
					<navigation_1.Link href={"/diary/new?date=".concat(nextDay)} className="px-6 py-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-sm font-medium flex items-center gap-2 whitespace-nowrap">
						{t("diary.nextDayEntry")}
						<lucide_react_1.ArrowRight size={16}/>
					</navigation_1.Link>
				</div>)}
			<div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow max-w-4xl mx-auto">
				{/* Map Section - Media Header Style */}
				{entry.locations.length > 0 && googleMapsApiKey && (<div className="h-[250px] w-full relative group rounded-t-2xl overflow-hidden">
						<DiaryMap_1.default apiKey={googleMapsApiKey} locations={entry.locations} className="w-full h-full"/>
						{/* Overlay gradient for better text checking if needed, or just decoration */}
						<div className="absolute inset-0 bg-gradient-to-b from-black/5 to-transparent pointer-events-none"/>

						{/* Overlay to indicate this is the location context */}
						<div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm text-xs font-medium text-gray-600 border border-gray-100/50 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
							<lucide_react_1.MapPin size={12} className="text-blue-500"/>
							<span>{t("diary.entryLocation")}</span>
						</div>
					</div>)}

				<div className="p-5 md:p-8">
					{/* Header Section */}
					<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 border-b pb-6 border-gray-100">
						<div>
							<h2 className="text-4xl font-bold text-gray-900 tracking-tight">
								{(0, date_fns_1.format)(date, "EEEE")}
							</h2>
							<div className="flex items-center gap-3 mt-2 relative">
								<span className="text-xl text-gray-500 font-medium">
									{(0, date_fns_1.format)(date, "d MMMM yyyy")}
								</span>
								<div className="p-2 bg-gray-50 rounded-full text-gray-400">
									<lucide_react_1.Calendar size={20}/>
								</div>
							</div>

							<div className="flex items-center gap-2 mt-3 text-sm h-6">
								<lucide_react_1.MapPin size={14} className={entry.locations.length > 0
            ? "text-blue-500"
            : "text-gray-400"}/>
								{locationDisplayString ? (<div className="flex items-center gap-2">
										<span className="text-gray-600 font-medium">
											{locationDisplayString}
											{entry.locations.length > 1 &&
                " +".concat(entry.locations.length - 1, " more")}
										</span>
									</div>) : (<span className="text-gray-600 font-medium">
										{t("diary.unknownLocation")}
									</span>)}
							</div>
						</div>

						<WeatherWidget_1.WeatherWidget weather={weather}/>
					</div>

					{/* Content Section */}
					<div className="prose max-w-none text-lg text-gray-700 leading-relaxed mb-8">
						<DiaryContent_1.DiaryContent content={entry.content} people={entry.mentions.map((m) => m.person)} locations={entry.locations} locale={locale}/>
					</div>

					{/* Footer/Actions Section */}
					<div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4 border-t pt-6 border-gray-100">
						<div className="flex flex-col gap-3 w-full sm:w-auto">
							<DiaryMentions_1.DiaryMentions mentions={entry.mentions} conversations={entry.conversations}/>
						</div>

						<div className="flex items-center gap-1 shrink-0">
							<button type="button" onClick={() => setIsEditing(true)} className="p-2 text-gray-500 hover:text-blue-600 transition-colors cursor-pointer" title={t("common.edit")}>
								<lucide_react_1.Pencil className="h-4 w-4"/>
							</button>
							<ShareButton_1.default entry={entry} locale={locale}/>
							<DeleteButton_1.default id={entry.id}/>
						</div>
					</div>
				</div>
			</div>
		</>);
}


var __awaiter = (this && this.__awaiter) || ((thisArg, _arguments, P, generator) => {
    function adopt(value) { return value instanceof P ? value : new P((resolve) => { resolve(value); }); }
    return new (P || (P = Promise))((resolve, reject) => {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
});
var __generator = (this && this.__generator) || ((thisArg, body) => {
    var _ = { label: 0, sent: () => { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return (v) => step([n, v]); }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Home;
var image_1 = require("next/image");
var server_1 = require("next-intl/server");
var navigation_1 = require("#i18n/navigation");
var emma_svg_1 = require("./emma.svg");
var github_svg_1 = require("./github.svg");
var hero_image_png_1 = require("./hero-image.png");
var michael_svg_1 = require("./michael.svg");
var sarah_svg_1 = require("./sarah.svg");
function Home() {
    return __awaiter(this, void 0, void 0, function () {
        var t;
        return __generator(this, (_a) => {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, server_1.getTranslations)("home")];
                case 1:
                    t = _a.sent();
                    return [2 /*return*/, (<div className="min-h-screen">
			{/* Hero Section with Parallax */}
			<div className="relative h-[60vh] overflow-hidden">
				<div className="absolute inset-0">
					<div className="fixed top-0 left-0 w-full h-[60vh] -z-10">
						<image_1.default src={hero_image_png_1.default} alt={t("hero.heroImageAlt")} fill className="object-cover" priority placeholder="blur"/>
					</div>
					<div className="absolute inset-0 bg-black/40"/>
				</div>
				{/* GitHub Link */}
				<a href="https://github.com/garyforsterio/life-tracker" target="_blank" rel="noopener noreferrer" className="absolute top-4 right-4 z-20 text-white hover:text-gray-300 transition-colors">
					<image_1.default src={github_svg_1.default} alt={t("footer.githubAlt")} className="h-8 w-8 text-white"/>
				</a>
				<div className="relative h-full flex items-center justify-center text-center px-4 z-10">
					<div className="max-w-3xl">
						<h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
							{t("hero.title")}
						</h1>
						<p className="text-xl text-gray-100 mb-8">{t("hero.subtitle")}</p>
						<navigation_1.Link href="/auth/signup" className="inline-block bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
							{t("hero.cta")}
						</navigation_1.Link>
					</div>
				</div>
			</div>

			{/* Features Section */}
			<div className="max-w-7xl mx-auto px-4 py-16 bg-gray-50">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					<div className="bg-white p-8 rounded-lg shadow-sm">
						<h3 className="text-2xl font-semibold mb-4">
							{t("features.dailyDiary.title")}
						</h3>
						<p className="text-gray-600">
							{t("features.dailyDiary.description")}
						</p>
					</div>
					<div className="bg-white p-8 rounded-lg shadow-sm">
						<h3 className="text-2xl font-semibold mb-4">
							{t("features.peopleProfiles.title")}
						</h3>
						<p className="text-gray-600">
							{t("features.peopleProfiles.description")}
						</p>
					</div>
					<div className="bg-white p-8 rounded-lg shadow-sm">
						<h3 className="text-2xl font-semibold mb-4">
							{t("features.locationHistory.title")}
						</h3>
						<p className="text-gray-600">
							{t("features.locationHistory.description")}
						</p>
					</div>
				</div>
			</div>

			{/* Testimonials Section */}
			<div className="bg-gray-100 py-16">
				<div className="max-w-7xl mx-auto px-4">
					<h2 className="text-3xl font-bold text-center mb-12">
						{t("testimonials.title")}
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<div className="bg-white p-8 rounded-lg shadow-sm transform hover:scale-105 transition-transform duration-300">
							<div className="flex items-center mb-6">
								<div className="relative w-16 h-16 rounded-full overflow-hidden mr-4 flex-shrink-0">
									<image_1.default src={sarah_svg_1.default} alt={t("testimonials.sarah.avatarAlt")} fill className="object-cover object-center"/>
								</div>
								<div>
									<p className="font-semibold">
										{t("testimonials.sarah.name")}
									</p>
									<p className="text-gray-500 text-sm">
										{t("testimonials.sarah.title")}
									</p>
								</div>
							</div>
							<p className="text-gray-600 italic text-lg">
								{t("testimonials.sarah.quote")}
							</p>
						</div>
						<div className="bg-white p-8 rounded-lg shadow-sm transform hover:scale-105 transition-transform duration-300">
							<div className="flex items-center mb-6">
								<div className="relative w-16 h-16 rounded-full overflow-hidden mr-4 flex-shrink-0">
									<image_1.default src={michael_svg_1.default} alt={t("testimonials.michael.avatarAlt")} fill className="object-cover object-center"/>
								</div>
								<div>
									<p className="font-semibold">
										{t("testimonials.michael.name")}
									</p>
									<p className="text-gray-500 text-sm">
										{t("testimonials.michael.title")}
									</p>
								</div>
							</div>
							<p className="text-gray-600 italic text-lg">
								{t("testimonials.michael.quote")}
							</p>
						</div>
						<div className="bg-white p-8 rounded-lg shadow-sm transform hover:scale-105 transition-transform duration-300">
							<div className="flex items-center mb-6">
								<div className="relative w-16 h-16 rounded-full overflow-hidden mr-4 flex-shrink-0">
									<image_1.default src={emma_svg_1.default} alt={t("testimonials.emma.avatarAlt")} fill className="object-cover object-center"/>
								</div>
								<div>
									<p className="font-semibold">{t("testimonials.emma.name")}</p>
									<p className="text-gray-500 text-sm">
										{t("testimonials.emma.title")}
									</p>
								</div>
							</div>
							<p className="text-gray-600 italic text-lg">
								{t("testimonials.emma.quote")}
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Footer */}
			<footer className="bg-gray-50 border-t border-gray-100 py-6">
				<div className="max-w-7xl mx-auto px-4 flex justify-end text-gray-500 text-sm">
					<p className="pr-4">
						{t("footer.createdBy")}{" "}
						<a href="https://garyforster.io" className="text-gray-600 hover:text-gray-900 transition-colors">
							Gary Forster
						</a>
					</p>
				</div>
			</footer>
		</div>)];
            }
        });
    });
}

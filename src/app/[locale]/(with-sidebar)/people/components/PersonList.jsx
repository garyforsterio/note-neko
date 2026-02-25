"use client";

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PersonList;
var next_intl_1 = require("next-intl");
var PersonEntry_1 = require("./PersonEntry");
function PersonList(_a) {
    var people = _a.people;
    var t = (0, next_intl_1.useTranslations)();
    // Group people by first letter
    var groupedPeople = people.reduce((groups, person) => {
        var letter = (person.name.charAt(0) || "?").toUpperCase();
        if (!groups[letter]) {
            groups[letter] = [];
        }
        groups[letter].push(person);
        return groups;
    }, {});
    var sortedLetters = Object.keys(groupedPeople).sort();
    // Scroll to letter function
    var scrollToLetter = (letter) => {
        var element = document.getElementById("group-".concat(letter));
        if (element) {
            var yOffset = -100; // Offset for sticky headers or top spacing
            var y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: "smooth" });
        }
    };
    if (people.length === 0) {
        return (<div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center text-gray-500">
				{t("people.noPeople")}
			</div>);
    }
    return (<div className="relative flex items-start gap-8">
			{/* Main List */}
			<div className="flex-1 space-y-12">
				{sortedLetters.map((letter) => {
            var _a;
            return (<div key={letter} id={"group-".concat(letter)} className="scroll-mt-24">
						<h2 className="text-2xl font-bold text-gray-400 mb-6 pl-2 border-l-4 border-gray-200">
							{letter}
						</h2>
						<div className="space-y-6">
							{(_a = groupedPeople[letter]) === null || _a === void 0 ? void 0 : _a.map((person) => (<PersonEntry_1.default key={person.id} person={person}/>))}
						</div>
					</div>);
        })}
			</div>

			{/* Side Navigation (Sticky) */}
			<div className="hidden md:flex sticky top-24 flex-col gap-1 p-2 bg-white rounded-full shadow-sm border border-gray-100 max-h-[80vh] overflow-y-auto w-12 items-center shrink-0">
				{sortedLetters.map((letter) => (<button key={letter} onClick={() => scrollToLetter(letter)} className="w-8 h-8 flex items-center justify-center text-xs font-semibold text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors" type="button">
						{letter}
					</button>))}
			</div>
		</div>);
}

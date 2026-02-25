
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMetadata = generateMetadata;
exports.default = PersonPage;
var date_fns_1 = require("date-fns");
var lucide_react_1 = require("lucide-react");
var navigation_1 = require("next/navigation");
var react_1 = require("react");
var suggestions_1 = require("#actions/suggestions");
var PersonInterests_1 = require("#components/PersonInterests");
var PersonNetworkGraph_1 = require("#components/PersonNetworkGraph");
var PersonSummary_1 = require("#components/PersonSummary");
var PersonSummarySkeleton_1 = require("#components/PersonSummarySkeleton");
var SuggestionsList_1 = require("#components/SuggestionsList");
var dal_1 = require("#lib/dal");
var server_1 = require("#lib/i18n/server");
var DiaryEntry_1 = require("../../diary/components/DiaryEntry");
var DeleteButton_1 = require("../components/DeleteButton");
var EditButton_1 = require("../components/EditButton");
function generateMetadata(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var id, person;
        var params = _b.params;
        return __generator(this, (_c) => {
            switch (_c.label) {
                case 0: return [4 /*yield*/, params];
                case 1:
                    id = (_c.sent()).id;
                    return [4 /*yield*/, (0, dal_1.getPerson)(id)];
                case 2:
                    person = _c.sent();
                    if (!person) {
                        return [2 /*return*/, {}];
                    }
                    return [2 /*return*/, {
                            title: person.name,
                        }];
            }
        });
    });
}
function SuggestionsSection(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var suggestions;
        var personId = _b.personId;
        return __generator(this, (_c) => {
            switch (_c.label) {
                case 0: 
                // Generate suggestions (and persist) on load
                return [4 /*yield*/, (0, suggestions_1.generatePersonSuggestions)(personId)];
                case 1:
                    // Generate suggestions (and persist) on load
                    _c.sent();
                    return [4 /*yield*/, (0, suggestions_1.getSuggestions)(personId)];
                case 2:
                    suggestions = _c.sent();
                    return [2 /*return*/, <SuggestionsList_1.SuggestionsList suggestions={suggestions}/>];
            }
        });
    });
}
function PersonPage(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var t, person, _c;
        var params = _b.params;
        return __generator(this, (_d) => {
            switch (_d.label) {
                case 0: return [4 /*yield*/, (0, server_1.getTranslations)()];
                case 1:
                    t = _d.sent();
                    _c = dal_1.getPerson;
                    return [4 /*yield*/, params];
                case 2: return [4 /*yield*/, _c.apply(void 0, [(_d.sent()).id])];
                case 3:
                    person = _d.sent();
                    if (!person) {
                        (0, navigation_1.notFound)();
                    }
                    return [2 /*return*/, (<div className="container mx-auto px-4 py-8 space-y-8">
			{/* Top Grid: Profile Card & Suggestions */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
				{/* Main Profile Card - Spans 2 cols */}
				<div className="md:col-span-2 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
					{/* Header */}
					<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 border-b pb-6 border-gray-100">
						<div>
							<h1 className="text-4xl font-bold text-gray-900 tracking-tight">
								{person.name}
							</h1>
							{person.namePhonetic && (<p className="text-lg text-gray-500 font-medium">
									/{person.namePhonetic}/
								</p>)}
							<div className="flex items-center gap-3 mt-2">
								<span className="text-sm text-gray-400 font-medium">
									{t("people.addedOn", {
                                date: (0, date_fns_1.format)(person.createdAt, "MMM d, yyyy"),
                            })}
								</span>
							</div>
						</div>

						<div className="flex items-center gap-2">
							<EditButton_1.default personId={person.id}/>
							<DeleteButton_1.default personId={person.id} personName={person.name}/>
						</div>
					</div>

					{/* Basic Info Grid */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
						{person.birthday && (<div className="flex items-center gap-3 text-gray-700">
								<div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
									<lucide_react_1.Cake size={20}/>
								</div>
								<div>
									<p className="text-xs text-gray-400 uppercase font-semibold">
										Birthday
									</p>
									<p className="font-medium">
										{(0, date_fns_1.format)(person.birthday, "MMMM d, yyyy")}
									</p>
								</div>
							</div>)}
						{person.nationality && (<div className="flex items-center gap-3 text-gray-700">
								<div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
									<lucide_react_1.Globe size={20}/>
								</div>
								<div>
									<p className="text-xs text-gray-400 uppercase font-semibold">
										Nationality
									</p>
									<p className="font-medium">{person.nationality}</p>
								</div>
							</div>)}
						{person.occupation && (<div className="flex items-center gap-3 text-gray-700">
								<div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
									<lucide_react_1.Briefcase size={20}/>
								</div>
								<div>
									<p className="text-xs text-gray-400 uppercase font-semibold">
										Occupation
									</p>
									<p className="font-medium">{person.occupation}</p>
								</div>
							</div>)}
						{person.howWeMet && (<div className="flex items-center gap-3 text-gray-700">
								<div className="p-2 bg-pink-50 text-pink-600 rounded-lg">
									<lucide_react_1.Smile size={20}/>
								</div>
								<div>
									<p className="text-xs text-gray-400 uppercase font-semibold">
										{t("people.howWeMet")}
									</p>
									<p className="font-medium">{person.howWeMet}</p>
								</div>
							</div>)}
					</div>

					{/* Contact Info (if available, simplified display) */}
					<div className="mb-8 pt-6 border-t border-gray-100">
						{(person.email || person.phoneNumber || person.website) && (<>
								<h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
									{t("people.contactDetails")}
								</h3>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									{person.email && (<div className="flex items-center gap-2 text-gray-600">
											<lucide_react_1.Mail size={16}/>
											<span>{person.email}</span>
										</div>)}
									{person.phoneNumber && (<div className="flex items-center gap-2 text-gray-600">
											<lucide_react_1.Phone size={16}/>
											<span>{person.phoneNumber}</span>
										</div>)}
									{person.website && (<div className="flex items-center gap-2 text-gray-600">
											<lucide_react_1.Globe size={16}/>
											<a href={person.website} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-600 truncate">
												{person.website}
											</a>
										</div>)}
								</div>
							</>)}
					</div>

					{/* Interests */}
					<div className="mt-auto">
						<PersonInterests_1.PersonInterests currentInterests={person.interests}/>
					</div>
				</div>

				{/* Sidebar Column: Suggestions & Relationships */}
				<div className="space-y-6">
					<react_1.Suspense fallback={<div className="h-32 bg-gray-50 rounded-xl animate-pulse"/>}>
						<SuggestionsSection personId={person.id}/>
					</react_1.Suspense>

					{/* Relationships Card */}
					<div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
						<div className="flex items-center gap-2 mb-4 text-gray-800">
							<lucide_react_1.Heart size={20} className="text-red-500"/>
							<h3 className="font-semibold text-lg">
								{t("people.relationships")}
							</h3>
						</div>

						<div className="space-y-3">
							{__spreadArray(__spreadArray([], person.relationshipsAsFrom, true), person.relationshipsAsTo, true).length > 0 ? (__spreadArray(__spreadArray([], person.relationshipsAsFrom, true), person.relationshipsAsTo, true).map((rel) => {
                                var otherPerson = "toPerson" in rel ? rel.toPerson : rel.fromPerson;
                                return (<div key={rel.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
											<div>
												<p className="font-medium text-gray-900">
													{otherPerson === null || otherPerson === void 0 ? void 0 : otherPerson.name}
												</p>
												<p className="text-xs text-gray-500">{rel.type}</p>
											</div>
										</div>);
                            })) : (<p className="text-gray-400 italic text-sm">
									{t("people.noRelationships")}
								</p>)}
						</div>
					</div>
				</div>
			</div>

			{/* Legacy Notes & AI Summary */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				{person.notes && (<div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
						<div className="flex items-center gap-2 mb-4">
							<lucide_react_1.StickyNote size={20} className="text-gray-400"/>
							<h2 className="text-lg font-semibold text-gray-900">
								{t("people.notes")}
							</h2>
						</div>
						<div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
							{person.notes}
						</div>
					</div>)}

				<div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
					<react_1.Suspense fallback={<PersonSummarySkeleton_1.PersonSummarySkeleton />}>
						<PersonSummary_1.PersonSummary personId={person.id}/>
					</react_1.Suspense>
				</div>
			</div>

			{/* Network Graph */}
			<PersonNetworkGraph_1.PersonNetworkGraph currentPerson={{ id: person.id, name: person.name }} mentions={person.mentions}/>

			{/* Mentions & Conversations */}
			{person.mentions.length > 0 && (<div className="space-y-6">
					<h2 className="text-2xl font-bold text-gray-800 pl-2 border-l-4 border-blue-500">
						{t("people.mentionedIn")}
					</h2>
					<div className="space-y-6">
						{person.mentions.map((mention) => {
                                    // Find relevant conversations for this entry
                                    var entryConversations = person.conversations
                                        ? person.conversations.filter((c) => c.diaryEntryId === mention.diaryEntry.id)
                                        : [];
                                    return (<div key={mention.diaryEntry.id} className="space-y-4">
									<DiaryEntry_1.DiaryEntry entry={mention.diaryEntry}/>
									{/* Render grouped conversations if any */}
									{entryConversations.length > 0 && (<div className="ml-8 pl-4 border-l-2 border-gray-200 space-y-3">
											<h4 className="text-sm font-semibold text-gray-500 uppercase">
												{t("people.entryConversations")}
											</h4>
											{entryConversations.map((c) => (<div key={c.id} className="bg-blue-50 p-4 rounded-lg text-gray-700 italic">
													"{c.content}"
												</div>))}
										</div>)}
								</div>);
                                })}
					</div>
				</div>)}
		</div>)];
            }
        });
    });
}

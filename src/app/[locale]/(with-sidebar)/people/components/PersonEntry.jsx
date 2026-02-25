"use client";

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PersonEntry;
var date_fns_1 = require("date-fns");
var lucide_react_1 = require("lucide-react");
var next_intl_1 = require("next-intl");
var navigation_1 = require("#i18n/navigation");
var DeleteButton_1 = require("./DeleteButton");
var EditButton_1 = require("./EditButton");
function PersonEntry(_a) {
    var person = _a.person;
    var t = (0, next_intl_1.useTranslations)();
    var getInitials = (name) => name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    return (<div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
			{/* Header */}
			<div className="flex justify-between items-start mb-6 pb-6 border-b border-gray-100">
				<div className="flex items-center gap-6">
					{/* Avatar Placeholder */}
					<div className="h-16 w-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-2xl font-semibold shrink-0 select-none">
						{getInitials(person.name)}
					</div>
					<div>
						<navigation_1.Link href={"/people/".concat(person.id)} className="group">
							<h2 className="text-3xl font-bold text-gray-900 tracking-tight group-hover:text-blue-600 transition-colors">
								{person.name}
							</h2>
						</navigation_1.Link>
						<div className="flex flex-wrap items-center gap-4 mt-2 text-gray-500">
							{person.nickname && (<span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium">
									{person.nickname}
								</span>)}
							{person.birthday && (<div className="flex items-center gap-2 text-sm">
									<lucide_react_1.Calendar size={16}/>
									{(0, date_fns_1.format)(new Date(person.birthday), "MMMM d")}
								</div>)}
						</div>
					</div>
				</div>
			</div>

			{/* Content */}
			<div className="prose max-w-none text-lg text-gray-700 leading-relaxed mb-6 space-y-4">
				{person.howWeMet && (<div>
						<h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
							{t("people.howWeMet")}
						</h3>
						<p className="text-base">{person.howWeMet}</p>
					</div>)}
				{person.notes && (<div>
						<h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
							{t("people.notes")}
						</h3>
						<p className="text-base">{person.notes}</p>
					</div>)}
			</div>

			{/* Footer */}
			<div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4 border-t pt-6 border-gray-100">
				<div className="flex flex-wrap gap-2">
					{person.interests.map((interest) => (<span key={interest} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
							{interest}
						</span>))}
				</div>

				<div className="flex items-center gap-2 shrink-0">
					<EditButton_1.default personId={person.id}/>
					<DeleteButton_1.default personId={person.id} personName={person.name}/>
				</div>
			</div>
		</div>);
}

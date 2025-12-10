import { Plus } from "lucide-react";
import { Link } from "#i18n/navigation";
import { getTranslations } from "#lib/i18n/server";
import PeopleSearch from "./PeopleSearch";

export default async function PageHeader() {
	const t = await getTranslations();

	return (
		<div className="flex flex-col gap-6 mb-10">
			{/* Top Row: Title & Primary Actions */}
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
				<div>
					<h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
						{t("people.title")}
					</h1>
					<p className="text-gray-500 mt-1">
						{t("home.features.people.description", {
							defaultValue: "Manage your relationships and memories.",
						})}
					</p>
				</div>

				<div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
					<PeopleSearch />
					<Link
						href="/people/new"
						className="w-full sm:w-auto flex justify-center bg-gray-900 text-white px-6 py-2.5 rounded-full hover:bg-black transition-all shadow-lg hover:shadow-xl items-center gap-2 font-medium group whitespace-nowrap"
					>
						<Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
						{t("people.addPerson")}
					</Link>
				</div>
			</div>

			{/* Divider */}
			<div className="border-b border-gray-100 pb-2" />
		</div>
	);
}

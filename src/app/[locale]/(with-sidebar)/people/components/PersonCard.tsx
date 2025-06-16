import type { Person } from "@prisma/client";
import { format } from "date-fns";
import { Link } from "#i18n/navigation";
import { getTranslations } from "#lib/i18n/server";
import DeleteButton from "./DeleteButton";
import EditButton from "./EditButton";
import PersonDetails from "./PersonDetails";
import PersonInterests from "./PersonInterests";

interface PersonCardProps {
	person: Person;
}

export default async function PersonCard({ person }: PersonCardProps) {
	const t = await getTranslations();

	return (
		<div className="bg-white p-6 rounded-lg shadow-md">
			<div className="flex justify-between items-start mb-2">
				<Link
					href={`/people/${person.id}`}
					className="text-xl font-semibold hover:text-blue-600"
				>
					{person.name}
				</Link>
				<div className="flex gap-2">
					<DeleteButton
						personId={person.id}
						personName={person.name}
						size="small"
					/>
					<EditButton personId={person.id} size="small" />
				</div>
			</div>

			<PersonDetails person={person} />
			<PersonInterests interests={person.interests} />

			{person.notes && (
				<p className="text-gray-600 mb-2">
					{t("people.notes")}: {person.notes}
				</p>
			)}

			<div className="mt-4 text-sm text-gray-500">
				{t("people.addedOn", {
					date: format(person.createdAt, "MMMM d, yyyy"),
				})}
			</div>
		</div>
	);
}

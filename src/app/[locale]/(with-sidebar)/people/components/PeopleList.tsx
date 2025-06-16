"use client";

import { format } from "date-fns";
import { Pencil } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "#i18n/navigation";

interface DiaryMention {
	id: string;
	content: string;
	date: Date;
	createdAt: Date;
	updatedAt: Date;
}

interface Person {
	id: string;
	name: string;
	nickname?: string | null;
	birthday: Date | null;
	howWeMet: string | null;
	interests: string[];
	notes: string | null;
	createdAt: Date;
	updatedAt: Date;
	mentions: DiaryMention[];
}

interface PeopleListProps {
	people: Person[];
}

export default function PeopleList({ people }: PeopleListProps) {
	const t = useTranslations();

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{people.length === 0 ? (
				<div className="bg-white p-6 rounded-lg shadow-md">
					<p className="text-gray-500 text-sm">{t("people.noPeople")}</p>
				</div>
			) : (
				people.map((person) => (
					<div key={person.id} className="bg-white p-6 rounded-lg shadow-md">
						<div className="flex justify-between items-start mb-2">
							<Link
								href={`/people/${person.id}`}
								className="text-xl font-semibold hover:text-blue-600"
							>
								{person.name}
							</Link>
							<Link
								href={`/people/${person.id}/edit`}
								className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
								title={t("people.editProfile")}
							>
								<Pencil className="h-4 w-4" />
							</Link>
						</div>

						{person.nickname && (
							<p className="text-gray-600 mb-2">
								{t("people.nickname")}: {person.nickname}
							</p>
						)}

						{person.birthday && (
							<p className="text-gray-600 mb-2">
								{t("people.birthday")}:{" "}
								{format(person.birthday, "MMMM d, yyyy")}
							</p>
						)}

						{person.howWeMet && (
							<p className="text-gray-600 mb-2">
								{t("people.howWeMet")}: {person.howWeMet}
							</p>
						)}

						{person.interests.length > 0 && (
							<div className="mb-2">
								<p className="text-gray-600">{t("people.interests")}:</p>
								<div className="flex flex-wrap gap-2 mt-1">
									{person.interests.map((interest) => (
										<span
											key={interest}
											className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded"
										>
											{interest}
										</span>
									))}
								</div>
							</div>
						)}

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
				))
			)}
		</div>
	);
}

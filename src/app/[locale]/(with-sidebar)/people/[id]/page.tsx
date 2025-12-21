import { format } from "date-fns";
import { Cake, Heart, StickyNote, User } from "lucide-react";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PersonInterests } from "#components/PersonInterests";
import { PersonNetworkGraph } from "#components/PersonNetworkGraph";
import { PersonSummary } from "#components/PersonSummary";
import { PersonSummarySkeleton } from "#components/PersonSummarySkeleton";
import { getPerson } from "#lib/dal";
import { getTranslations } from "#lib/i18n/server";
import { DiaryEntry } from "../../diary/components/DiaryEntry";
import DeleteButton from "../components/DeleteButton";
import EditButton from "../components/EditButton";

interface PersonPageProps {
	params: Promise<{
		id: string;
		locale: string;
	}>;
}

export async function generateMetadata({ params }: PersonPageProps) {
	const { id } = await params;
	const person = await getPerson(id);

	if (!person) {
		return {};
	}

	return {
		title: person.name,
	};
}

export default async function PersonPage({ params }: PersonPageProps) {
	const t = await getTranslations();
	const person = await getPerson((await params).id);

	if (!person) {
		notFound();
	}

	return (
		<div className="container mx-auto px-4 py-8 space-y-8">
			{/* Main Person Card */}
			<div className="bg-white p-5 md:p-8 rounded-2xl shadow-sm border border-gray-100">
				{/* Header Section */}
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 border-b pb-6 border-gray-100">
					<div>
						<h1 className="text-4xl font-bold text-gray-900 tracking-tight">
							{person.name}
						</h1>
						<div className="flex items-center gap-3 mt-2">
							<span className="text-xl text-gray-500 font-medium">
								{t("people.addedOn", {
									date: format(person.createdAt, "MMMM d, yyyy"),
								})}
							</span>
							<div className="p-2 bg-gray-50 rounded-full text-gray-400">
								<User size={20} />
							</div>
						</div>
					</div>

					<div className="flex items-center gap-2">
						<EditButton personId={person.id} />
						<DeleteButton personId={person.id} personName={person.name} />
					</div>
				</div>

				{/* Details Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
					{person.birthday && (
						<div className="flex items-start gap-4">
							<div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
								<Cake size={24} />
							</div>
							<div>
								<h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">
									{t("people.birthday")}
								</h2>
								<p className="text-lg text-gray-800 font-medium">
									{format(person.birthday, "MMMM d, yyyy")}
								</p>
							</div>
						</div>
					)}

					{person.howWeMet && (
						<div className="flex items-start gap-4">
							<div className="p-3 bg-pink-50 text-pink-600 rounded-xl">
								<Heart size={24} />
							</div>
							<div>
								<h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">
									{t("people.howWeMet")}
								</h2>
								<p className="text-lg text-gray-800 font-medium">
									{person.howWeMet}
								</p>
							</div>
						</div>
					)}
				</div>

				{/* Interests */}
				<div className="mb-8">
					<PersonInterests currentInterests={person.interests} />
				</div>

				{/* Notes */}
				{person.notes && (
					<div className="mt-8 pt-8 border-t border-gray-100">
						<div className="flex items-center gap-2 mb-4">
							<StickyNote size={20} className="text-gray-400" />
							<h2 className="text-lg font-semibold text-gray-900">
								{t("people.notes")}
							</h2>
						</div>
						<div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
							{person.notes}
						</div>
					</div>
				)}
			</div>

			{/* AI Summary Section */}
			<Suspense fallback={<PersonSummarySkeleton />}>
				<PersonSummary personId={person.id} />
			</Suspense>

			{/* Network Graph */}
			<PersonNetworkGraph
				currentPerson={{ id: person.id, name: person.name }}
				mentions={person.mentions}
			/>

			{/* Mentions */}
			{person.mentions.length > 0 && (
				<div className="space-y-6">
					<h2 className="text-2xl font-bold text-gray-800 pl-2 border-l-4 border-blue-500">
						{t("people.mentionedIn")}
					</h2>
					<div className="space-y-6">
						{person.mentions.map((mention) => (
							<DiaryEntry
								key={mention.diaryEntry.id}
								entry={mention.diaryEntry}
							/>
						))}
					</div>
				</div>
			)}
		</div>
	);
}

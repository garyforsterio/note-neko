import { format } from "date-fns";
import {
	Briefcase,
	Cake,
	Globe,
	Heart,
	Mail,
	Phone,
	Smile,
	StickyNote,
} from "lucide-react";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
	generatePersonSuggestions,
	getSuggestions,
} from "#actions/suggestions";
import { PersonInterests } from "#components/PersonInterests";
import { PersonNetworkGraph } from "#components/PersonNetworkGraph";
import { PersonSummary } from "#components/PersonSummary";
import { PersonSummarySkeleton } from "#components/PersonSummarySkeleton";
import { SuggestionsList } from "#components/SuggestionsList";
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

async function SuggestionsSection({ personId }: { personId: string }) {
	// Generate suggestions (and persist) on load
	await generatePersonSuggestions(personId);
	// Fetch pending suggestions
	const suggestions = await getSuggestions(personId);

	return <SuggestionsList suggestions={suggestions} />;
}

export default async function PersonPage({ params }: PersonPageProps) {
	const t = await getTranslations();
	const person = await getPerson((await params).id);

	if (!person) {
		notFound();
	}

	return (
		<div className="container mx-auto px-4 py-8 space-y-8">
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
							{person.namePhonetic && (
								<p className="text-lg text-gray-500 font-medium">
									{/* biome-ignore lint/style/noJsxLiterals: phonetic delimiters */}
									/{person.namePhonetic}/
								</p>
							)}
							<div className="flex items-center gap-3 mt-2">
								<span className="text-sm text-gray-400 font-medium">
									{t("people.addedOn", {
										date: format(person.createdAt, "MMM d, yyyy"),
									})}
								</span>
							</div>
						</div>

						<div className="flex items-center gap-2">
							<EditButton personId={person.id} />
							<DeleteButton personId={person.id} personName={person.name} />
						</div>
					</div>

					{/* Basic Info Grid */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
						{person.birthday && (
							<div className="flex items-center gap-3 text-gray-700">
								<div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
									<Cake size={20} />
								</div>
								<div>
									<p className="text-xs text-gray-400 uppercase font-semibold">
										{t("people.birthday")}
									</p>
									<p className="font-medium">
										{format(person.birthday, "MMMM d, yyyy")}
									</p>
								</div>
							</div>
						)}
						{person.nationality && (
							<div className="flex items-center gap-3 text-gray-700">
								<div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
									<Globe size={20} />
								</div>
								<div>
									<p className="text-xs text-gray-400 uppercase font-semibold">
										{t("people.nationality")}
									</p>
									<p className="font-medium">{person.nationality}</p>
								</div>
							</div>
						)}
						{person.occupation && (
							<div className="flex items-center gap-3 text-gray-700">
								<div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
									<Briefcase size={20} />
								</div>
								<div>
									<p className="text-xs text-gray-400 uppercase font-semibold">
										{t("people.occupation")}
									</p>
									<p className="font-medium">{person.occupation}</p>
								</div>
							</div>
						)}
						{person.howWeMet && (
							<div className="flex items-center gap-3 text-gray-700">
								<div className="p-2 bg-pink-50 text-pink-600 rounded-lg">
									<Smile size={20} />
								</div>
								<div>
									<p className="text-xs text-gray-400 uppercase font-semibold">
										{t("people.howWeMet")}
									</p>
									<p className="font-medium">{person.howWeMet}</p>
								</div>
							</div>
						)}
					</div>

					{/* Contact Info (if available, simplified display) */}
					<div className="mb-8 pt-6 border-t border-gray-100">
						{(person.email || person.phoneNumber || person.website) && (
							<>
								<h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
									{t("people.contactDetails")}
								</h3>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									{person.email && (
										<div className="flex items-center gap-2 text-gray-600">
											<Mail size={16} />
											<span>{person.email}</span>
										</div>
									)}
									{person.phoneNumber && (
										<div className="flex items-center gap-2 text-gray-600">
											<Phone size={16} />
											<span>{person.phoneNumber}</span>
										</div>
									)}
									{person.website && (
										<div className="flex items-center gap-2 text-gray-600">
											<Globe size={16} />
											<a
												href={person.website}
												target="_blank"
												rel="noopener noreferrer"
												className="hover:underline text-blue-600 truncate"
											>
												{person.website}
											</a>
										</div>
									)}
								</div>
							</>
						)}
					</div>

					{/* Interests */}
					<div className="mt-auto">
						<PersonInterests currentInterests={person.interests} />
					</div>
				</div>

				{/* Sidebar Column: Suggestions & Relationships */}
				<div className="space-y-6">
					<Suspense
						fallback={
							<div className="h-32 bg-gray-50 rounded-xl animate-pulse" />
						}
					>
						<SuggestionsSection personId={person.id} />
					</Suspense>

					{/* Relationships Card */}
					<div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
						<div className="flex items-center gap-2 mb-4 text-gray-800">
							<Heart size={20} className="text-red-500" />
							<h3 className="font-semibold text-lg">
								{t("people.relationships")}
							</h3>
						</div>

						<div className="space-y-3">
							{[...person.relationshipsAsFrom, ...person.relationshipsAsTo]
								.length > 0 ? (
								[
									...person.relationshipsAsFrom,
									...person.relationshipsAsTo,
								].map((rel) => {
									const otherPerson =
										"toPerson" in rel ? rel.toPerson : rel.fromPerson;
									return (
										<div
											key={rel.id}
											className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
										>
											<div>
												<p className="font-medium text-gray-900">
													{otherPerson?.name}
												</p>
												<p className="text-xs text-gray-500">{rel.type}</p>
											</div>
										</div>
									);
								})
							) : (
								<p className="text-gray-400 italic text-sm">
									{t("people.noRelationships")}
								</p>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Legacy Notes & AI Summary */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				{person.notes && (
					<div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
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

				<div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
					<Suspense fallback={<PersonSummarySkeleton />}>
						<PersonSummary personId={person.id} />
					</Suspense>
				</div>
			</div>

			{/* Network Graph */}
			<PersonNetworkGraph
				currentPerson={{ id: person.id, name: person.name }}
				mentions={person.mentions}
			/>

			{/* Mentions & Conversations */}
			{person.mentions.length > 0 && (
				<div className="space-y-6">
					<h2 className="text-2xl font-bold text-gray-800 pl-2 border-l-4 border-blue-500">
						{t("people.mentionedIn")}
					</h2>
					<div className="space-y-6">
						{person.mentions.map((mention) => {
							// Find relevant conversations for this entry
							const entryConversations = person.conversations
								? person.conversations.filter(
										(c) => c.diaryEntryId === mention.diaryEntry.id,
									)
								: [];

							return (
								<div key={mention.diaryEntry.id} className="space-y-4">
									<DiaryEntry entry={mention.diaryEntry} />
									{/* Render grouped conversations if any */}
									{entryConversations.length > 0 && (
										<div className="ml-8 pl-4 border-l-2 border-gray-200 space-y-3">
											<h4 className="text-sm font-semibold text-gray-500 uppercase">
												{t("people.entryConversations")}
											</h4>
											{entryConversations.map((c) => (
												<div
													key={c.id}
													className="bg-blue-50 p-4 rounded-lg text-gray-700 italic"
												>
													{/* biome-ignore lint/style/noJsxLiterals: quotation marks around dynamic content */}
													&ldquo;{c.content}&rdquo;
												</div>
											))}
										</div>
									)}
								</div>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
}

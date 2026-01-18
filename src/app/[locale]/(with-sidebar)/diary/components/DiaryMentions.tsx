"use client";

import type { Conversation } from "@prisma/client";
import { MessageCircle, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Link } from "#i18n/navigation";
import type { DiaryEntryWithRelations } from "#lib/dal";

interface DiaryMentionsProps {
	mentions: DiaryEntryWithRelations["mentions"];
	conversations?: Conversation[];
}

export function DiaryMentions({
	mentions,
	conversations = [],
}: DiaryMentionsProps) {
	const t = useTranslations();
	const [expandedPersonId, setExpandedPersonId] = useState<string | null>(null);

	if (mentions.length === 0) return null;

	const toggleExpansion = (personId: string, hasConversation: boolean) => {
		if (!hasConversation) return;
		setExpandedPersonId(expandedPersonId === personId ? null : personId);
	};

	return (
		<div className="flex flex-col gap-2 relative z-20">
			<div className="flex flex-wrap items-center gap-2">
				{mentions.map((mention) => {
					const personConversations = conversations.filter(
						(c) => c.personId === mention.person.id,
					);
					const hasConversation = personConversations.length > 0;
					const isExpanded = expandedPersonId === mention.person.id;

					return (
						<div key={mention.id} className="relative">
							<div
								className={`inline-flex items-center gap-0.5 rounded-full text-sm font-medium transition-all border ${
									hasConversation
										? "cursor-pointer pl-1 pr-3 py-1 hover:bg-indigo-100 hover:border-indigo-200"
										: "px-3 py-1"
								} ${
									isExpanded
										? "bg-indigo-100 border-indigo-200 text-indigo-800"
										: "bg-indigo-50 border-indigo-100/50 text-indigo-700"
								}`}
							>
								{hasConversation && (
									<button
										type="button"
										onClick={() => toggleExpansion(mention.person.id, true)}
										className={`p-1 rounded-full hover:bg-indigo-200/50 transition-colors ${
											isExpanded ? "text-indigo-600" : "text-indigo-400"
										}`}
									>
										<MessageCircle
											size={14}
											className={isExpanded ? "fill-current" : ""}
										/>
									</button>
								)}
								<Link
									href={`/people/${mention.person.id}`}
									className="flex items-center gap-1.5 hover:underline decoration-indigo-300 underline-offset-2"
									onClick={(e) => e.stopPropagation()}
								>
									{!hasConversation && (
										<User size={14} className="opacity-70" />
									)}
									{mention.person.name}
								</Link>
							</div>

							{/* Popover/Expanded View */}
							{isExpanded && (
								<div className="absolute top-full left-0 mt-2 w-64 md:w-80 z-[100] animate-in fade-in zoom-in-95 duration-200 origin-top-left">
									<div className="bg-white rounded-xl shadow-xl border border-indigo-100 overflow-hidden ring-1 ring-black/5">
										<div className="bg-indigo-50/50 px-4 py-2 border-b border-indigo-100 flex justify-between items-center">
											<span className="text-xs font-semibold text-indigo-900 uppercase tracking-wider">
												{t("diary.conversation")}
											</span>
											<button
												type="button"
												onClick={() => setExpandedPersonId(null)}
												className="text-indigo-400 hover:text-indigo-600 cursor-pointer"
											>
												<span className="sr-only">{t("common.close")}</span>
												&times;
											</button>
										</div>
										<div className="max-h-60 overflow-y-auto p-0">
											{personConversations.map((conv) => (
												<div
													key={conv.id}
													className="p-3 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
												>
													<p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
														{conv.content}
													</p>
												</div>
											))}
										</div>
									</div>
								</div>
							)}
						</div>
					);
				})}
			</div>

			{/* Mobile/Layout overlay to close when clicking outside could be added here if needed, 
                but basic toggle is sufficient for now. */}
			{expandedPersonId && (
				<div
					className="fixed inset-0 z-[90]"
					onClick={() => setExpandedPersonId(null)}
					onKeyDown={(e) => {
						if (e.key === "Escape") setExpandedPersonId(null);
					}}
					role="button"
					tabIndex={0}
					aria-label={t("diary.closeExpandedView")}
				/>
			)}
		</div>
	);
}

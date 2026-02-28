"use client";

import { Check, Sparkles, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { resolveSuggestion } from "#actions/suggestions";

interface Suggestion {
	id: string;
	type: string;
	targetField?: string | null;
	value?: string | null;
	reason?: string | null;
	relationshipType?: string | null;
	relatedPerson?: { name: string } | null;
}

interface SuggestionsListProps {
	suggestions: Suggestion[];
}

export function SuggestionsList({
	suggestions: initialSuggestions,
}: SuggestionsListProps) {
	const t = useTranslations("people.suggestions");
	const [suggestions, setSuggestions] = useState(initialSuggestions);
	const [isPending, startTransition] = useTransition();

	if (suggestions.length === 0) return null;

	const handleResolve = (id: string, accepted: boolean) => {
		setSuggestions((prev) => prev.filter((s) => s.id !== id));
		startTransition(async () => {
			try {
				await resolveSuggestion(id, accepted);
			} catch (error) {
				console.error("Failed to resolve suggestion", error);
				// Optionally revert state?
			}
		});
	};

	return (
		<div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
			<div className="flex items-center gap-2 mb-4 text-indigo-900">
				<Sparkles className="h-5 w-5 text-indigo-600" />
				<h3 className="font-semibold text-lg">{t("title")}</h3>
			</div>
			<div className="space-y-3">
				{suggestions.map((suggestion) => (
					<div
						key={suggestion.id}
						className="bg-white p-4 rounded-xl shadow-sm border border-indigo-100 flex flex-col gap-3"
					>
						<div>
							<p className="font-medium text-gray-900">
								{suggestion.type === "UPDATE_FIELD" ? (
									<span>
										{t("updateField", {
											field: suggestion.targetField || "Unknown",
										})}{" "}
										<span className="text-indigo-600">{suggestion.value}</span>
									</span>
								) : suggestion.type === "ADD_RELATIONSHIP" ? (
									<span>
										{t("addRelationship")}{" "}
										<strong>{suggestion.relatedPerson?.name}</strong>
										{suggestion.relationshipType && (
											<span>
												{" "}
												{t("relationshipDetail", {
													type: suggestion.relationshipType,
												})}
											</span>
										)}
									</span>
								) : (
									t("newSuggestion")
								)}
							</p>
							{suggestion.reason && (
								<p className="text-sm text-gray-500 mt-1">
									{suggestion.reason}
								</p>
							)}
						</div>
						<div className="flex gap-2 justify-end">
							<button
								type="button"
								onClick={() => handleResolve(suggestion.id, false)}
								className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
								title={t("reject")}
								disabled={isPending}
							>
								<X size={20} />
							</button>
							<button
								type="button"
								onClick={() => handleResolve(suggestion.id, true)}
								className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors cursor-pointer"
								title={t("accept")}
								disabled={isPending}
							>
								<Check size={20} />
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

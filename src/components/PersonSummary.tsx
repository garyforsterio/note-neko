import { generatePersonSummary } from "#actions/generatePersonSummary";
import { getTranslations } from "#lib/i18n/server";

interface PersonSummaryProps {
	personId: string;
}

export async function PersonSummary({ personId }: PersonSummaryProps) {
	const t = await getTranslations();

	try {
		const summary = await generatePersonSummary(personId);

		if (
			!summary.summary ||
			summary.summary.includes("Not enough information")
		) {
			return (
				<div className="bg-white rounded-lg shadow-md p-6 mb-8">
					<h2 className="text-xl font-bold mb-4 flex items-center gap-2">
						<span className="text-purple-600">💝</span>
						{t("people.aiSummary.title")}
					</h2>
					<p className="text-gray-500 italic">{t("people.aiSummary.noData")}</p>
				</div>
			);
		}

		return (
			<div className="bg-white rounded-lg shadow-md p-6 mb-8">
				<h2 className="text-xl font-bold mb-4 flex items-center gap-2">
					<span className="text-purple-600">💝</span>
					{t("people.aiSummary.title")}
				</h2>

				{/* Main Summary */}
				<div className="mb-6">
					<p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
						{summary.summary}
					</p>
				</div>

				<div className="grid md:grid-cols-2 gap-6">
					{/* Conversation Topics */}
					{summary.conversationTopics.length > 0 && (
						<div>
							<h3 className="text-lg font-semibold mb-3 text-gray-800 flex items-center gap-2">
								💬 {t("people.aiSummary.conversationTopics")}
							</h3>
							<ul className="space-y-2">
								{summary.conversationTopics.map((topic) => (
									<li key={topic} className="flex items-start gap-2">
										<span className="text-blue-500 mt-1">•</span>
										<span className="text-gray-700">{topic}</span>
									</li>
								))}
							</ul>
						</div>
					)}

					{/* Activity Suggestions */}
					{summary.activitySuggestions.length > 0 && (
						<div>
							<h3 className="text-lg font-semibold mb-3 text-gray-800 flex items-center gap-2">
								🎯 {t("people.aiSummary.activitySuggestions")}
							</h3>
							<ul className="space-y-2">
								{summary.activitySuggestions.map((activity) => (
									<li key={activity} className="flex items-start gap-2">
										<span className="text-green-500 mt-1">•</span>
										<span className="text-gray-700">{activity}</span>
									</li>
								))}
							</ul>
						</div>
					)}

					{/* Relationship Tips */}
					{summary.relationshipTips.length > 0 && (
						<div>
							<h3 className="text-lg font-semibold mb-3 text-gray-800 flex items-center gap-2">
								💡 {t("people.aiSummary.relationshipTips")}
							</h3>
							<ul className="space-y-2">
								{summary.relationshipTips.map((tip) => (
									<li key={tip} className="flex items-start gap-2">
										<span className="text-purple-500 mt-1">•</span>
										<span className="text-gray-700">{tip}</span>
									</li>
								))}
							</ul>
						</div>
					)}

					{/* Suggested Interests */}
					{summary.suggestedInterests.length > 0 && (
						<div>
							<h3 className="text-lg font-semibold mb-3 text-gray-800 flex items-center gap-2">
								🔍 {t("people.aiSummary.suggestedInterests")}
							</h3>
							<div className="flex flex-wrap gap-2">
								{summary.suggestedInterests.map((interest) => (
									<span
										key={interest}
										className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm border border-orange-200 border-dashed"
									>
										{interest}
									</span>
								))}
							</div>
							<p className="text-xs text-gray-500 mt-2">
								{t("people.aiSummary.suggestedInterestsNote")}
							</p>
						</div>
					)}
				</div>

				{/* AI Attribution */}
				<div className="mt-6 pt-4 border-t border-gray-100">
					<p className="text-sm text-gray-400 italic">
						{t("people.aiSummary.attribution")}
					</p>
				</div>
			</div>
		);
	} catch (error) {
		console.error("Failed to load person summary:", error);

		return (
			<div className="bg-white rounded-lg shadow-md p-6 mb-8">
				<h2 className="text-xl font-bold mb-4 flex items-center gap-2">
					<span className="text-purple-600">💝</span>
					{t("people.aiSummary.title")}
				</h2>
				<div className="bg-red-50 border border-red-200 rounded-lg p-4">
					<p className="text-red-700">{t("people.aiSummary.error")}</p>
				</div>
			</div>
		);
	}
}

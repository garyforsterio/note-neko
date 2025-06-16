import { getTranslations } from "#lib/i18n/server";

interface PersonInterestsProps {
	interests: string[];
}

export default async function PersonInterests({
	interests,
}: PersonInterestsProps) {
	if (interests.length === 0) return null;
	const t = await getTranslations();

	return (
		<div className="mb-2">
			<p className="text-gray-600">{t("people.interests")}:</p>
			<div className="flex flex-wrap gap-2 mt-1">
				{interests.map((interest) => (
					<span
						key={interest}
						className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded"
					>
						{interest}
					</span>
				))}
			</div>
		</div>
	);
}

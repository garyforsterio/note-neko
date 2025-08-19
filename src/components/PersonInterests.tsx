import { getTranslations } from "#lib/i18n/server";

interface PersonInterestsProps {
	currentInterests: string[];
}

export async function PersonInterests({
	currentInterests,
}: PersonInterestsProps) {
	const t = await getTranslations();

	return (
		<div className="mb-4">
			<h2 className="text-lg font-semibold mb-2">{t("people.interests")}</h2>
			<div className="flex flex-wrap gap-2">
				{/* Current interests */}
				{currentInterests.map((interest) => (
					<span
						key={interest}
						className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
					>
						{interest}
					</span>
				))}
			</div>
		</div>
	);
}

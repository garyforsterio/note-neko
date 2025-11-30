import { notFound } from "next/navigation";
import { getPerson } from "#lib/dal";
import { getTranslations } from "#lib/i18n/server";
import PersonForm from "../../components/PersonForm";

interface EditPersonPageProps {
	params: Promise<{
		id: string;
		locale: string;
	}>;
}

export async function generateMetadata() {
	const t = await getTranslations();

	return {
		title: t("people.editProfile"),
	};
}

export default async function EditPersonPage({ params }: EditPersonPageProps) {
	const t = await getTranslations();
	const person = await getPerson((await params).id);

	if (!person) {
		notFound();
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-2xl font-bold mb-6">{t("people.editProfile")}</h1>
			<PersonForm person={person} />
		</div>
	);
}

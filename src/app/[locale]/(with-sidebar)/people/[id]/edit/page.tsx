import { getPerson } from "#lib/dal";
import PersonForm from "../../components/PersonForm";
import { getTranslations } from "#lib/i18n/server";
import { notFound } from "next/navigation";

interface EditPersonPageProps {
	params: Promise<{
		id: string;
	}>;
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

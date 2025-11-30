import { LoginForm } from "#components/auth/LoginForm";
import { getTranslations } from "#lib/i18n/server";

export async function generateMetadata() {
	const t = await getTranslations();

	return {
		title: t("auth.login.title"),
	};
}

export default async function LoginPage() {
	const t = await getTranslations();

	return (
		<div>
			<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
				{t("auth.login.title")}
			</h2>
			<LoginForm />
		</div>
	);
}

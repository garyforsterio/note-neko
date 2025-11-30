import { ForgotPasswordForm } from "#components/auth/ForgotPasswordForm";
import { getTranslations } from "#lib/i18n/server";

export async function generateMetadata() {
	const t = await getTranslations();

	return {
		title: t("auth.forgotPassword.title"),
	};
}

export default async function ForgotPasswordPage() {
	const t = await getTranslations();

	return (
		<div>
			<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
				{t("auth.forgotPassword.title")}
			</h2>
			<ForgotPasswordForm />
		</div>
	);
}

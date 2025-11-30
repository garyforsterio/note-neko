import { ResetPasswordForm } from "#components/auth/ResetPasswordForm";
import { getTranslations } from "#lib/i18n/server";

interface ResetPasswordPageProps {
	searchParams: Promise<{ token?: string }>;
}

export async function generateMetadata() {
	const t = await getTranslations();

	return {
		title: t("auth.resetPassword.title"),
	};
}

export default async function ResetPasswordPage({
	searchParams,
}: ResetPasswordPageProps) {
	const t = await getTranslations();
	const { token } = await searchParams;

	if (!token) {
		return (
			<div>
				<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
					{t("auth.resetPassword.title")}
				</h2>
				<div className="mt-8">
					<div className="rounded-md bg-red-50 p-4">
						<div className="text-sm text-red-700">
							{t("auth.resetPassword.error.invalidToken")}
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div>
			<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
				{t("auth.resetPassword.title")}
			</h2>
			<ResetPasswordForm token={token} />
		</div>
	);
}

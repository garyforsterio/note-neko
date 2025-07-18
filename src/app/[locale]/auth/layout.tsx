import { getTranslations } from "#lib/i18n/server";

export default async function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const t = await getTranslations();

	return (
		<div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
			<div className="max-w-md w-full space-y-8">{children}</div>
		</div>
	);
}

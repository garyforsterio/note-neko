import CreditsBanner from "#components/CreditsBanner";
import Navigation from "#components/Navigation";
import { ProcessingProvider } from "#contexts/ProcessingContext";
import { getUnreviewedDiaryCount } from "#lib/dal";

export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	const notificationCount = await getUnreviewedDiaryCount();

	return (
		<ProcessingProvider>
			<Navigation notificationCount={notificationCount} />
			<main className="min-h-screen bg-gray-50 md:pl-72 pb-16 md:pb-0">
				<CreditsBanner />
				{children}
			</main>
		</ProcessingProvider>
	);
}

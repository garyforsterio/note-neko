import Navigation from "#components/Navigation";
import { ProcessingProvider } from "#contexts/ProcessingContext";

export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<ProcessingProvider>
			<Navigation />
			<main className="min-h-screen bg-gray-50 md:pl-72 pb-16 md:pb-0">
				{children}
			</main>
		</ProcessingProvider>
	);
}

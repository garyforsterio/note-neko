import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Viewport } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { Toaster } from "#components/ui/toaster";
import { routing } from "#i18n/routing";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	interactiveWidget: "resizes-visual",
};

export async function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}) {
	// Ensure that the incoming `locale` is valid
	const { locale } = await params;
	if (!hasLocale(routing.locales, locale)) {
		notFound();
	}

	return (
		<html lang={locale}>
			<body className={inter.className}>
				<NextIntlClientProvider>
					{children}
					<Toaster />
				</NextIntlClientProvider>
				<Analytics />
				<SpeedInsights />
			</body>
		</html>
	);
}

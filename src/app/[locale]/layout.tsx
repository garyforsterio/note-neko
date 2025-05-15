import { Inter } from 'next/font/google';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { routing } from '#i18n/routing';
import Navigation from '#components/Navigation';
import { getDiaryEntries } from '#lib/dal';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

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

  const entries = await getDiaryEntries();

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider>
          <Navigation entries={entries} />
          <main className="min-h-screen bg-gray-50 md:pl-72 pb-16 md:pb-0">
            {children}
          </main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

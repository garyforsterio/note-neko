import Navigation from '#components/Navigation';
import { getDiaryEntries } from '#lib/dal';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const entries = await getDiaryEntries();

  return (
    <>
      <Navigation entries={entries} />
      <main className="min-h-screen bg-gray-50 md:pl-72 pb-16 md:pb-0">
        {children}
      </main>
    </>
  );
}

import { getDiaryEntry, getPeople } from '#lib/dal';
import DiaryForm from '../../components/DiaryForm';
import { getTranslations } from '#lib/i18n/server';
import { notFound } from 'next/navigation';

interface EditDiaryEntryPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditDiaryEntryPage({
  params,
}: EditDiaryEntryPageProps) {
  const t = await getTranslations();
  const [entry, people] = await Promise.all([
    getDiaryEntry((await params).id),
    getPeople(),
  ]);

  if (!entry) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{t('diary.editEntry')}</h1>
      <DiaryForm entry={entry} people={people} />
    </div>
  );
}

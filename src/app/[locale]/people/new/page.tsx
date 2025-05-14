import PersonForm from '../components/PersonForm';
import { getTranslations } from 'next-intl/server';

export default async function NewPersonPage() {
  const t = await getTranslations();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{t('people.addPerson')}</h1>
      <PersonForm />
    </div>
  );
}

import PersonForm from '../components/PersonForm';
import { getTranslations } from '#lib/i18n/server';
import { ensureLoggedIn } from '#lib/auth';

export default async function NewPersonPage() {
  const t = await getTranslations();

  await ensureLoggedIn();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{t('people.newPerson')}</h1>
      <PersonForm />
    </div>
  );
}

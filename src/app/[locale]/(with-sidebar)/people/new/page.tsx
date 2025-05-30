import PersonForm from '../components/PersonForm';
import { getTranslations } from 'next-intl/server';
import { getCurrentUser } from '#lib/auth';
import { redirect } from 'next/navigation';

export default async function NewPersonPage() {
  const t = await getTranslations();
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/login');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{t('people.newPerson')}</h1>
      <PersonForm />
    </div>
  );
}

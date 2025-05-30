import { SignUpForm } from '#components/auth/SignUpForm';
import { getTranslations } from 'next-intl/server';

export default async function SignupPage() {
  const t = await getTranslations();

  return (
    <div>
      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
        {t('auth.signup.title')}
      </h2>
      <SignUpForm />
    </div>
  );
}

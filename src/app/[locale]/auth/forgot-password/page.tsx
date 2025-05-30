import { ForgotPasswordForm } from '#components/auth/ForgotPasswordForm';
import { getTranslations } from 'next-intl/server';

export default async function ForgotPasswordPage() {
  const t = await getTranslations();

  return (
    <div>
      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
        {t('auth.forgotPassword.title')}
      </h2>
      <ForgotPasswordForm />
    </div>
  );
}

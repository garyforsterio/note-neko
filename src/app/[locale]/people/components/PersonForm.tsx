'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPersonAction, updatePersonAction } from '@/app/actions';
import { useTranslations } from 'next-intl';

interface PersonFormProps {
  person?: {
    id: string;
    name: string;
    birthday: Date | null;
    howWeMet: string | null;
    interests: string[];
    notes: string | null;
  };
}

export default function PersonForm({ person }: PersonFormProps) {
  const router = useRouter();
  const t = useTranslations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      birthday: (formData.get('birthday') as string) || null,
      howWeMet: (formData.get('howWeMet') as string) || null,
      interests: (formData.get('interests') as string)
        .split(',')
        .map((i) => i.trim())
        .filter(Boolean),
      notes: (formData.get('notes') as string) || null,
    };

    try {
      if (person) {
        const result = await updatePersonAction(person.id, data);
        if (!result.success) {
          throw new Error(result.error || t('errors.updateFailed'));
        }
      } else {
        const result = await createPersonAction(data);
        if (!result.success) {
          throw new Error(result.error || t('errors.createFailed'));
        }
      }
      router.push('/people');
    } catch (error) {
      console.error('Error saving person:', error);
      setError(error instanceof Error ? error.message : t('errors.unexpected'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-md">{error}</div>
      )}

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {t('form.name')} *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          defaultValue={person?.name}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label
          htmlFor="birthday"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {t('form.birthday')}
        </label>
        <input
          type="date"
          id="birthday"
          name="birthday"
          defaultValue={
            person?.birthday
              ? new Date(person.birthday).toISOString().split('T')[0]
              : ''
          }
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label
          htmlFor="howWeMet"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {t('form.howWeMet')}
        </label>
        <textarea
          id="howWeMet"
          name="howWeMet"
          defaultValue={person?.howWeMet || ''}
          rows={3}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label
          htmlFor="interests"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {t('form.interests')}
        </label>
        <input
          type="text"
          id="interests"
          name="interests"
          defaultValue={person?.interests.join(', ')}
          placeholder={t('form.interestsPlaceholder')}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label
          htmlFor="notes"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {t('form.notes')}
        </label>
        <textarea
          id="notes"
          name="notes"
          defaultValue={person?.notes || ''}
          rows={4}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          {t('form.cancel')}
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting
            ? t('form.saving')
            : person
            ? t('form.saveChanges')
            : t('form.save')}
        </button>
      </div>
    </form>
  );
}

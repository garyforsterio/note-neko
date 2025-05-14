'use client';

import { useActionState, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  createPersonAction,
  updatePersonAction,
  type State,
} from '@/app/actions';
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
  const [state, action, isLoading] = useActionState<State, FormData>(
    person ? updatePersonAction : createPersonAction,
    {
      success: undefined,
      error: undefined,
    }
  );

  return (
    <form className="space-y-6" action={action} method="POST">
      {state.error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-md">
          {state.error}
        </div>
      )}

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {t('people.name')} *
        </label>
        <input hidden name="id" value={person?.id} readOnly />
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
          {t('people.birthday')}
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
          {t('people.howWeMet')}
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
          {t('people.interests')}
        </label>
        <input
          type="text"
          id="interests"
          name="interests"
          defaultValue={person?.interests.join(', ')}
          placeholder={t('people.interestsPlaceholder')}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label
          htmlFor="notes"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {t('people.notes')}
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
          {t('people.cancel')}
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading
            ? t('people.saving')
            : person
            ? t('people.update')
            : t('people.save')}
        </button>
      </div>
    </form>
  );
}

'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ErrorMessage from '#app/components/ErrorMessage';
import { useActionState } from 'react';
import { createPersonWithoutRedirectAction } from '#app/actions/people';
import { ActionState } from '#app/actions/types';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface CreatePersonModalProps {
  onClose: () => void;
  onPersonCreated: (person: { id: string; name: string }) => void;
}

interface CreatePersonResult extends ActionState {
  data?: {
    id: string;
    name: string;
  };
}

export default function CreatePersonModal({
  onClose,
  onPersonCreated,
}: CreatePersonModalProps) {
  const t = useTranslations();
  const [state, action, isPending] = useActionState<
    CreatePersonResult,
    FormData
  >(createPersonWithoutRedirectAction, {});

  const handleSubmit = async (formData: FormData) => {
    const result = (await action(formData)) as unknown as CreatePersonResult;
    if (result?.success && result.data) {
      onPersonCreated(result.data);
      onClose();
    }
  };

  return createPortal(
    <>
      {/* Mobile Modal */}
      <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{t('people.newPerson')}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <form action={handleSubmit} className="space-y-4">
            <ErrorMessage message={state.error} />
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t('people.name')} *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
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
                placeholder={t('people.interestsPlaceholder')}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                {t('common.cancel')}
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isPending ? t('common.saving') : t('common.create')}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block fixed inset-y-0 right-0 w-96 bg-white shadow-lg z-50">
        <div className="h-full flex flex-col">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">{t('people.newPerson')}</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            <form
              id="create-person-form"
              action={handleSubmit}
              className="space-y-6"
            >
              <ErrorMessage message={state.error} />
              <div>
                <label
                  htmlFor="name-desktop"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {t('people.name')} *
                </label>
                <input
                  type="text"
                  id="name-desktop"
                  name="name"
                  required
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label
                  htmlFor="interests-desktop"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {t('people.interests')}
                </label>
                <input
                  type="text"
                  id="interests-desktop"
                  name="interests"
                  placeholder={t('people.interestsPlaceholder')}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </form>
          </div>
          <div className="p-6 border-t bg-gray-50">
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                {t('common.cancel')}
              </button>
              <button
                type="submit"
                form="create-person-form"
                disabled={isPending}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isPending ? t('common.saving') : t('common.create')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}

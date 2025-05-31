'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  createDiaryEntryAction,
  updateDiaryEntryAction,
} from '#app/actions/diary';
import { useTranslations } from 'next-intl';
import LocationMention from './LocationMention';
import MentionDropdown from './MentionDropdown';
import { renderMarkdown } from '#lib/markdown';
import { useActionState } from 'react';
import { type ActionState } from '#app/actions/types';
import ErrorMessage from '#app/components/ErrorMessage';

interface Person {
  id: string;
  name: string;
  birthday: Date | null;
  howWeMet: string | null;
  interests: string[];
}

interface DiaryFormProps {
  entry?: {
    id: string;
    content: string;
    date: Date;
    mentions: {
      id: string;
      person: {
        id: string;
        name: string;
      };
    }[];
    locations?: {
      id: string;
      name: string;
      placeId: string;
      lat: number;
      lng: number;
    }[];
  };
  people: Person[];
}

export default function DiaryForm({ entry, people }: DiaryFormProps) {
  const t = useTranslations();
  const router = useRouter();
  const [content, setContent] = useState(entry?.content || '');
  const [selectedDate, setSelectedDate] = useState<Date>(
    entry?.date || new Date()
  );
  const [selectedPeople, setSelectedPeople] = useState<string[]>(
    entry?.mentions.map((m) => m.person.id) || []
  );
  const [locations, setLocations] = useState<
    Array<{
      name: string;
      placeId: string;
      lat: number;
      lng: number;
    }>
  >(entry?.locations || []);
  const [showLocationMention, setShowLocationMention] = useState(false);
  const [showPeopleMention, setShowPeopleMention] = useState(false);
  const [mentionPosition, setMentionPosition] = useState({ top: 0, left: 0 });
  const [mentionSearchTerm, setMentionSearchTerm] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [state, action, isPending] = useActionState<ActionState, FormData>(
    entry ? updateDiaryEntryAction : createDiaryEntryAction,
    {}
  );

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowLocationMention(false);
        setShowPeopleMention(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    const cursorPosition = textarea.selectionStart;
    const textBeforeCursor = content.substring(0, cursorPosition);
    const lines = textBeforeCursor.split('\n');
    const currentLine = lines[lines.length - 1] || '';
    const lineHeight = parseInt(getComputedStyle(textarea).lineHeight);
    const rect = textarea.getBoundingClientRect();
    const top = rect.top + (lines.length - 1) * lineHeight;
    const left = rect.left + currentLine.length * 8; // Approximate character width

    if (e.key === '@') {
      setMentionPosition({ top, left });
      setShowPeopleMention(true);
      setMentionSearchTerm('');
    } else if (e.key === '#') {
      setMentionPosition({ top, left });
      setShowLocationMention(true);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setContent(newValue);

    // Handle @ mentions
    const cursorPosition = e.target.selectionStart;
    const textBeforeCursor = newValue.slice(0, cursorPosition);
    const mentionMatch = textBeforeCursor.match(/@(\w*)$/);

    if (mentionMatch) {
      const searchTerm = mentionMatch[1] || '';
      setMentionSearchTerm(searchTerm);
      setShowPeopleMention(true);
    } else {
      setShowPeopleMention(false);
    }
  };

  const handlePersonSelect = (person: { id: string; name: string }) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const cursorPosition = textarea.selectionStart;
    const textBeforeCursor = content.slice(0, cursorPosition);
    const textAfterCursor = content.slice(cursorPosition);
    const mentionMatch = textBeforeCursor.match(/@(\w*)$/);

    if (mentionMatch) {
      const mentionStart = cursorPosition - mentionMatch[0].length;
      const newValue =
        textBeforeCursor.slice(0, mentionStart) +
        `@[${person.name}](/people/${person.id})` +
        textAfterCursor;

      setContent(newValue);
      setSelectedPeople([...selectedPeople, person.id]);
      setShowPeopleMention(false);
    }
  };

  const handleLocationSelect = (location: {
    name: string;
    placeId: string;
    lat: number;
    lng: number;
  }) => {
    setLocations([...locations, location]);
    setContent(
      content +
        ` [${location.name}](https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng})`
    );
    setShowLocationMention(false);
  };

  return (
    <form action={action} className="space-y-6">
      <ErrorMessage message={state.error} />
      <input type="hidden" name="content" value={content} />
      <div className="mb-4">
        <label
          htmlFor="date"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {t('diary.date')}
        </label>
        <input
          type="date"
          id="date"
          name="date"
          value={selectedDate.toISOString().split('T')[0]}
          onChange={(e) => setSelectedDate(new Date(e.target.value))}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <input
        type="hidden"
        name="mentions"
        value={JSON.stringify(selectedPeople)}
      />
      <input type="hidden" name="locations" value={JSON.stringify(locations)} />
      {entry && <input type="hidden" name="id" value={entry.id} />}

      <div className="relative">
        <div className="flex space-x-4 mb-4">
          <button
            type="button"
            onClick={() => setIsPreview(false)}
            className={`px-4 py-2 rounded-md ${
              !isPreview ? 'bg-blue-600 text-white' : 'bg-gray-100'
            }`}
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => setIsPreview(true)}
            className={`px-4 py-2 rounded-md ${
              isPreview ? 'bg-blue-600 text-white' : 'bg-gray-100'
            }`}
          >
            Preview
          </button>
        </div>

        {isPreview ? (
          <div className="prose max-w-none p-4 bg-white rounded-md border border-gray-300">
            <div
              dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
            />
          </div>
        ) : (
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            className="w-full h-64 p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={t('diary.contentPlaceholder')}
          />
        )}

        {showLocationMention && (
          <div
            style={{
              position: 'fixed',
              top: mentionPosition.top,
              left: mentionPosition.left,
            }}
          >
            <LocationMention
              onLocationSelect={handleLocationSelect}
              onClose={() => setShowLocationMention(false)}
            />
          </div>
        )}

        {showPeopleMention && (
          <div
            style={{
              position: 'fixed',
              top: mentionPosition.top,
              left: mentionPosition.left,
            }}
          >
            <div className="w-80 border rounded-md bg-white shadow-lg">
              <div className="p-4 border-b">
                <h3 className="font-medium text-gray-900">Mention People</h3>
                <p className="text-sm text-gray-500">
                  Type @ to mention someone
                </p>
              </div>
              <MentionDropdown
                searchTerm={mentionSearchTerm}
                onSelect={handlePersonSelect}
                people={people}
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          {t('common.cancel')}
        </button>
        <button
          type="submit"
          disabled={isPending}
          aria-disabled={isPending}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isPending
            ? t('common.saving')
            : entry
            ? t('common.save')
            : t('common.create')}
        </button>
      </div>
    </form>
  );
}

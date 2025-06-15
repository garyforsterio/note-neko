import { Link } from '#i18n/navigation';
import { Pencil } from 'lucide-react';
import { format } from 'date-fns';
import type { DiaryEntryWithRelations } from '#lib/dal';
import { renderMarkdown } from '#lib/markdown';
import { getTranslations } from '#lib/i18n/server';
import DeleteButton from './DeleteButton';
import { DiaryMentions } from './DiaryMentions';
import { DiaryLocations } from './DiaryLocations';
import Markdown from 'react-markdown';

interface DiaryEntryProps {
  entry: DiaryEntryWithRelations;
}

export async function DiaryEntry({ entry }: DiaryEntryProps) {
  const t = await getTranslations();

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-start mb-4">
        <div>
          <Link
            href={`/diary/${entry.id}`}
            className="text-xl font-semibold hover:text-blue-600"
          >
            {format(new Date(entry.date), 'MMMM d, yyyy')}
          </Link>
          <p className="text-sm text-gray-500">
            {t('diary.writtenOn', {
              date: format(entry.createdAt, 'MMMM d, yyyy'),
            })}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/diary/${entry.id}/edit`}
            className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
            title={t('diary.editEntry')}
          >
            <Pencil className="h-4 w-4" />
          </Link>
          <DeleteButton id={entry.id} />
        </div>
      </div>

      <div className="prose max-w-none">
        <Markdown>
          {renderMarkdown(
            entry.content,
            entry.mentions.map((m) => m.person),
            entry.locations
          )}
        </Markdown>
      </div>

      <DiaryMentions mentions={entry.mentions} />
      <DiaryLocations locations={entry.locations} />
    </div>
  );
}

import { Link } from '#i18n/navigation';
import type { DiaryEntryWithRelations } from '#lib/dal';
import { getTranslations } from '#lib/i18n/server';

interface DiaryMentionsProps {
  mentions: DiaryEntryWithRelations['mentions'];
}

export async function DiaryMentions({ mentions }: DiaryMentionsProps) {
  const t = await getTranslations();
  if (mentions.length === 0) return null;

  return (
    <div className="mt-4 pt-4 border-t">
      <h3 className="text-sm font-medium text-gray-700 mb-2">
        {t('diary.mentions')}:
      </h3>
      <div className="flex flex-wrap gap-2">
        {mentions.map((mention) => (
          <Link
            key={mention.id}
            href={`/people/${mention.person.id}`}
            className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded hover:bg-blue-200 transition-colors"
          >
            {mention.person.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

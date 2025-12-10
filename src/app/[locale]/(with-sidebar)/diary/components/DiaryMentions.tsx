import { User } from "lucide-react";
import { Link } from "#i18n/navigation";
import type { DiaryEntryWithRelations } from "#lib/dal";

interface DiaryMentionsProps {
	mentions: DiaryEntryWithRelations["mentions"];
}

export async function DiaryMentions({ mentions }: DiaryMentionsProps) {
	if (mentions.length === 0) return null;

	return (
		<div className="flex flex-wrap items-center gap-2">
			{mentions.map((mention) => (
				<Link
					key={mention.id}
					href={`/people/${mention.person.id}`}
					className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium hover:bg-indigo-100 transition-colors border border-indigo-100/50"
				>
					<User size={14} className="opacity-70" />
					{mention.person.name}
				</Link>
			))}
		</div>
	);
}

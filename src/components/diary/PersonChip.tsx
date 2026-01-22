"use client";

import { User, X } from "lucide-react";
import type { Person } from "#generated/prisma";

interface PersonChipProps {
	person: Person;
	onRemove?: () => void;
	onEdit?: (event: React.MouseEvent) => void;
	className?: string;
}

export default function PersonChip({
	person,
	onRemove,
	onEdit,
	className = "",
}: PersonChipProps) {
	return (
		<span
			className={`inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium transition-colors border border-indigo-100/50 ${className}`}
		>
			<User size={14} className="opacity-70" />
			<button
				type="button"
				onClick={onEdit}
				className="hover:underline focus:outline-none hover:text-indigo-900"
			>
				{person.nickname || person.name}
			</button>
			{onRemove && (
				<button
					type="button"
					onClick={onRemove}
					className="ml-1 -mr-1 p-0.5 rounded-full hover:bg-indigo-200/50 text-indigo-600 hover:text-indigo-800 transition-colors focus:outline-none"
					aria-label={`Remove ${person.name}`}
				>
					<X size={14} />
				</button>
			)}
		</span>
	);
}

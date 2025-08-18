"use client";

import type { Person } from "@prisma/client";
import { User, X } from "lucide-react";

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
			className={`inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm ${className}`}
		>
			<User className="w-3 h-3" />
			<button
				type="button"
				onClick={onEdit}
				className="hover:underline focus:outline-none"
			>
				{person.nickname || person.name}
			</button>
			{onRemove && (
				<button
					type="button"
					onClick={onRemove}
					className="ml-1 hover:bg-blue-200 rounded-full p-0.5 focus:outline-none"
					aria-label={`Remove ${person.name}`}
				>
					<X className="w-3 h-3" />
				</button>
			)}
		</span>
	);
}

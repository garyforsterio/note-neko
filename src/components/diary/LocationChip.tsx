"use client";

import type { Prisma } from "@prisma/client";
import { MapPin, X } from "lucide-react";

type DiaryLocation = Prisma.DiaryLocationCreateWithoutDiaryEntryInput;

interface LocationChipProps {
	location: DiaryLocation;
	onRemove?: () => void;
	onEdit?: (event: React.MouseEvent) => void;
	className?: string;
}

export default function LocationChip({
	location,
	onRemove,
	onEdit,
	className = "",
}: LocationChipProps) {
	return (
		<span
			className={`inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium transition-colors border border-emerald-100/50 ${className}`}
		>
			<MapPin size={14} className="opacity-70" />
			<button
				type="button"
				onClick={onEdit}
				className="hover:underline focus:outline-none hover:text-emerald-900"
			>
				{location.name}
			</button>
			{onRemove && (
				<button
					type="button"
					onClick={onRemove}
					className="ml-1 -mr-1 p-0.5 rounded-full hover:bg-emerald-200/50 text-emerald-600 hover:text-emerald-800 transition-colors focus:outline-none"
					aria-label={`Remove ${location.name}`}
				>
					<X size={14} />
				</button>
			)}
		</span>
	);
}

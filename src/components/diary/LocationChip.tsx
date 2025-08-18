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
			className={`inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm ${className}`}
		>
			<MapPin className="w-3 h-3" />
			<button
				type="button"
				onClick={onEdit}
				className="hover:underline focus:outline-none"
			>
				{location.name}
			</button>
			{onRemove && (
				<button
					type="button"
					onClick={onRemove}
					className="ml-1 hover:bg-green-200 rounded-full p-0.5 focus:outline-none"
					aria-label={`Remove ${location.name}`}
				>
					<X className="w-3 h-3" />
				</button>
			)}
		</span>
	);
}

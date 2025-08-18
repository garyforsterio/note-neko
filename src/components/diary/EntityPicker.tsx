"use client";

import type { Person, Prisma } from "@prisma/client";
import { MapPin, Search, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { type LocationResult, searchLocationsAction } from "#actions/locations";

type DiaryLocation = Prisma.DiaryLocationCreateWithoutDiaryEntryInput;

interface EntityPickerProps {
	type: "person" | "location";
	onSelect: (entity: Person | DiaryLocation) => void;
	onClose: () => void;
	people: Person[];
	position?: { top: number; left: number };
	initialQuery?: string;
}

export default function EntityPicker({
	type,
	onSelect,
	onClose,
	people,
	position,
	initialQuery = "",
}: EntityPickerProps) {
	const t = useTranslations();
	const [search, setSearch] = useState(initialQuery);
	const [results, setResults] = useState<(Person | DiaryLocation)[]>([]);
	const [loading, setLoading] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);
	const searchInputRef = useRef<HTMLInputElement>(null);

	// Search entities
	useEffect(() => {
		if (type === "person") {
			// For people, use local filtering
			const filtered = people.filter(
				(person) =>
					person.name.toLowerCase().includes(search.toLowerCase()) ||
					person.nickname?.toLowerCase().includes(search.toLowerCase()),
			);
			setResults(filtered);
		} else {
			// For locations, use Google Places search
			const searchLocations = async () => {
				if (!search.trim()) {
					setResults([]);
					return;
				}

				setLoading(true);
				try {
					const locationResults = await searchLocationsAction(search);
					// Convert LocationResult to DiaryLocation format
					const diaryLocations: DiaryLocation[] = locationResults.map(
						(loc) => ({
							name: loc.name,
							placeId: loc.placeId,
							lat: loc.lat,
							lng: loc.lng,
						}),
					);
					setResults(diaryLocations);
				} catch (error) {
					console.error("Error searching locations:", error);
					setResults([]);
				} finally {
					setLoading(false);
				}
			};

			// Debounce the search
			const timeoutId = setTimeout(searchLocations, 500);
			return () => clearTimeout(timeoutId);
		}
	}, [search, type, people]);

	// Focus search input on mount and trigger initial search if query provided
	useEffect(() => {
		searchInputRef.current?.focus();

		// If we have an initial query for locations, trigger the search immediately
		if (initialQuery && type === "location") {
			// The search useEffect will handle this when search state is set
		}
	}, [initialQuery, type]);

	// Close on click outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target as Node)
			) {
				onClose();
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [onClose]);

	// Close on escape key
	useEffect(() => {
		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				onClose();
			}
		};

		document.addEventListener("keydown", handleEscape);
		return () => document.removeEventListener("keydown", handleEscape);
	}, [onClose]);

	const handleSelect = (entity: Person | DiaryLocation) => {
		onSelect(entity);
		onClose();
	};

	const isPerson = (entity: Person | DiaryLocation): entity is Person => {
		return "userId" in entity;
	};

	return (
		<div
			ref={containerRef}
			className="absolute z-50 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-3"
			style={position}
		>
			<div className="flex items-center gap-2 mb-3">
				{type === "person" ? (
					<User className="w-4 h-4 text-gray-500" />
				) : (
					<MapPin className="w-4 h-4 text-gray-500" />
				)}
				<input
					ref={searchInputRef}
					type="text"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					placeholder={t(
						type === "person" ? "diary.searchPeople" : "diary.searchLocations",
					)}
					className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</div>

			<div className="max-h-48 overflow-y-auto">
				{loading ? (
					<div className="text-center py-4 text-sm text-gray-500">
						{t("common.loading")}
					</div>
				) : results.length === 0 ? (
					<div className="text-center py-4 text-sm text-gray-500">
						{t("common.noResults")}
					</div>
				) : (
					<div className="space-y-1">
						{results.map((entity, index) => (
							<button
								type="button"
								key={
									isPerson(entity) ? entity.id : `${entity.placeId}-${index}`
								}
								onClick={() => handleSelect(entity)}
								className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-100 rounded flex items-center gap-2"
							>
								{isPerson(entity) ? (
									<>
										<User className="w-4 h-4 text-gray-400" />
										<span>{entity.nickname || entity.name}</span>
									</>
								) : (
									<>
										<MapPin className="w-4 h-4 text-gray-400" />
										<span>{entity.name}</span>
									</>
								)}
							</button>
						))}
					</div>
				)}
			</div>
		</div>
	);
}

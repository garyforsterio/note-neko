"use client";

import type { Person, Prisma } from "@prisma/client";
import { useTranslations } from "next-intl";
import { useCallback, useMemo, useRef, useState } from "react";
import EntityPicker from "./EntityPicker";
import LocationChip from "./LocationChip";
import PersonChip from "./PersonChip";

type DiaryLocation = Prisma.DiaryLocationCreateWithoutDiaryEntryInput;

interface RefineEditorProps {
	content: string;
	people: Person[];
	locations: DiaryLocation[];
	allPeople: Person[];
	onChange: (content: string) => void;
	onEntitiesChange?: (people: Person[], locations: DiaryLocation[]) => void;
}

interface ContentSegment {
	type: "text" | "person" | "location";
	value: string;
	entity?: Person | DiaryLocation;
}

export default function RefineEditor({
	content,
	people,
	locations,
	allPeople,
	onChange,
	onEntitiesChange,
}: RefineEditorProps) {
	const t = useTranslations();
	const [selectedText, setSelectedText] = useState<{
		text: string;
		start: number;
		end: number;
	} | null>(null);
	const [showEntityPicker, setShowEntityPicker] = useState<{
		type: "person" | "location";
		position: { top: number; left: number };
		editingSegment?: ContentSegment;
		initialQuery?: string;
	} | null>(null);
	const contentRef = useRef<HTMLDivElement>(null);

	// Parse content into segments
	const segments = useMemo(() => {
		const result: ContentSegment[] = [];
		const regex = /\[(person|location):([^\]]+)\]/g;
		let lastIndex = 0;
		let match: RegExpExecArray | null;

		const peopleMap = new Map(people.map((p) => [p.id, p]));
		const locationsMap = new Map(locations.map((l) => [l.placeId, l]));

		match = regex.exec(content);
		while (match !== null) {
			// Add text before the match
			if (match.index > lastIndex) {
				result.push({
					type: "text",
					value: content.slice(lastIndex, match.index),
				});
			}

			// Add the entity reference
			const [fullMatch, type, id] = match;
			if (type === "person" && id) {
				const person = peopleMap.get(id);
				if (person) {
					result.push({
						type: "person",
						value: fullMatch,
						entity: person,
					});
				} else {
					// If person not found, treat as text
					result.push({ type: "text", value: fullMatch });
				}
			} else if (type === "location" && id) {
				const location = locationsMap.get(id);
				if (location) {
					result.push({
						type: "location",
						value: fullMatch,
						entity: location,
					});
				} else {
					// If location not found, treat as text
					result.push({ type: "text", value: fullMatch });
				}
			}

			lastIndex = match.index + fullMatch.length;
			match = regex.exec(content);
		}

		// Add remaining text
		if (lastIndex < content.length) {
			result.push({
				type: "text",
				value: content.slice(lastIndex),
			});
		}

		return result;
	}, [content, people, locations]);

	// Handle text selection
	const handleTextSelection = useCallback(() => {
		const selection = window.getSelection();
		if (!selection || selection.isCollapsed) {
			setSelectedText(null);
			return;
		}

		const text = selection.toString().trim();
		if (!text) {
			setSelectedText(null);
			return;
		}

		// For position-based replacement, we need to find where this text appears
		// in the raw content string. We'll use a different approach: track the
		// number of times this exact text has appeared before the current selection
		const range = selection.getRangeAt(0);
		const contentDiv = contentRef.current;

		if (!contentDiv) {
			setSelectedText(null);
			return;
		}

		// Find all text nodes before the selection start
		let textBeforeSelection = "";
		const walker = document.createTreeWalker(
			contentDiv,
			NodeFilter.SHOW_TEXT,
			null,
		);

		let currentNode = walker.nextNode();
		while (currentNode) {
			if (currentNode === range.startContainer) {
				// Add the text up to the selection start offset
				textBeforeSelection += (currentNode.textContent || "").substring(
					0,
					range.startOffset,
				);
				break;
			}
			// Add the entire text content of this node
			textBeforeSelection += currentNode.textContent || "";
			currentNode = walker.nextNode();
		}

		// Now find the position in the actual content string
		// by counting occurrences of the selected text that appear before this position
		const escapedText = text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		const beforeMatches = (
			textBeforeSelection.match(new RegExp(escapedText, "g")) || []
		).length;

		// Find the nth occurrence of the selected text in the content
		let searchFrom = 0;
		let contentPosition = -1;
		for (let i = 0; i <= beforeMatches; i++) {
			contentPosition = content.indexOf(text, searchFrom);
			if (contentPosition === -1) break;
			searchFrom = contentPosition + 1;
		}

		if (contentPosition === -1) {
			// Fallback: just find the first occurrence
			contentPosition = content.indexOf(text);
		}

		setSelectedText({
			text,
			start: contentPosition,
			end: contentPosition + text.length,
		});
	}, [content]);

	// Remove entity
	const handleRemoveEntity = useCallback(
		(segment: ContentSegment) => {
			const replacementText =
				segment.entity && "name" in segment.entity ? segment.entity.name : "";
			const newContent = content.replace(segment.value, replacementText);
			onChange(newContent);

			// Note: Entity removal from arrays is handled automatically by the server action
			// based on what's actually referenced in the content
		},
		[content, onChange],
	);

	// Add or replace entity reference
	const handleAddEntity = useCallback(
		(entity: Person | DiaryLocation) => {
			const isPerson = "userId" in entity;
			const replacement = isPerson
				? `[person:${entity.id}]`
				: `[location:${entity.placeId}]`;

			if (showEntityPicker?.editingSegment) {
				// Replace existing entity
				const newContent = content.replace(
					showEntityPicker.editingSegment.value,
					replacement,
				);
				onChange(newContent);

				// Update the people/locations arrays if needed for consistency
				if (onEntitiesChange && showEntityPicker.editingSegment) {
					if (isPerson) {
						// Update people array
						const newPeople = people.filter(
							(p) =>
								p.id !==
								(showEntityPicker.editingSegment?.entity as Person)?.id,
						);
						newPeople.push(entity as Person);
						onEntitiesChange(newPeople, locations);
					} else {
						// Update locations array
						const newLocations = locations.filter(
							(l) =>
								l.placeId !==
								(showEntityPicker.editingSegment?.entity as DiaryLocation)
									?.placeId,
						);
						newLocations.push(entity as DiaryLocation);
						onEntitiesChange(people, newLocations);
					}
				}
			} else if (selectedText) {
				// Replace the specific selected text using position-based replacement
				const beforeSelection = content.substring(0, selectedText.start);
				const afterSelection = content.substring(selectedText.end);
				const newContent = beforeSelection + replacement + afterSelection;
				onChange(newContent);

				// Also update the entities arrays so the chip renders immediately
				if (onEntitiesChange) {
					if (isPerson) {
						// Add person to people array if not already there
						const personExists = people.some(
							(p) => p.id === (entity as Person).id,
						);
						if (!personExists) {
							onEntitiesChange([...people, entity as Person], locations);
						}
					} else {
						// Add location to locations array if not already there
						const locationExists = locations.some(
							(l) => l.placeId === (entity as DiaryLocation).placeId,
						);
						if (!locationExists) {
							onEntitiesChange(people, [...locations, entity as DiaryLocation]);
						}
					}
				}

				setSelectedText(null);
			}

			setShowEntityPicker(null);
		},
		[
			content,
			onChange,
			selectedText,
			showEntityPicker,
			people,
			locations,
			onEntitiesChange,
		],
	);

	// Show entity picker for editing an existing entity
	const handleEditEntity = useCallback(
		(segment: ContentSegment, event: React.MouseEvent) => {
			event.stopPropagation();
			const contentRect = contentRef.current?.getBoundingClientRect();
			const targetRect = (
				event.currentTarget as HTMLElement
			).getBoundingClientRect();

			if (contentRect) {
				setShowEntityPicker({
					type: segment.type as "person" | "location",
					position: {
						top: targetRect.bottom - contentRect.top + 5,
						left: targetRect.left - contentRect.left,
					},
					editingSegment: segment,
					initialQuery: segment.entity?.name || "",
				});
			}
		},
		[],
	);

	// Show entity picker for marking selected text
	const handleMarkAs = useCallback(
		(type: "person" | "location") => {
			if (!selectedText) return;

			const rect = window.getSelection()?.getRangeAt(0).getBoundingClientRect();
			const contentRect = contentRef.current?.getBoundingClientRect();

			if (rect && contentRect) {
				setShowEntityPicker({
					type,
					position: {
						top: rect.bottom - contentRect.top + 10,
						left: rect.left - contentRect.left,
					},
					initialQuery: selectedText.text,
				});
			}
		},
		[selectedText],
	);

	return (
		<div className="relative">
			<div
				ref={contentRef}
				className="min-h-[400px] p-4 border border-gray-300 rounded-md bg-white prose max-w-none"
				onMouseUp={handleTextSelection}
				onTouchEnd={handleTextSelection}
			>
				{segments.map((segment, index) => {
					if (segment.type === "text") {
						return (
							<span
								key={`text-${index}-${segment.value.slice(0, 10)}`}
								className="whitespace-pre-wrap"
							>
								{segment.value}
							</span>
						);
					}
					if (segment.type === "person" && segment.entity) {
						return (
							<PersonChip
								key={`person-${(segment.entity as Person).id}`}
								person={segment.entity as Person}
								onRemove={() => handleRemoveEntity(segment)}
								onEdit={(e) => handleEditEntity(segment, e)}
								className="mx-1"
							/>
						);
					}
					if (segment.type === "location" && segment.entity) {
						return (
							<LocationChip
								key={`location-${(segment.entity as DiaryLocation).placeId}`}
								location={segment.entity as DiaryLocation}
								onRemove={() => handleRemoveEntity(segment)}
								onEdit={(e) => handleEditEntity(segment, e)}
								className="mx-1"
							/>
						);
					}
					return null;
				})}
			</div>

			{/* Selection Actions */}
			{selectedText && (
				<div className="mt-2 flex gap-2">
					<button
						type="button"
						onClick={() => handleMarkAs("person")}
						className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
					>
						{t("diary.markAsPerson")}
					</button>
					<button
						type="button"
						onClick={() => handleMarkAs("location")}
						className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
					>
						{t("diary.markAsLocation")}
					</button>
				</div>
			)}

			{/* Entity Picker */}
			{showEntityPicker && (
				<EntityPicker
					type={showEntityPicker.type}
					onSelect={handleAddEntity}
					onClose={() => setShowEntityPicker(null)}
					people={allPeople}
					position={showEntityPicker.position}
					initialQuery={showEntityPicker.initialQuery}
				/>
			)}
		</div>
	);
}

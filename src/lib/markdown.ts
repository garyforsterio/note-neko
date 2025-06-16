import type { Person, Prisma } from "@prisma/client";
import { getGoogleMapsUrl } from "./utils/maps";

export function renderMarkdown(
	content: string,
	mentions?: Person[],
	locations?: Prisma.DiaryLocationCreateWithoutDiaryEntryInput[],
) {
	let transformedContent = content;
	// Replace person mentions with markdown links
	for (const person of mentions ?? []) {
		transformedContent = transformedContent.replace(
			new RegExp(`\\[person:${person.id}\\]`, "g"),
			`[${person.nickname || person.name}](/en/people/${person.id})`,
		);
	}

	// Replace location mentions with markdown links
	for (const location of locations ?? []) {
		transformedContent = transformedContent.replace(
			new RegExp(`\\[location:${location.placeId}\\]`, "g"),
			`[${location.name}](${getGoogleMapsUrl(
				location.placeId,
				location.lat,
				location.lng,
			)})`,
		);
	}

	return transformedContent;
}

export function renderShareMarkdown(
	content: string,
	mentions?: Person[],
	locations?: Prisma.DiaryLocationCreateWithoutDiaryEntryInput[],
) {
	let transformedContent = content;
	// Replace person mentions with name
	for (const person of mentions ?? []) {
		transformedContent = transformedContent.replace(
			new RegExp(`\\[person:${person.id}\\]`, "g"),
			`${person.nickname || person.name}`,
		);
	}

	// Replace location mentions with name
	for (const location of locations ?? []) {
		transformedContent = transformedContent.replace(
			new RegExp(`\\[location:${location.placeId}\\]`, "g"),
			`${location.name}`,
		);
	}

	return transformedContent;
}

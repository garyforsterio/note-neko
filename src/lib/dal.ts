import type { Prisma } from "@prisma/client";
import { unstable_cacheTag as cacheTag, revalidateTag } from "next/cache";
import { cache } from "react";
import { requireAuth } from "#lib/auth";
import { db } from "#lib/db";

export interface PersonData {
	id?: string;
	name: string;
	nickname?: string;
	birthday?: string;
	howWeMet?: string;
	interests: string[];
	notes?: string;
}

export interface DiaryData {
	content: string;
	date: string;
	mentions: string[];
	locations?: Array<{
		name: string;
		placeId: string;
		lat: number;
		lng: number;
	}>;
}

type PersonWithMentions = Prisma.PersonGetPayload<{
	include: {
		mentions: {
			include: {
				diaryEntry: {
					include: {
						mentions: {
							include: {
								person: true;
							};
						};
						locations: true;
					};
				};
			};
		};
	};
}>;

export type DiaryEntryWithRelations = Prisma.DiaryEntryGetPayload<{
	include: {
		mentions: {
			include: {
				person: true;
			};
		};
		locations: true;
	};
}>;

async function getPeopleCached(userId: string) {
	"use cache";
	cacheTag("people");
	return db.person.findMany({
		where: { userId },
		orderBy: { name: "asc" },
		include: {
			mentions: {
				include: {
					diaryEntry: {
						include: {
							mentions: {
								include: {
									person: true,
								},
							},
							locations: true,
						},
					},
				},
			},
		},
	});
}

export const getPeople = cache(async (): Promise<PersonWithMentions[]> => {
	const user = await requireAuth();
	return getPeopleCached(user.id);
});

async function getPersonCached(userId: string, id: string) {
	"use cache";
	cacheTag("person");
	return db.person.findFirst({
		where: { id, userId },
		include: {
			mentions: {
				include: {
					diaryEntry: {
						include: {
							mentions: {
								include: {
									person: true,
								},
							},
							locations: true,
						},
					},
				},
			},
		},
	});
}

export const getPerson = cache(
	async (id: string): Promise<PersonWithMentions | null> => {
		const user = await requireAuth();
		return getPersonCached(user.id, id);
	},
);

export async function createPerson(data: PersonData) {
	const user = await requireAuth();
	return db.person.create({
		data: {
			name: data.name,
			nickname: data.nickname,
			birthday: data.birthday ? new Date(data.birthday) : null,
			howWeMet: data.howWeMet,
			interests: data.interests,
			notes: data.notes,
			userId: user.id,
		},
	});
}

export async function updatePerson(id: string, data: PersonData) {
	const user = await requireAuth();
	revalidateTag("person");
	return db.person.update({
		where: { id, userId: user.id },
		data: {
			name: data.name,
			nickname: data.nickname,
			birthday: data.birthday ? new Date(data.birthday) : null,
			howWeMet: data.howWeMet,
			interests: data.interests,
			notes: data.notes,
			userId: user.id,
		},
	});
}

export async function deletePerson(id: string) {
	const user = await requireAuth();
	revalidateTag("person");
	return db.person.delete({
		where: { id, userId: user.id },
	});
}

export interface DiaryEntriesOptions {
	page?: number;
	pageSize?: number;
	startDate?: Date;
	endDate?: Date;
}

async function getDiaryEntriesCached(
	userId: string,
	options: DiaryEntriesOptions,
) {
	"use cache";
	cacheTag("diaryEntries");
	const { page = 1, pageSize = 10, startDate, endDate } = options;

	const where = {
		userId,
		...(startDate && endDate
			? {
					date: {
						gte: startDate,
						lte: endDate,
					},
				}
			: {}),
	};

	const [entries, total] = await Promise.all([
		db.diaryEntry.findMany({
			where,
			orderBy: { date: "desc" },
			skip: (page - 1) * pageSize,
			take: pageSize,
			include: {
				mentions: {
					include: {
						person: true,
					},
				},
				locations: true,
			},
		}),
		db.diaryEntry.count({ where }),
	]);

	return { entries, total };
}

export const getDiaryEntries = cache(
	async (
		options: DiaryEntriesOptions = {},
	): Promise<{
		entries: DiaryEntryWithRelations[];
		total: number;
	}> => {
		const user = await requireAuth();
		return getDiaryEntriesCached(user.id, options);
	},
);

async function getDiaryEntryCached(userId: string, id: string) {
	"use cache";
	cacheTag("diaryEntry");
	return db.diaryEntry.findFirst({
		where: { id, userId },
		include: {
			mentions: {
				include: {
					person: true,
				},
			},
			locations: true,
		},
	});
}

export const getDiaryEntry = cache(
	async (id: string): Promise<DiaryEntryWithRelations | null> => {
		const user = await requireAuth();
		return getDiaryEntryCached(user.id, id);
	},
);

export async function createDiaryEntry(data: DiaryData) {
	const user = await requireAuth();
	revalidateTag("diaryEntry");
	return db.diaryEntry.create({
		data: {
			content: data.content,
			date: new Date(data.date),
			userId: user.id,
			mentions: {
				create: data.mentions?.map((personId) => ({
					person: {
						connect: { id: personId },
					},
				})),
			},
			locations: {
				create: data.locations?.map((location) => ({
					name: location.name,
					placeId: location.placeId,
					lat: location.lat,
					lng: location.lng,
				})),
			},
		},
		include: {
			mentions: {
				include: {
					person: true,
				},
			},
			locations: true,
		},
	});
}

export async function updateDiaryEntry(id: string, data: DiaryData) {
	const user = await requireAuth();
	revalidateTag("diaryEntry");
	// First, delete all existing mentions and locations
	await db.diaryMention.deleteMany({
		where: { diaryEntryId: id },
	});
	await db.diaryLocation.deleteMany({
		where: { diaryEntryId: id },
	});

	// Then update the entry with new data
	return db.diaryEntry.update({
		where: { id },
		data: {
			content: data.content,
			date: new Date(data.date),
			userId: user.id,
			mentions: {
				create: data.mentions?.map((personId) => ({
					person: {
						connect: { id: personId },
					},
				})),
			},
			locations: {
				create: data.locations?.map((location) => ({
					name: location.name,
					placeId: location.placeId,
					lat: location.lat,
					lng: location.lng,
				})),
			},
		},
		include: {
			mentions: {
				include: {
					person: true,
				},
			},
			locations: true,
		},
	});
}

export async function deleteDiaryEntry(id: string) {
	const user = await requireAuth();
	revalidateTag("diaryEntry");
	return db.diaryEntry.delete({
		where: { id, userId: user.id },
	});
}

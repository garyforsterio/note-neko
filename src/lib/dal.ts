import type { Prisma } from "@prisma/client";
import { cache } from "react";
import { requireAuth } from "#lib/auth";
import { db } from "#lib/db";

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
	const { userId } = await requireAuth();
	return getPeopleCached(userId);
});

async function getPersonCached(userId: string, id: string) {
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
		const { userId } = await requireAuth();
		return getPersonCached(userId, id);
	},
);

export async function createPerson(data: Prisma.PersonCreateWithoutUserInput) {
	const { userId } = await requireAuth();
	return db.person.create({
		data: {
			name: data.name,
			nickname: data.nickname,
			birthday: data.birthday,
			howWeMet: data.howWeMet,
			interests: data.interests,
			notes: data.notes,
			userId: userId,
		},
	});
}

export async function updatePerson(
	id: string,
	data: Omit<Prisma.PersonUpdateInput, "user">,
) {
	const { userId } = await requireAuth();
	return db.person.update({
		where: { id, userId: userId },
		data: {
			name: data.name,
			nickname: data.nickname,
			birthday: data.birthday,
			howWeMet: data.howWeMet,
			interests: data.interests,
			notes: data.notes,
			userId: userId,
		},
	});
}

export async function deletePerson(id: string) {
	const { userId } = await requireAuth();
	return db.person.delete({
		where: { id, userId: userId },
	});
}

export interface DiaryEntriesOptions {
	page?: number;
	pageSize?: number;
	startDate?: Date;
	endDate?: Date;
	sortOrder?: "asc" | "desc";
}

async function getDiaryEntriesCached(
	userId: string,
	options: DiaryEntriesOptions,
) {
	const {
		page = 1,
		pageSize = 10,
		startDate,
		endDate,
		sortOrder = "desc",
	} = options;

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
			orderBy: { date: sortOrder },
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
		const { userId } = await requireAuth();
		return getDiaryEntriesCached(userId, options);
	},
);

async function getDiaryEntryCached(userId: string, id: string) {
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
		const { userId } = await requireAuth();
		return getDiaryEntryCached(userId, id);
	},
);

async function getAllDiaryIdsCached(userId: string) {
	return db.diaryEntry.findMany({
		where: { userId },
		select: { id: true, date: true },
	});
}

export const getAllDiaryIds = cache(async () => {
	const { userId } = await requireAuth();
	return getAllDiaryIdsCached(userId);
});

export async function createDiaryEntry({
	content,
	date,
	mentions,
	locations,
}: {
	content: string;
	date: Date;
	mentions: string[];
	locations: Prisma.DiaryLocationCreateWithoutDiaryEntryInput[];
}) {
	const { userId } = await requireAuth();
	return db.diaryEntry.create({
		data: {
			content,
			date,
			userId: userId,
			mentions: {
				create: mentions.map((personId) => ({
					person: {
						connect: { id: personId },
					},
				})),
			},
			locations: {
				create: locations.map((location) => ({
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

export async function updateDiaryEntry(
	id: string,
	{
		content,
		date,
		mentions,
		locations,
	}: {
		content: string;
		date: Date;
		mentions: string[];
		locations: Prisma.DiaryLocationCreateWithoutDiaryEntryInput[];
	},
) {
	const { userId } = await requireAuth();
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
			content,
			date,
			userId: userId,
			mentions: {
				create: mentions.map((personId) => ({
					person: {
						connect: { id: personId },
					},
				})),
			},
			locations: {
				create: locations.map((location) => ({
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
	const { userId } = await requireAuth();
	return db.diaryEntry.delete({
		where: { id, userId: userId },
	});
}

import { cache } from "react";
import type { Prisma } from "#generated/prisma";
import { requireAuth } from "#lib/auth";
import { db } from "#lib/db";

export type DiaryEntryWithRelations = Prisma.DiaryEntryGetPayload<{
	include: {
		mentions: {
			include: {
				person: true;
			};
		};
		locations: true;
		conversations: true;
	};
}>;

async function getPeopleCached(userId: string, query?: string) {
	const where: Prisma.PersonWhereInput = {
		userId,
		...(query
			? {
					OR: [
						{ name: { contains: query, mode: "insensitive" } },
						{ nickname: { contains: query, mode: "insensitive" } },
						{ notes: { contains: query, mode: "insensitive" } },
					],
				}
			: {}),
	};

	return db.person.findMany({
		where,
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
							conversations: true,
						},
					},
				},
			},
		},
	});
}

export type PersonWithMentions = Awaited<
	ReturnType<typeof getPeopleCached>
>[number];

export const getPeople = cache(
	async (query?: string): Promise<PersonWithMentions[]> => {
		const { userId } = await requireAuth();
		return getPeopleCached(userId, query);
	},
);

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
							conversations: true,
						},
					},
				},
			},
			conversations: {
				orderBy: { createdAt: "desc" },
				include: {
					diaryEntry: true,
				},
			},
			relationshipsAsFrom: {
				include: { toPerson: true },
			},
			relationshipsAsTo: {
				include: { fromPerson: true },
			},
		},
	});
}

export type PersonDetail = Awaited<ReturnType<typeof getPersonCached>>;

export const getPerson = cache(
	async (id: string): Promise<PersonDetail | null> => {
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
				conversations: true,
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
			conversations: true,
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

export const getUnreviewedDiaryCount = cache(async (): Promise<number> => {
	const { userId } = await requireAuth();
	return db.diaryEntry.count({
		where: { userId, processed: true, reviewed: false },
	});
});

export const getUnreviewedDiaryEntries = cache(async () => {
	const { userId } = await requireAuth();
	return db.diaryEntry.findMany({
		where: { userId, processed: true, reviewed: false },
		orderBy: { date: "desc" },
	});
});

export const getUnprocessedDiaryCount = cache(async (): Promise<number> => {
	const { userId } = await requireAuth();
	return db.diaryEntry.count({
		where: { userId, processed: false },
	});
});

export const getUnprocessedDiaryIds = cache(
	async (): Promise<{ id: string }[]> => {
		const { userId } = await requireAuth();
		return db.diaryEntry.findMany({
			where: { userId, processed: false },
			select: { id: true },
			orderBy: { date: "asc" },
		});
	},
);

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
		processed,
		reviewed,
	}: {
		content: string;
		date: Date;
		mentions: string[];
		locations: Prisma.DiaryLocationCreateWithoutDiaryEntryInput[];
		processed?: boolean;
		reviewed?: boolean;
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
			...(processed !== undefined && { processed }),
			...(reviewed !== undefined && { reviewed }),
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

// User Profile related functions
export const getUserProfile = cache(async () => {
	const { userId } = await requireAuth();
	return db.user.findUnique({
		where: { id: userId },
		select: {
			id: true,
			email: true,
			defaultLocationPlaceId: true,
			defaultLocationName: true,
			defaultLocationLat: true,
			defaultLocationLng: true,
		},
	});
});

export async function updateUserDefaultLocation(data: {
	placeId: string | null;
	name: string | null;
	lat: number | null;
	lng: number | null;
}) {
	const { userId } = await requireAuth();
	return db.user.update({
		where: { id: userId },
		data: {
			defaultLocationPlaceId: data.placeId,
			defaultLocationName: data.name,
			defaultLocationLat: data.lat,
			defaultLocationLng: data.lng,
		},
	});
}

// Helper to get simple person list for entity extraction
export async function getSimplePeopleList() {
	const { userId } = await requireAuth();
	return db.person.findMany({
		where: { userId },
		select: { id: true, name: true, nickname: true },
	});
}

// Conversation related functions
export async function createConversation({
	diaryEntryId,
	personId,
	content,
}: {
	diaryEntryId: string;
	personId: string;
	content: string;
}) {
	const { userId } = await requireAuth();
	return db.conversation.create({
		data: {
			content,
			diaryEntryId,
			personId,
			userId,
		},
	});
}

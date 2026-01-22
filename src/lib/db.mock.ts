import { type DeepMockProxy, mockDeep, mockReset } from "vitest-mock-extended";
import { Prisma, type PrismaClient } from "#generated/prisma";

export type MockPrismaClient = DeepMockProxy<PrismaClient>;

// In-memory store for mock data
type Store = {
	user: Map<string, Record<string, unknown>>;
	person: Map<string, Record<string, unknown>>;
	diaryEntry: Map<string, Record<string, unknown>>;
	diaryMention: Map<string, Record<string, unknown>>;
	diaryLocation: Map<string, Record<string, unknown>>;
	conversation: Map<string, Record<string, unknown>>;
	suggestion: Map<string, Record<string, unknown>>;
	relationship: Map<string, Record<string, unknown>>;
	refreshToken: Map<string, Record<string, unknown>>;
};

let store: Store = createEmptyStore();

function createEmptyStore(): Store {
	return {
		user: new Map(),
		person: new Map(),
		diaryEntry: new Map(),
		diaryMention: new Map(),
		diaryLocation: new Map(),
		conversation: new Map(),
		suggestion: new Map(),
		relationship: new Map(),
		refreshToken: new Map(),
	};
}

function generateId(): string {
	return Math.random().toString(36).substring(2, 15);
}

function processCreateData(
	modelName: keyof Store,
	data: Record<string, unknown>,
): Record<string, unknown> {
	const result: Record<string, unknown> = {
		id: (data.id as string) || generateId(),
		createdAt: new Date(),
		updatedAt: new Date(),
	};

	for (const [key, value] of Object.entries(data)) {
		if (key === "connect" || key === "create") continue;

		if (
			value &&
			typeof value === "object" &&
			"connect" in (value as Record<string, unknown>)
		) {
			// Handle relation connect
			const connect = (value as Record<string, unknown>).connect as Record<
				string,
				unknown
			>;
			result[`${key}Id`] = connect.id;
		} else if (
			value &&
			typeof value === "object" &&
			"create" in (value as Record<string, unknown>)
		) {
			// Handle nested create - simplified, just store the relation
			const createData = (value as Record<string, unknown>).create;
			if (Array.isArray(createData)) {
				// Handle array of creates (e.g., locations)
				for (const item of createData) {
					const nestedModel = key.replace(/s$/, "") as keyof Store;
					if (store[nestedModel]) {
						const nestedRecord = processCreateData(
							nestedModel,
							item as Record<string, unknown>,
						);
						(nestedRecord as Record<string, unknown>)[
							`${modelName.replace(/y$/, "i").replace(/Entry/, "entry")}Id`
						] = result.id;
						store[nestedModel].set(nestedRecord.id as string, nestedRecord);
					}
				}
			} else {
				const nestedModel = key as keyof Store;
				if (store[nestedModel]) {
					const nestedRecord = processCreateData(
						nestedModel,
						createData as Record<string, unknown>,
					);
					store[nestedModel].set(nestedRecord.id as string, nestedRecord);
				}
			}
		} else {
			result[key] = value;
		}
	}

	return result;
}

function setupMockMethods(mockDb: MockPrismaClient) {
	const models = [
		"user",
		"person",
		"diaryEntry",
		"diaryMention",
		"diaryLocation",
		"conversation",
		"suggestion",
		"relationship",
		"refreshToken",
	] as const;

	for (const modelName of models) {
		const model = mockDb[modelName];

		// Mock create
		// @ts-expect-error Mock implementation doesn't match exact Prisma types
		model.create.mockImplementation(async (args: { data: unknown }) => {
			const record = processCreateData(
				modelName,
				args.data as Record<string, unknown>,
			);
			store[modelName].set(record.id as string, record);
			return record;
		});

		// Mock findMany
		// @ts-expect-error Mock implementation doesn't match exact Prisma types
		model.findMany.mockImplementation(async () => {
			return Array.from(store[modelName].values());
		});

		// Mock findUnique
		// biome-ignore lint/suspicious/noExplicitAny: Mock implementation
		(model.findUnique.mockImplementation as any)(
			async (args: { where: { id?: string } }) => {
				if (args.where.id) {
					return store[modelName].get(args.where.id) || null;
				}
				return null;
			},
		);

		// Mock findFirst
		// @ts-expect-error Mock implementation doesn't match exact Prisma types
		model.findFirst.mockImplementation(async () => {
			const values = Array.from(store[modelName].values());
			return values[0] || null;
		});

		// Mock update
		// biome-ignore lint/suspicious/noExplicitAny: Mock implementation
		(model.update.mockImplementation as any)(
			async (args: { where: { id: string }; data: unknown }) => {
				const existing = store[modelName].get(args.where.id);
				if (existing) {
					const updated = {
						...existing,
						...(args.data as Record<string, unknown>),
						updatedAt: new Date(),
					};
					store[modelName].set(args.where.id, updated);
					return updated;
				}
				return null;
			},
		);

		// Mock delete
		// biome-ignore lint/suspicious/noExplicitAny: Mock implementation
		(model.delete.mockImplementation as any)(
			async (args: { where: { id: string } }) => {
				const existing = store[modelName].get(args.where.id);
				store[modelName].delete(args.where.id);
				return existing;
			},
		);

		// Mock count
		// @ts-expect-error Mock implementation doesn't match exact Prisma types
		model.count.mockImplementation(async () => {
			return store[modelName].size;
		});
	}
}

const createPrismaClientMock = (): MockPrismaClient => {
	const mock = mockDeep<PrismaClient>();
	setupMockMethods(mock);
	return mock;
};

export const db: MockPrismaClient = createPrismaClientMock();

export function initializeDB() {
	store = createEmptyStore();
	mockReset(db);
	setupMockMethods(db);

	// Mock PrismaClientKnownRequestError for browser environments (Storybook)
	// @ts-ignore This Error class is not loaded properly in the browser
	Prisma.PrismaClientKnownRequestError = class PrismaClientKnownRequestError extends (
		Error
	) {
		code: string;
		meta?: Record<string, unknown>;
		clientVersion: string;

		constructor(
			message: string,
			{ code, meta }: { code: string; meta?: Record<string, unknown> },
		) {
			super(message);
			this.code = code;
			this.meta = meta;
			this.clientVersion = "7.2.0";
		}
	};
}

export function resetDB() {
	store = createEmptyStore();
	mockReset(db);
	setupMockMethods(db);
}

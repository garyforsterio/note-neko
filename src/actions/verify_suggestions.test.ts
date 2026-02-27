import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";

// Skip integration tests if POSTGRES_URL_NON_POOLING is not set
const skipIntegrationTests = !process.env.POSTGRES_URL_NON_POOLING;

// Dynamic import to avoid PrismaClient initialization errors when POSTGRES_URL_NON_POOLING is not set
const { db } = skipIntegrationTests
	? { db: null as never }
	: await import("#lib/db");
const { generatePersonSuggestions, resolveSuggestion } = skipIntegrationTests
	? {
			generatePersonSuggestions: null as never,
			resolveSuggestion: null as never,
		}
	: await import("./suggestions");

const TEST_USER_ID = `test-user-${Date.now()}`;

// Mock requireAuth
vi.mock("#lib/auth", () => ({
	requireAuth: async () => ({ userId: TEST_USER_ID }),
}));

// Mock revalidatePath to avoid next cache errors
vi.mock("next/cache", () => ({
	revalidatePath: vi.fn(),
}));

// Mock LLM to return deterministic result
vi.mock("#lib/llm", () => ({
	generateJSON: async () => ({
		suggestions: [
			{
				type: "ADD_RELATIONSHIP",
				relatedPersonId: "person-b-id",
				relationshipType: "friend",
				reasoning: "They said they became friends.",
			},
		],
	}),
}));

describe.skipIf(skipIntegrationTests)("Suggestions Logic", () => {
	const userId = TEST_USER_ID;
	const userEmail = `test-${Date.now()}@example.com`;
	let personAId: string;
	let personBId: string;
	beforeEach(async () => {
		// Setup
		// Create User
		await db.user.upsert({
			where: { id: userId },
			update: {},
			create: { id: userId, email: userEmail, passwordHash: "hash" },
		});

		const personA = await db.person.create({
			data: { userId, name: "Person A" },
		});
		personAId = personA.id;

		// Force ID for Person B to match mock LLM output if possible,
		// OR update mock LLM dynamically.
		// Since vi.mock is hoisted, we can't easily change return value per test simply without factory.
		// Actually, we can use vi.mocked(...).mockResolvedValue(...) if we import the mock.

		// Better: Let's create Person B first, then update the mock?
		// Limitation: verifying the logic that USES the DB data. Be careful.

		// Workaround: Create Person B with specific ID if possible, or use 'person-b-id' as ID.
		const personB = await db.person.upsert({
			where: { id: "person-b-id" },
			update: { userId, name: "Person B" },
			create: { id: "person-b-id", userId, name: "Person B" },
		});
		personBId = personB.id;

		const diary = await db.diaryEntry.create({
			data: { userId, content: `Met [person:${personBId}]`, date: new Date() },
		});

		await db.conversation.create({
			data: {
				userId,
				diaryEntryId: diary.id,
				personId: personAId,
				content: `Met [person:${personBId}]`,
			},
		});
	});

	afterAll(async () => {
		// Cleanup
		await db.relationship.deleteMany({ where: { userId } });
		await db.suggestion.deleteMany({ where: { userId } });
		await db.conversation.deleteMany({ where: { userId } });
		await db.diaryEntry.deleteMany({ where: { userId } });
		await db.person.deleteMany({ where: { userId } });
		await db.user.delete({ where: { id: userId } }).catch(() => {});
	});

	it("should generate suggestions with relatedPersonId", async () => {
		const suggestions = await generatePersonSuggestions(personAId);

		expect(suggestions).toHaveLength(1);
		expect(suggestions[0]?.type).toBe("ADD_RELATIONSHIP");
		expect(suggestions[0]?.relatedPersonId).toBe(personBId);
		expect(suggestions[0]?.status).toBe("PENDING");
	});

	it("should resolve suggestion and create relationship", async () => {
		// Create pending suggestion manually or via generate
		// Let's use clean state from generate
		const suggestions = await generatePersonSuggestions(personAId);
		const suggestion = suggestions[0];

		if (!suggestion) throw new Error("No suggestion found");

		await resolveSuggestion(suggestion.id, true);

		const rel = await db.relationship.findFirst({
			where: { fromPersonId: personAId, toPersonId: personBId },
		});

		expect(rel).toBeDefined();
		expect(rel?.type).toBe("friend");

		const updatedSuggestion = await db.suggestion.findUnique({
			where: { id: suggestion.id },
		});
		expect(updatedSuggestion?.status).toBe("ACCEPTED");
	});
});

import { PrismaClient } from "#generated/prisma";

const createPrismaClient = () =>
	new PrismaClient({
		accelerateUrl: process.env.DATABASE_URL,
		log:
			process.env.NODE_ENV === "development"
				? ["query", "error", "warn"]
				: ["error"],
	});

const globalForPrisma = global as unknown as {
	prisma: ReturnType<typeof createPrismaClient>;
};

export const db = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

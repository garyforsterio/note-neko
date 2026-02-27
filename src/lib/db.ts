import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "#generated/prisma";

let connectionString = process.env.POSTGRES_PRISMA_URL;

if (process.env.NODE_ENV !== "production" && connectionString) {
	// The `pg` package enforces strict SSL verification if `sslmode=require` is present in the URL,
	// which causes "self-signed certificate in certificate chain" errors with Supabase in local dev.
	// We strip it here so our custom `ssl` config below is respected.
	connectionString = connectionString
		.replace("?sslmode=require&", "?")
		.replace("&sslmode=require", "")
		.replace("?sslmode=require", "");
}

const pool = new Pool({
	connectionString,
	// Bypass self-signed cert errors often seen with Supabase's connection pooler in Node.js dev environments
	ssl:
		process.env.NODE_ENV === "production"
			? true
			: { rejectUnauthorized: false },
});
const adapter = new PrismaPg(pool);

const createPrismaClient = () =>
	new PrismaClient({
		adapter,
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

import { describe, expect, it } from "vitest";
import { calculateMissingDiaryStats, getNextDayString } from "./diary";

describe("calculateMissingDiaryStats", () => {
	it("should return 0 missing count if latest entry is today", () => {
		const now = new Date("2024-03-15T12:00:00Z");
		const latestEntry = new Date("2024-03-15T10:00:00Z");

		const result = calculateMissingDiaryStats(latestEntry, now);

		expect(result).toEqual({
			missingCount: 0,
			nextMissingDate: undefined,
		});
	});

	it("should return 1 missing count if latest entry is yesterday", () => {
		const now = new Date("2024-03-15T12:00:00Z");
		const latestEntry = new Date("2024-03-14T10:00:00Z");

		const result = calculateMissingDiaryStats(latestEntry, now);

		expect(result).toEqual({
			missingCount: 1,
			nextMissingDate: "2024-03-15",
		});
	});

	it("should return correct count for multiple days gap", () => {
		const now = new Date("2024-03-15T12:00:00Z");
		const latestEntry = new Date("2024-03-11T10:00:00Z");

		const result = calculateMissingDiaryStats(latestEntry, now);

		expect(result).toEqual({
			missingCount: 4,
			nextMissingDate: "2024-03-12",
		});
	});

	it("should handle month boundaries", () => {
		const now = new Date("2024-04-02T12:00:00Z");
		const latestEntry = new Date("2024-03-31T10:00:00Z");

		const result = calculateMissingDiaryStats(latestEntry, now);

		expect(result).toEqual({
			missingCount: 2, // 1st, 2nd
			nextMissingDate: "2024-04-01",
		});
	});

	it("should ignore time components and compare UTC dates", () => {
		// Latest entry late in the day vs today early in the day
		const now = new Date("2024-03-15T01:00:00Z");
		const latestEntry = new Date("2024-03-14T23:00:00Z");

		// Even though they are only 2 hours apart, they are different UTC days.
		const result = calculateMissingDiaryStats(latestEntry, now);

		expect(result).toEqual({
			missingCount: 1,
			nextMissingDate: "2024-03-15",
		});
	});

	it("should return 0 if latest entry is in the future (should not happen but good for safety)", () => {
		const now = new Date("2024-03-15T12:00:00Z");
		const latestEntry = new Date("2024-03-16T10:00:00Z");

		const result = calculateMissingDiaryStats(latestEntry, now);

		expect(result).toEqual({
			missingCount: 0,
			nextMissingDate: undefined,
		});
	});
});

describe("getNextDayString", () => {
	it("should correctly increment a date within the same month", () => {
		expect(getNextDayString("2024-01-15")).toBe("2024-01-16");
	});

	it("should correctly handle month rollover", () => {
		expect(getNextDayString("2024-01-31")).toBe("2024-02-01");
	});

	it("should correctly handle year rollover", () => {
		expect(getNextDayString("2024-12-31")).toBe("2025-01-01");
	});

	it("should handle leap year February to March rollover", () => {
		expect(getNextDayString("2024-02-29")).toBe("2024-03-01");
	});

	it("should handle non-leap year February to March rollover", () => {
		expect(getNextDayString("2023-02-28")).toBe("2023-03-01");
	});

	it("should return YYYY-MM-DD format", () => {
		const date = new Date();
		const expectedFormat = /^\d{4}-\d{2}-\d{2}$/;
		expect(
			getNextDayString(date.toISOString().split("T")[0] as string),
		).toMatch(expectedFormat);
	});
});

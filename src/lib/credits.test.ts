import { describe, expect, it } from "vitest";
import {
	getCreditLimit,
	getCreditsRemaining,
	getNextResetDate,
	shouldResetCredits,
} from "./credits";

describe("getCreditLimit", () => {
	it("returns 10 for free users", () => {
		expect(getCreditLimit("free")).toBe(10);
	});

	it("returns 300 for active subscribers", () => {
		expect(getCreditLimit("active")).toBe(300);
	});

	it("returns free limit for unknown statuses", () => {
		expect(getCreditLimit("canceled")).toBe(10);
		expect(getCreditLimit("past_due")).toBe(10);
		expect(getCreditLimit("unknown")).toBe(10);
	});
});

describe("getCreditsRemaining", () => {
	it("returns full credits when none used", () => {
		expect(getCreditsRemaining("free", 0)).toBe(10);
	});

	it("returns remaining credits correctly", () => {
		expect(getCreditsRemaining("free", 5)).toBe(5);
		expect(getCreditsRemaining("active", 100)).toBe(200);
	});

	it("returns 0 when all credits used", () => {
		expect(getCreditsRemaining("free", 10)).toBe(0);
		expect(getCreditsRemaining("active", 300)).toBe(0);
	});

	it("returns 0 when over limit (never negative)", () => {
		expect(getCreditsRemaining("free", 50)).toBe(0);
	});
});

describe("shouldResetCredits", () => {
	it("returns true when reset date is in the past", () => {
		const pastDate = new Date("2024-01-01");
		expect(shouldResetCredits(pastDate)).toBe(true);
	});

	it("returns false when reset date is in the future", () => {
		const futureDate = new Date("2099-12-10");
		expect(shouldResetCredits(futureDate)).toBe(false);
	});

	it("returns true when reset date is now", () => {
		const now = new Date();
		expect(shouldResetCredits(now)).toBe(true);
	});
});

describe("getNextResetDate", () => {
	it("advances by one month", () => {
		const date = new Date("2024-03-15");
		const next = getNextResetDate(date);
		expect(next.getFullYear()).toBe(2024);
		expect(next.getMonth()).toBe(3); // April (0-indexed)
		expect(next.getDate()).toBe(15);
	});

	it("handles year rollover", () => {
		const date = new Date("2024-12-15");
		const next = getNextResetDate(date);
		expect(next.getFullYear()).toBe(2025);
		expect(next.getMonth()).toBe(0); // January
		expect(next.getDate()).toBe(15);
	});

	it("handles month-end edge cases", () => {
		const date = new Date("2024-01-31");
		const next = getNextResetDate(date);
		// Jan 31 + 1 month = Feb 29 (2024 is a leap year) or Mar 2
		// JavaScript Date handles this by rolling over
		expect(next.getMonth()).toBe(2); // March (JS rolls 31 Feb -> Mar 2)
	});

	it("does not mutate the input date", () => {
		const date = new Date("2024-06-15");
		const originalTime = date.getTime();
		getNextResetDate(date);
		expect(date.getTime()).toBe(originalTime);
	});
});

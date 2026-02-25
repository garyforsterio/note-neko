
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var diary_1 = require("./diary");
(0, vitest_1.describe)("calculateMissingDiaryStats", () => {
    (0, vitest_1.it)("should return 0 missing count if latest entry is today", () => {
        var now = new Date("2024-03-15T12:00:00Z");
        var latestEntry = new Date("2024-03-15T10:00:00Z");
        var result = (0, diary_1.calculateMissingDiaryStats)(latestEntry, now);
        (0, vitest_1.expect)(result).toEqual({
            missingCount: 0,
            nextMissingDate: undefined,
        });
    });
    (0, vitest_1.it)("should return 1 missing count if latest entry is yesterday", () => {
        var now = new Date("2024-03-15T12:00:00Z");
        var latestEntry = new Date("2024-03-14T10:00:00Z");
        var result = (0, diary_1.calculateMissingDiaryStats)(latestEntry, now);
        (0, vitest_1.expect)(result).toEqual({
            missingCount: 1,
            nextMissingDate: "2024-03-15",
        });
    });
    (0, vitest_1.it)("should return correct count for multiple days gap", () => {
        var now = new Date("2024-03-15T12:00:00Z");
        var latestEntry = new Date("2024-03-11T10:00:00Z");
        var result = (0, diary_1.calculateMissingDiaryStats)(latestEntry, now);
        (0, vitest_1.expect)(result).toEqual({
            missingCount: 4,
            nextMissingDate: "2024-03-12",
        });
    });
    (0, vitest_1.it)("should handle month boundaries", () => {
        var now = new Date("2024-04-02T12:00:00Z");
        var latestEntry = new Date("2024-03-31T10:00:00Z");
        var result = (0, diary_1.calculateMissingDiaryStats)(latestEntry, now);
        (0, vitest_1.expect)(result).toEqual({
            missingCount: 2, // 1st, 2nd
            nextMissingDate: "2024-04-01",
        });
    });
    (0, vitest_1.it)("should ignore time components and compare UTC dates", () => {
        // Latest entry late in the day vs today early in the day
        var now = new Date("2024-03-15T01:00:00Z");
        var latestEntry = new Date("2024-03-14T23:00:00Z");
        // Even though they are only 2 hours apart, they are different UTC days.
        var result = (0, diary_1.calculateMissingDiaryStats)(latestEntry, now);
        (0, vitest_1.expect)(result).toEqual({
            missingCount: 1,
            nextMissingDate: "2024-03-15",
        });
    });
    (0, vitest_1.it)("should return 0 if latest entry is in the future (should not happen but good for safety)", () => {
        var now = new Date("2024-03-15T12:00:00Z");
        var latestEntry = new Date("2024-03-16T10:00:00Z");
        var result = (0, diary_1.calculateMissingDiaryStats)(latestEntry, now);
        (0, vitest_1.expect)(result).toEqual({
            missingCount: 0,
            nextMissingDate: undefined,
        });
    });
});
(0, vitest_1.describe)("getNextDayString", () => {
    (0, vitest_1.it)("should correctly increment a date within the same month", () => {
        (0, vitest_1.expect)((0, diary_1.getNextDayString)("2024-01-15")).toBe("2024-01-16");
    });
    (0, vitest_1.it)("should correctly handle month rollover", () => {
        (0, vitest_1.expect)((0, diary_1.getNextDayString)("2024-01-31")).toBe("2024-02-01");
    });
    (0, vitest_1.it)("should correctly handle year rollover", () => {
        (0, vitest_1.expect)((0, diary_1.getNextDayString)("2024-12-31")).toBe("2025-01-01");
    });
    (0, vitest_1.it)("should handle leap year February to March rollover", () => {
        (0, vitest_1.expect)((0, diary_1.getNextDayString)("2024-02-29")).toBe("2024-03-01");
    });
    (0, vitest_1.it)("should handle non-leap year February to March rollover", () => {
        (0, vitest_1.expect)((0, diary_1.getNextDayString)("2023-02-28")).toBe("2023-03-01");
    });
    (0, vitest_1.it)("should return YYYY-MM-DD format", () => {
        var date = new Date();
        var expectedFormat = /^\d{4}-\d{2}-\d{2}$/;
        (0, vitest_1.expect)((0, diary_1.getNextDayString)(date.toISOString().split("T")[0])).toMatch(expectedFormat);
    });
});

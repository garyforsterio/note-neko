
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDateString = getDateString;
exports.calculateMissingDiaryStats = calculateMissingDiaryStats;
exports.getNextDayString = getNextDayString;
function getDateString(date) {
    return date.toISOString().split("T")[0];
}
function calculateMissingDiaryStats(latestEntryDate, now) {
    if (now === void 0) { now = new Date(); }
    // Use simple string comparison of YYYY-MM-DD parts to find gaps
    // This compares dates in UTC
    var latestDateStr = latestEntryDate
        ? getDateString(latestEntryDate)
        : undefined;
    var todayStr = getDateString(now);
    if (latestDateStr && latestDateStr < todayStr) {
        var oneDay = 24 * 60 * 60 * 1000;
        // Treating the YYYY-MM-DD strings as dates ensures we compare midnight-to-midnight
        var latestDate = new Date(latestDateStr);
        var today = new Date(todayStr);
        // Calculate difference in days
        var missingCount = Math.round(Math.abs((today.getTime() - latestDate.getTime()) / oneDay));
        // Calculate next missing date (latest + 1 day)
        var nextDate = new Date(latestDate);
        nextDate.setDate(latestDate.getDate() + 1);
        var nextMissingDate = getDateString(nextDate);
        return { missingCount: missingCount, nextMissingDate: nextMissingDate };
    }
    return { missingCount: 0, nextMissingDate: undefined };
}
function getNextDayString(dateStr) {
    var dateObj = new Date(dateStr);
    dateObj.setDate(dateObj.getDate() + 1);
    return getDateString(dateObj);
}

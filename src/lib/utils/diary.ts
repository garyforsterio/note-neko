export function getDateString(date: Date): string {
	return date.toISOString().split("T")[0] as string;
}

export function calculateMissingDiaryStats(
	latestEntryDate?: Date,
	now: Date = new Date(),
): {
	missingCount: number;
	nextMissingDate: string | undefined;
} {
	// Use simple string comparison of YYYY-MM-DD parts to find gaps
	// This compares dates in UTC
	const latestDateStr = latestEntryDate
		? getDateString(latestEntryDate)
		: undefined;
	const todayStr = getDateString(now);

	if (latestDateStr && latestDateStr < todayStr) {
		const oneDay = 24 * 60 * 60 * 1000;
		// Treating the YYYY-MM-DD strings as dates ensures we compare midnight-to-midnight
		const latestDate = new Date(latestDateStr);
		const today = new Date(todayStr);

		// Calculate difference in days
		const missingCount = Math.round(
			Math.abs((today.getTime() - latestDate.getTime()) / oneDay),
		);

		// Calculate next missing date (latest + 1 day)
		const nextDate = new Date(latestDate);
		nextDate.setDate(latestDate.getDate() + 1);
		const nextMissingDate = getDateString(nextDate);

		return { missingCount, nextMissingDate };
	}

	return { missingCount: 0, nextMissingDate: undefined };
}

export function getNextDayString(dateStr: string): string {
	const dateObj = new Date(dateStr);
	dateObj.setDate(dateObj.getDate() + 1);
	return getDateString(dateObj);
}

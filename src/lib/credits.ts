const FREE_CREDIT_LIMIT = 31;
const PRO_CREDIT_LIMIT = 300;

export const CREDIT_LIMITS = {
	free: FREE_CREDIT_LIMIT,
	active: PRO_CREDIT_LIMIT,
} as const;

export const LOW_CREDIT_THRESHOLD = 5;

export function getCreditLimit(subscriptionStatus: string): number {
	if (subscriptionStatus === "active") return PRO_CREDIT_LIMIT;
	return FREE_CREDIT_LIMIT;
}

export function getCreditsRemaining(
	subscriptionStatus: string,
	aiCreditsUsed: number,
): number {
	const limit = getCreditLimit(subscriptionStatus);
	return Math.max(0, limit - aiCreditsUsed);
}

export function shouldResetCredits(creditResetDate: Date): boolean {
	const now = new Date();
	return now >= creditResetDate;
}

export function getNextResetDate(from: Date): Date {
	const next = new Date(from);
	next.setMonth(next.getMonth() + 1);
	return next;
}

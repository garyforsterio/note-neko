import { format } from "date-fns";
import { getTranslations } from "next-intl/server";
import { getCreditLimit, getCreditsRemaining } from "#lib/credits";
import { getUserBillingInfo } from "#lib/dal";
import AccountActions from "./components/AccountActions";

export async function generateMetadata() {
	const t = await getTranslations();

	return {
		title: t("settings.sections.account.title"),
	};
}

export default async function AccountSettingsPage() {
	const billing = await getUserBillingInfo();
	const t = await getTranslations();

	if (!billing) return null;

	const creditLimit = getCreditLimit(billing.subscriptionStatus);
	const creditsRemaining = getCreditsRemaining(
		billing.subscriptionStatus,
		billing.aiCreditsUsed,
	);
	const usagePercent = Math.round((billing.aiCreditsUsed / creditLimit) * 100);

	const planLabel =
		billing.subscriptionStatus === "active"
			? t("credits.proPlan")
			: t("credits.freePlan");

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-3xl font-bold mb-8">
					{t("settings.sections.account.title")}
				</h1>

				<div className="bg-white rounded-lg shadow-md p-6 space-y-6">
					{/* Plan Section */}
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-500">
								{t("credits.currentPlan")}
							</p>
							<div className="flex items-center gap-2 mt-1">
								<span className="text-2xl font-bold text-gray-900">
									{planLabel}
								</span>
								<span
									className={`px-2 py-0.5 text-xs font-medium rounded-full ${
										billing.subscriptionStatus === "active"
											? "bg-green-100 text-green-700"
											: "bg-gray-100 text-gray-600"
									}`}
								>
									{billing.subscriptionStatus === "active"
										? t("credits.proDescription")
										: t("credits.freeDescription")}
								</span>
							</div>
						</div>
					</div>

					{/* Status notices */}
					{billing.subscriptionStatus === "canceled" && (
						<div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
							{t("credits.canceledNotice")}
						</div>
					)}
					{billing.subscriptionStatus === "past_due" && (
						<div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-800">
							{t("credits.pastDueNotice")}
						</div>
					)}

					{/* Credit Usage */}
					<div>
						<div className="flex items-center justify-between mb-2">
							<span className="text-sm font-medium text-gray-700">
								{t("credits.creditsUsed", {
									used: billing.aiCreditsUsed,
									total: creditLimit,
								})}
							</span>
							<span className="text-sm text-gray-500">
								{t("credits.creditsRemaining", {
									count: creditsRemaining,
								})}
							</span>
						</div>
						<div className="w-full bg-gray-200 rounded-full h-2.5">
							<div
								className={`h-2.5 rounded-full transition-all ${
									usagePercent >= 90
										? "bg-red-500"
										: usagePercent >= 70
											? "bg-amber-500"
											: "bg-green-500"
								}`}
								style={{ width: `${Math.min(100, usagePercent)}%` }}
							/>
						</div>
						<p className="text-xs text-gray-400 mt-2">
							{t("credits.resetsOn", {
								date: format(billing.creditResetDate, "MMMM d, yyyy"),
							})}
						</p>
					</div>

					{/* Actions */}
					<AccountActions
						subscriptionStatus={billing.subscriptionStatus}
						hasStripeCustomer={!!billing.stripeCustomerId}
					/>
				</div>
			</div>
		</div>
	);
}

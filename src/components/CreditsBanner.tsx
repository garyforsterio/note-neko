import { AlertTriangle } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "#i18n/navigation";
import { getCreditsRemaining, LOW_CREDIT_THRESHOLD } from "#lib/credits";
import { getUserBillingInfo } from "#lib/dal";

export default async function CreditsBanner() {
	const billing = await getUserBillingInfo();

	if (!billing) return null;

	const remaining = getCreditsRemaining(
		billing.subscriptionStatus,
		billing.aiCreditsUsed,
	);

	if (remaining > LOW_CREDIT_THRESHOLD) return null;

	const t = await getTranslations("credits");

	return (
		<div className="bg-amber-50 border-b border-amber-200 px-4 py-3">
			<div className="container mx-auto flex items-center gap-3 text-sm">
				<AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
				<span className="text-amber-800 font-medium">
					{remaining > 0
						? t("lowCreditsWarning", { count: remaining })
						: t("noCreditsRemaining")}
				</span>
				{billing.subscriptionStatus === "free" && (
					<Link
						href="/settings/account"
						className="ml-auto text-amber-700 hover:text-amber-900 font-medium underline decoration-amber-300 hover:decoration-amber-600 transition-colors shrink-0"
					>
						{t("upgradeForMore")}
					</Link>
				)}
			</div>
		</div>
	);
}

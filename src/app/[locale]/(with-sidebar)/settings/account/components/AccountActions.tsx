"use client";

import { LoaderCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import {
	createCheckoutSessionAction,
	createPortalSessionAction,
} from "#actions/billing";

interface AccountActionsProps {
	subscriptionStatus: string;
	hasStripeCustomer: boolean;
}

export default function AccountActions({
	subscriptionStatus,
	hasStripeCustomer,
}: AccountActionsProps) {
	const t = useTranslations("credits");
	const [isLoading, setIsLoading] = useState(false);

	const handleUpgrade = async () => {
		setIsLoading(true);
		try {
			const result = await createCheckoutSessionAction();
			if (result.url) {
				window.location.href = result.url;
			}
		} finally {
			setIsLoading(false);
		}
	};

	const handleManage = async () => {
		setIsLoading(true);
		try {
			const result = await createPortalSessionAction();
			if (result.url) {
				window.location.href = result.url;
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex gap-3">
			{subscriptionStatus === "free" && (
				<button
					type="button"
					onClick={handleUpgrade}
					disabled={isLoading}
					className="px-6 py-2.5 bg-gray-900 text-white rounded-full hover:bg-black transition-colors font-medium flex items-center gap-2 disabled:opacity-50 cursor-pointer"
				>
					{isLoading && <LoaderCircle className="animate-spin h-4 w-4" />}
					{t("upgradeButton")}
				</button>
			)}

			{hasStripeCustomer && (
				<button
					type="button"
					onClick={handleManage}
					disabled={isLoading}
					className="px-6 py-2.5 text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 cursor-pointer"
				>
					{isLoading && <LoaderCircle className="animate-spin h-4 w-4" />}
					{t("managePlan")}
				</button>
			)}
		</div>
	);
}

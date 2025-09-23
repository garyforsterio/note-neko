"use client";

import { LogOut } from "lucide-react";
import { useTranslations } from "next-intl";
import { logout } from "#actions/auth";

export function SignOutButton() {
	const t = useTranslations("settings");

	const handleSignOut = async () => {
		if (confirm(t("logout.confirm"))) {
			await logout();
		}
	};

	return (
		<button
			type="button"
			onClick={handleSignOut}
			className="group flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
		>
			<LogOut className="mr-2 flex-shrink-0 h-5 w-5" />
			{t("logout.title")}
		</button>
	);
}

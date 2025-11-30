"use client";

import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PeopleSearch() {
	const t = useTranslations();
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const router = useRouter();
	const [query, setQuery] = useState(searchParams.get("q") || "");

	useEffect(() => {
		const timer = setTimeout(() => {
			const params = new URLSearchParams(searchParams);
			if (query) {
				params.set("q", query);
			} else {
				params.delete("q");
			}
			router.replace(`${pathname}?${params.toString()}`);
		}, 300);

		return () => clearTimeout(timer);
	}, [query, pathname, router, searchParams]);

	return (
		<div className="relative max-w-sm w-full mr-4">
			<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
				<Search className="h-5 w-5 text-gray-400" />
			</div>
			<input
				type="text"
				value={query}
				onChange={(e) => setQuery(e.target.value)}
				className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
				placeholder={t("people.searchPlaceholder")}
			/>
		</div>
	);
}

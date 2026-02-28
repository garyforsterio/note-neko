"use client";

import * as Sentry from "@sentry/nextjs";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { Link } from "#i18n/navigation";

export default function RootError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	const t = useTranslations();
	useEffect(() => {
		Sentry.captureException(error);
		console.error(error);
	}, [error]);

	return (
		<div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
			<div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full">
				<div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-8 w-8"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth={2}
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
						/>
					</svg>
				</div>
				<h2 className="text-2xl font-bold text-gray-900 mb-2">
					{t("error.title")}
				</h2>
				<p className="text-gray-500 mb-8">{t("error.description")}</p>
				<div className="flex flex-col sm:flex-row gap-3 justify-center">
					<button
						type="button"
						onClick={() => reset()}
						className="px-6 py-2.5 bg-gray-900 text-white rounded-full hover:bg-black transition-all shadow-md hover:shadow-lg cursor-pointer font-medium"
					>
						{t("error.tryAgain")}
					</button>
					<Link
						href="/"
						className="px-6 py-2.5 text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors cursor-pointer font-medium"
					>
						{t("error.goHome")}
					</Link>
				</div>
			</div>
		</div>
	);
}

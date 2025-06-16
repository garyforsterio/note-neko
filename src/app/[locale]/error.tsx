"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";

export default function RootError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	const t = useTranslations();
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<div>
			<h2>{t("error.title")}</h2>
			<button type="button" onClick={() => reset()}>
				{t("error.tryAgain")}
			</button>
		</div>
	);
}

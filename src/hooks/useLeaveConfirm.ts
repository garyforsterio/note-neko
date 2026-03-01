"use client";

import { useEffect } from "react";

export function useLeaveConfirm(isDirty: boolean, message?: string): void {
	const confirmMessage =
		message ?? "You have unsaved changes. Are you sure you want to leave?";

	useEffect(() => {
		if (!isDirty) return;

		// Handle browser close / refresh / external navigation
		const handleBeforeUnload = (e: BeforeUnloadEvent) => {
			e.preventDefault();
		};

		// Intercept Next.js App Router SPA navigation by overriding history.pushState
		const originalPushState = history.pushState.bind(history);
		history.pushState = (
			data: unknown,
			unused: string,
			url?: string | URL | null,
		) => {
			if (!window.confirm(confirmMessage)) {
				return;
			}
			originalPushState(data, unused, url);
		};

		// Handle back/forward button navigation
		const handlePopState = () => {
			if (!window.confirm(confirmMessage)) {
				// Push state back to cancel the navigation
				history.pushState(null, "", window.location.href);
			}
		};

		window.addEventListener("beforeunload", handleBeforeUnload);
		window.addEventListener("popstate", handlePopState);

		return () => {
			window.removeEventListener("beforeunload", handleBeforeUnload);
			window.removeEventListener("popstate", handlePopState);
			history.pushState = originalPushState;
		};
	}, [isDirty, confirmMessage]);
}

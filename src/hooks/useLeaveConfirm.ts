"use client";

import { useEffect } from "react";

// Navigation API types (not yet in this project's TS lib)
interface AppNavigateEvent {
	canIntercept: boolean;
	hashChange: boolean;
	downloadRequest: string | null;
	preventDefault(): void;
}

interface AppNavigation {
	addEventListener(
		type: "navigate",
		listener: (event: AppNavigateEvent) => void,
	): void;
	removeEventListener(
		type: "navigate",
		listener: (event: AppNavigateEvent) => void,
	): void;
}

export function useLeaveConfirm(isDirty: boolean, message?: string): void {
	const confirmMessage =
		message ?? "You have unsaved changes. Are you sure you want to leave?";

	useEffect(() => {
		if (!isDirty) return;

		// Handle browser close / refresh / external navigation
		const handleBeforeUnload = (e: BeforeUnloadEvent) => {
			e.preventDefault();
		};
		window.addEventListener("beforeunload", handleBeforeUnload);

		// Navigation API: intercept SPA navigations before they occur.
		// This properly cancels navigations including Next.js App Router transitions.
		// Overriding history.pushState alone is insufficient because Next.js updates
		// React state independently of the URL — blocking pushState only prevents
		// the URL change while the component tree still renders the new page.
		// The Navigation API fires before any state changes and e.preventDefault()
		// cancels the entire navigation pipeline.
		// Supported in Chrome/Edge 102+, Safari 17.5+.
		const nav: AppNavigation | null =
			"navigation" in window
				? (window.navigation as unknown as AppNavigation)
				: null;

		const handleNavigate = (e: AppNavigateEvent) => {
			if (!e.canIntercept || e.hashChange || e.downloadRequest !== null) {
				return;
			}
			if (!window.confirm(confirmMessage)) {
				e.preventDefault();
			}
		};

		if (nav) {
			nav.addEventListener("navigate", handleNavigate);
		}

		// Fallback for browsers without Navigation API (Firefox):
		// Override pushState to show confirmation before SPA navigation.
		// This is a best-effort approach — it cannot fully prevent React state
		// changes, but combined with beforeunload it provides reasonable protection.
		const originalPushState = !nav ? history.pushState.bind(history) : null;

		if (originalPushState) {
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
		}

		// Handle back/forward button for non-Navigation API browsers
		const handlePopState = !nav
			? () => {
					if (!window.confirm(confirmMessage)) {
						history.pushState(null, "", window.location.href);
					}
				}
			: null;

		if (handlePopState) {
			window.addEventListener("popstate", handlePopState);
		}

		return () => {
			window.removeEventListener("beforeunload", handleBeforeUnload);
			if (nav) {
				nav.removeEventListener("navigate", handleNavigate);
			}
			if (originalPushState) {
				history.pushState = originalPushState;
			}
			if (handlePopState) {
				window.removeEventListener("popstate", handlePopState);
			}
		};
	}, [isDirty, confirmMessage]);
}

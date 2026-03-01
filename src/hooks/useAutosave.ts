"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseAutosaveOptions {
	debounceMs?: number;
	enabled?: boolean;
}

interface UseAutosaveReturn<T> {
	restoredDraft: T | null;
	lastSaved: Date | null;
	clearDraft: () => void;
}

interface StoredDraft<T> {
	data: T;
	savedAt: number;
}

export function useAutosave<T>(
	key: string,
	data: T,
	options?: UseAutosaveOptions,
): UseAutosaveReturn<T> {
	const { debounceMs = 1000, enabled = true } = options ?? {};
	const [restoredDraft, setRestoredDraft] = useState<T | null>(null);
	const [lastSaved, setLastSaved] = useState<Date | null>(null);
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const hasRestoredRef = useRef(false);

	// Restore draft on mount (once)
	useEffect(() => {
		if (hasRestoredRef.current || typeof window === "undefined") return;
		hasRestoredRef.current = true;

		try {
			const stored = localStorage.getItem(key);
			if (stored) {
				const parsed: StoredDraft<T> = JSON.parse(stored);
				setRestoredDraft(parsed.data);
				setLastSaved(new Date(parsed.savedAt));
			}
		} catch {
			// Corrupted data — remove it
			localStorage.removeItem(key);
		}
	}, [key]);

	// Debounced save
	useEffect(() => {
		if (!enabled || typeof window === "undefined") return;

		if (timerRef.current) {
			clearTimeout(timerRef.current);
		}

		timerRef.current = setTimeout(() => {
			try {
				const draft: StoredDraft<T> = {
					data,
					savedAt: Date.now(),
				};
				localStorage.setItem(key, JSON.stringify(draft));
				setLastSaved(new Date(draft.savedAt));
			} catch {
				// localStorage quota exceeded — silently ignore
			}
		}, debounceMs);

		return () => {
			if (timerRef.current) {
				clearTimeout(timerRef.current);
			}
		};
	}, [key, data, debounceMs, enabled]);

	const clearDraft = useCallback(() => {
		if (typeof window !== "undefined") {
			localStorage.removeItem(key);
		}
		setLastSaved(null);
	}, [key]);

	return { restoredDraft, lastSaved, clearDraft };
}

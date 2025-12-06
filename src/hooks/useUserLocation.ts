"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { useToast } from "../hooks/use-toast";

interface UserLocation {
	latitude: number;
	longitude: number;
	accuracy: number;
}

interface UseUserLocationResult {
	location: UserLocation | null;
	loading: boolean;
	requestLocation: () => void;
}

export function useUserLocation(): UseUserLocationResult {
	const { toast } = useToast();
	const t = useTranslations("error.location");
	const [location, setLocation] = useState<UserLocation | null>(null);
	const [loading, setLoading] = useState(false);

	// Silent location request (no loading state)
	const requestLocationSilently = useCallback(() => {
		if (!navigator.geolocation) return;

		navigator.geolocation.getCurrentPosition(
			(position) => {
				const newLocation: UserLocation = {
					latitude: position.coords.latitude,
					longitude: position.coords.longitude,
					accuracy: position.coords.accuracy,
				};
				setLocation(newLocation);
			},
			() => {
				// Silently fail - don't set error state
			},
			{
				enableHighAccuracy: true,
				timeout: 10000,
				maximumAge: 0, // Always get fresh location
			},
		);
	}, []);

	const requestLocation = useCallback(() => {
		if (!navigator.geolocation) {
			toast({
				title: t("title"),
				description: t("unsupported"),
				variant: "destructive",
			});
			return;
		}

		setLoading(true);

		navigator.geolocation.getCurrentPosition(
			(position) => {
				const newLocation: UserLocation = {
					latitude: position.coords.latitude,
					longitude: position.coords.longitude,
					accuracy: position.coords.accuracy,
				};
				setLocation(newLocation);
				setLoading(false);
			},
			(err) => {
				setLoading(false);
				let errorKey:
					| "permissionDenied"
					| "unavailable"
					| "timeout"
					| "unknown";
				switch (err.code) {
					case err.PERMISSION_DENIED:
						errorKey = "permissionDenied";
						break;
					case err.POSITION_UNAVAILABLE:
						errorKey = "unavailable";
						break;
					case err.TIMEOUT:
						errorKey = "timeout";
						break;
					default:
						errorKey = "unknown";
						break;
				}
				toast({
					title: t("title"),
					description: t(errorKey),
					variant: "destructive",
				});
			},
			{
				enableHighAccuracy: true,
				timeout: 10000,
				maximumAge: 0, // Always get fresh location
			},
		);
	}, [toast, t]);

	// Check permission status on mount
	useEffect(() => {
		// Check if permission is already granted
		if ("permissions" in navigator) {
			navigator.permissions
				.query({ name: "geolocation" })
				.then((permissionStatus) => {
					if (permissionStatus.state === "granted") {
						// Permission already granted, fetch location silently
						requestLocationSilently();
					}
				})
				.catch(() => {
					// Permissions API not supported or error, ignore
				});
		}
	}, [requestLocationSilently]);

	return {
		location,
		loading,
		requestLocation,
	};
}

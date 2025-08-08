"use client";

import { useCallback, useEffect, useState } from "react";

interface UserLocation {
	latitude: number;
	longitude: number;
	accuracy: number;
}

interface UseUserLocationResult {
	location: UserLocation | null;
	error: string | null;
	loading: boolean;
	requestLocation: () => void;
}

export function useUserLocation(): UseUserLocationResult {
	const [location, setLocation] = useState<UserLocation | null>(null);
	const [error, setError] = useState<string | null>(null);
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
			setError("Geolocation is not supported by your browser");
			return;
		}

		setLoading(true);
		setError(null);

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
				switch (err.code) {
					case err.PERMISSION_DENIED:
						setError("Location permission denied");
						break;
					case err.POSITION_UNAVAILABLE:
						setError("Location information unavailable");
						break;
					case err.TIMEOUT:
						setError("Location request timed out");
						break;
					default:
						setError("An unknown error occurred");
						break;
				}
			},
			{
				enableHighAccuracy: true,
				timeout: 10000,
				maximumAge: 0, // Always get fresh location
			},
		);
	}, []);

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
		error,
		loading,
		requestLocation,
	};
}

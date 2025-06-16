// Singleton to track script loading
let scriptLoadingPromise: Promise<void> | null = null;

export const loadGoogleMapsScript = () => {
	if (scriptLoadingPromise) return scriptLoadingPromise;

	scriptLoadingPromise = new Promise((resolve, reject) => {
		if (window.google?.maps) {
			resolve();
			return;
		}

		const script = document.createElement("script");
		script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
		script.async = true;
		script.defer = true;
		script.onload = () => {
			resolve();
		};
		script.onerror = reject;
		document.head.appendChild(script);
	});

	return scriptLoadingPromise;
};

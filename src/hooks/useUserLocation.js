"use client";

Object.defineProperty(exports, "__esModule", { value: true });
exports.useUserLocation = useUserLocation;
var next_intl_1 = require("next-intl");
var react_1 = require("react");
var use_toast_1 = require("../hooks/use-toast");
function useUserLocation() {
    var toast = (0, use_toast_1.useToast)().toast;
    var t = (0, next_intl_1.useTranslations)("error.location");
    var _a = (0, react_1.useState)(null), location = _a[0], setLocation = _a[1];
    var _b = (0, react_1.useState)(false), loading = _b[0], setLoading = _b[1];
    // Silent location request (no loading state)
    var requestLocationSilently = (0, react_1.useCallback)(() => {
        if (!navigator.geolocation)
            return;
        navigator.geolocation.getCurrentPosition((position) => {
            var newLocation = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy,
            };
            setLocation(newLocation);
        }, () => {
            // Silently fail - don't set error state
        }, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0, // Always get fresh location
        });
    }, []);
    var requestLocation = (0, react_1.useCallback)(() => {
        if (!navigator.geolocation) {
            toast({
                title: t("title"),
                description: t("unsupported"),
                variant: "destructive",
            });
            return;
        }
        setLoading(true);
        navigator.geolocation.getCurrentPosition((position) => {
            var newLocation = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy,
            };
            setLocation(newLocation);
            setLoading(false);
        }, (err) => {
            setLoading(false);
            var errorKey;
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
        }, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0, // Always get fresh location
        });
    }, [toast, t]);
    // Check permission status on mount
    (0, react_1.useEffect)(() => {
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
        location: location,
        loading: loading,
        requestLocation: requestLocation,
    };
}

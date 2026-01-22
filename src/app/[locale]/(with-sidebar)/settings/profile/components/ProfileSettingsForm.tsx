"use client";

import { Loader2, MapPin, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import type { LocationResult } from "#actions/locations";
import { updateDefaultLocationAction } from "#actions/profile";
import EntityPicker from "#components/diary/EntityPicker";
import type { Prisma } from "#generated/prisma";
import { useToast } from "#hooks/use-toast";

interface ProfileSettingsFormProps {
	initialDefaultLocation: LocationResult | null;
}

function SubmitButton() {
	const { pending } = useFormStatus();
	const t = useTranslations("settings.profile");

	return (
		<button
			type="submit"
			disabled={pending}
			className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
		>
			{pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
			{t("saveChanges")}
		</button>
	);
}

export function ProfileSettingsForm({
	initialDefaultLocation,
}: ProfileSettingsFormProps) {
	const [selectedLocation, setSelectedLocation] =
		useState<LocationResult | null>(initialDefaultLocation);
	const [isPickerOpen, setIsPickerOpen] = useState(false);
	const { toast } = useToast();
	const t = useTranslations("settings.profile");

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		// The updateDefaultLocationAction expects an object, not FormData.
		const result = await updateDefaultLocationAction(selectedLocation);

		if (result?.success) {
			toast({
				title: t("saveSuccess"),
				description: result.message,
			});
		} else {
			toast({
				title: t("saveError"),
				description: result?.message || t("failedToSaveDefaultLocation"),
				variant: "destructive",
			});
		}
	};

	const handleLocationSelect = (
		entity:
			| Prisma.PersonGetPayload<object>
			| Prisma.DiaryLocationCreateWithoutDiaryEntryInput,
	) => {
		// We only care about locations here
		if ("placeId" in entity) {
			setSelectedLocation({
				placeId: entity.placeId,
				name: entity.name,
				lat: entity.lat,
				lng: entity.lng,
			});
		}
		setIsPickerOpen(false);
	};

	const handleClearLocation = () => {
		setSelectedLocation(null);
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<div>
				<label
					htmlFor="defaultLocation"
					className="block text-sm font-medium text-gray-700"
				>
					{t("defaultLocationLabel")}
				</label>
				<p className="mt-1 text-sm text-gray-500">
					{t("defaultLocationDescription")}
				</p>
				<div className="mt-2 relative">
					{selectedLocation ? (
						<div className="flex items-center justify-between p-3 border rounded-md bg-gray-50">
							<div className="flex items-center gap-2">
								<MapPin className="w-4 h-4 text-gray-500" />
								<span>{selectedLocation.name}</span>
							</div>
							<button
								type="button"
								onClick={handleClearLocation}
								className="text-gray-500 hover:text-gray-700"
								aria-label="Clear location"
							>
								<X className="w-4 h-4" />
							</button>
						</div>
					) : (
						<button
							type="button"
							onClick={() => setIsPickerOpen(true)}
							className="w-full text-left px-3 py-2 border rounded-md text-gray-500 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							{t("searchLocationPlaceholder")}
						</button>
					)}

					{isPickerOpen && (
						<EntityPicker
							type="location"
							onSelect={handleLocationSelect}
							onClose={() => setIsPickerOpen(false)}
							people={[]}
							position={{ top: 45, left: 0 }}
						/>
					)}
				</div>
			</div>

			<SubmitButton />
		</form>
	);
}

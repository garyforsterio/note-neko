"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { LoaderCircle, Sparkles, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { createCheckoutSessionAction } from "#actions/billing";

interface UpgradeDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSaveWithoutAi?: () => void;
}

export default function UpgradeDialog({
	open,
	onOpenChange,
	onSaveWithoutAi,
}: UpgradeDialogProps) {
	const t = useTranslations();
	const [isLoading, setIsLoading] = useState(false);

	const handleUpgrade = async () => {
		setIsLoading(true);
		try {
			const result = await createCheckoutSessionAction();
			if (result.url) {
				window.location.href = result.url;
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog.Root open={open} onOpenChange={onOpenChange}>
			<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 bg-black/40 z-50 data-[state=open]:animate-in data-[state=open]:fade-in data-[state=closed]:animate-out data-[state=closed]:fade-out" />
				<Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-95">
					<div className="flex items-center gap-3 mb-4">
						<div className="p-2 bg-amber-100 rounded-full">
							<Sparkles className="h-5 w-5 text-amber-600" />
						</div>
						<Dialog.Title className="text-lg font-semibold text-gray-900">
							{t("credits.upgradeTitle")}
						</Dialog.Title>
					</div>

					<Dialog.Description className="text-sm text-gray-600 mb-6">
						{t("credits.upgradeDescription")}
					</Dialog.Description>

					<div className="flex flex-col gap-3">
						<button
							type="button"
							onClick={handleUpgrade}
							disabled={isLoading}
							className="w-full px-4 py-2.5 bg-gray-900 text-white rounded-full hover:bg-black transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
						>
							{isLoading && <LoaderCircle className="animate-spin h-4 w-4" />}
							{t("credits.upgradeButton")}
						</button>

						{onSaveWithoutAi && (
							<button
								type="button"
								onClick={() => {
									onOpenChange(false);
									onSaveWithoutAi();
								}}
								className="w-full px-4 py-2.5 text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors font-medium cursor-pointer"
							>
								{t("credits.saveWithoutAi")}
							</button>
						)}

						<Dialog.Close asChild>
							<button
								type="button"
								className="w-full px-4 py-2.5 text-gray-500 hover:text-gray-700 transition-colors font-medium cursor-pointer"
							>
								{t("common.cancel")}
							</button>
						</Dialog.Close>
					</div>

					<Dialog.Close asChild>
						<button
							type="button"
							className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
							aria-label="Close"
						>
							<X className="h-4 w-4" />
						</button>
					</Dialog.Close>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}

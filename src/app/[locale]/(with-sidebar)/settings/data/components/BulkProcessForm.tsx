"use client";

import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import {
	getUnprocessedDiaryIdsAction,
	processDiaryEntryAction,
} from "#actions/diary";
import UpgradeDialog from "#components/UpgradeDialog";

interface BulkProcessFormProps {
	initialCount: number;
	creditsRemaining: number;
}

export default function BulkProcessForm({
	initialCount,
	creditsRemaining: initialCredits,
}: BulkProcessFormProps) {
	const t = useTranslations("settings.data");
	const [isPending, startTransition] = useTransition();
	const [progress, setProgress] = useState<{
		current: number;
		total: number;
	} | null>(null);
	const [isComplete, setIsComplete] = useState(false);
	const [remaining, setRemaining] = useState(initialCount);
	const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);

	const handleBulkProcess = () => {
		if (initialCredits <= 0) {
			setShowUpgradeDialog(true);
			return;
		}

		startTransition(async () => {
			const entries = await getUnprocessedDiaryIdsAction();
			const total = entries.length;

			if (total === 0) return;

			let processed = 0;
			for (const [i, entry] of entries.entries()) {
				setProgress({ current: i + 1, total });
				const result = await processDiaryEntryAction(entry.id, {
					redirectToEdit: false,
				});
				if (result.error === "No AI credits remaining") {
					setRemaining(total - processed);
					setProgress(null);
					setShowUpgradeDialog(true);
					return;
				}
				processed++;
			}

			setProgress(null);
			setIsComplete(true);
			setRemaining(0);
		});
	};

	if (remaining === 0 && !isPending) {
		return (
			<p className="text-sm text-gray-500">
				{isComplete ? t("processingComplete") : t("noUnprocessed")}
			</p>
		);
	}

	return (
		<>
			<div className="flex flex-col gap-3">
				<p className="text-sm text-gray-600">
					{t("unprocessedCount", { count: remaining })}
				</p>

				{progress && (
					<div className="flex flex-col gap-2">
						<div className="w-full bg-gray-200 rounded-full h-2">
							<div
								className="bg-amber-500 h-2 rounded-full transition-all duration-300"
								style={{
									width: `${(progress.current / progress.total) * 100}%`,
								}}
							/>
						</div>
						<p className="text-sm text-gray-500">
							{t("processingProgress", {
								current: progress.current,
								total: progress.total,
							})}
						</p>
					</div>
				)}

				<button
					type="button"
					onClick={handleBulkProcess}
					disabled={isPending}
					className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed w-fit"
				>
					<Sparkles className={`h-4 w-4 ${isPending ? "animate-spin" : ""}`} />
					{t("processAll")}
				</button>
			</div>

			<UpgradeDialog
				open={showUpgradeDialog}
				onOpenChange={setShowUpgradeDialog}
			/>
		</>
	);
}

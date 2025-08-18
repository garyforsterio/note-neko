"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";

interface RewriteEditorProps {
	content: string;
	onChange: (content: string) => void;
}

export default function RewriteEditor({
	content,
	onChange,
}: RewriteEditorProps) {
	const t = useTranslations();
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	// Auto-resize textarea
	useEffect(() => {
		const textarea = textareaRef.current;
		if (textarea) {
			textarea.style.height = "auto";
			textarea.style.height = `${textarea.scrollHeight}px`;
		}
	});

	return (
		<div className="space-y-2">
			<div className="text-sm text-gray-600">
				{t("diary.rewriteModeDescription")}
			</div>
			<textarea
				ref={textareaRef}
				value={content}
				onChange={(e) => onChange(e.target.value)}
				className="w-full min-h-[400px] p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
				placeholder={t("diary.contentPlaceholder")}
			/>
			<div className="text-xs text-gray-500">{t("diary.rewriteModeHelp")}</div>
		</div>
	);
}

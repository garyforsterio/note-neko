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
			<textarea
				ref={textareaRef}
				value={content}
				onChange={(e) => onChange(e.target.value)}
				className="w-full p-6 text-lg text-gray-700 bg-gray-50/50 border-0 rounded-xl focus:outline-none focus:ring-0 focus:bg-white transition-colors placeholder:text-gray-300 resize-none shadow-inner"
				placeholder={t("diary.contentPlaceholder")}
			/>
		</div>
	);
}

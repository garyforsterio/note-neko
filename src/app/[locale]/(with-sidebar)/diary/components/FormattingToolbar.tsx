import { Bold, Italic, MapPin, Underline, User } from "lucide-react";
import { useTranslations } from "next-intl";

interface FormattingToolbarProps {
	textareaRef: React.RefObject<HTMLTextAreaElement | null>;
	onMentionPerson: () => void;
	onMentionLocation: () => void;
}

interface FormattingButton {
	id: string;
	icon: React.ReactNode;
	title: string;
	onClick: () => void;
}

export default function FormattingToolbar({
	textareaRef,
	onMentionPerson,
	onMentionLocation,
}: FormattingToolbarProps) {
	const t = useTranslations();

	const applyFormatting = (prefix: string, suffix?: string) => {
		const textarea = textareaRef.current;
		if (!textarea) return;

		const content = textarea.value;
		const start = textarea.selectionStart;
		const end = textarea.selectionEnd;
		const selectedText = content.slice(start, end);
		const newValue = `${content.slice(0, start)}${prefix}${selectedText}${suffix || ""}${content.slice(end)}`;
		textarea.value = newValue;
		textarea.focus();
		textarea.setSelectionRange(start + prefix.length, end + prefix.length);
	};

	const formattingButtons: FormattingButton[] = [
		{
			id: "bold",
			icon: <Bold size={16} />,
			title: t("diary.formatting.bold"),
			onClick: () => applyFormatting("**", "**"),
		},
		{
			id: "italic",
			icon: <Italic size={16} />,
			title: t("diary.formatting.italic"),
			onClick: () => applyFormatting("*", "*"),
		},
		{
			id: "underline",
			icon: <Underline size={16} />,
			title: t("diary.formatting.underline"),
			onClick: () => applyFormatting("__", "__"),
		},
	];

	const mentionButtons: FormattingButton[] = [
		{
			id: "mention-person",
			icon: <User size={16} />,
			title: t("diary.formatting.addPerson"),
			onClick: () => {
				applyFormatting("@");
				onMentionPerson();
			},
		},

		{
			id: "mention-location",
			icon: <MapPin size={16} />,
			title: t("diary.formatting.addLocation"),
			onClick: () => {
				applyFormatting("^");
				onMentionLocation();
			},
		},
	];

	return (
		<div className="flex items-center gap-2 p-2 border border-gray-300 rounded-t-md bg-gray-50">
			{formattingButtons.map((button) => (
				<button
					key={button.id}
					type="button"
					onClick={button.onClick}
					className="p-1 hover:bg-gray-200 rounded"
					title={button.title}
				>
					{button.icon}
				</button>
			))}
			<div className="w-px h-6 bg-gray-300 mx-2" />
			{mentionButtons.map((button) => (
				<button
					key={button.id}
					type="button"
					onClick={button.onClick}
					className="p-1 hover:bg-gray-200 rounded flex items-center gap-1"
					title={button.title}
				>
					{button.icon}
					<span className="text-sm">{button.title}</span>
				</button>
			))}
		</div>
	);
}

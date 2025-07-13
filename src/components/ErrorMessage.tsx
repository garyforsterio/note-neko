interface ErrorMessageProps {
	// TODO: remove once migrated to array
	message?: string;
	errors?: string[];
	id?: string;
}

export default function ErrorMessage({ errors, id }: ErrorMessageProps) {
	if (!errors) return null;
	return (
		<div className="p-4 bg-red-50 text-red-700 rounded-md" id={id}>
			{errors}
		</div>
	);
}

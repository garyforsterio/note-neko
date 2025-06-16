import type { Person, Prisma } from "@prisma/client";
import Markdown from "react-markdown";

import { getGoogleMapsUrl } from "#lib/utils/maps";

function populateLinks({
	content,
	people,
	locations,
}: {
	content: string;
	people?: Person[];
	locations?: Prisma.DiaryLocationCreateWithoutDiaryEntryInput[];
}) {
	let transformedContent = content;
	// Replace person mentions with markdown links
	for (const person of people ?? []) {
		transformedContent = transformedContent.replace(
			new RegExp(`\\[person:${person.id}\\]`, "g"),
			`[${person.nickname || person.name}](/en/people/${person.id})`,
		);
	}

	// Replace location mentions with markdown links
	for (const location of locations ?? []) {
		transformedContent = transformedContent.replace(
			new RegExp(`\\[location:${location.placeId}\\]`, "g"),
			`[${location.name}](${getGoogleMapsUrl(
				location.placeId,
				location.lat,
				location.lng,
			)})`,
		);
	}

	return transformedContent;
}

interface DiaryContentProps {
	content: string;
	people: Person[];
	locations: Prisma.DiaryLocationCreateWithoutDiaryEntryInput[];
}

export function DiaryContent({
	content,
	people,
	locations,
}: DiaryContentProps) {
	return (
		<Markdown
			components={{
				a: ({ children, href }) => {
					return (
						<a
							className="text-blue-500 underline"
							href={href}
							target="_blank"
							rel="noopener noreferrer"
						>
							{children}
						</a>
					);
				},
				h1: ({ children }) => {
					return <h1 className="text-2xl font-bold">{children}</h1>;
				},
				h2: ({ children }) => {
					return <h2 className="text-xl font-bold">{children}</h2>;
				},
				h3: ({ children }) => {
					return <h3 className="text-lg font-bold">{children}</h3>;
				},
				h4: ({ children }) => {
					return <h4 className="text-base font-bold">{children}</h4>;
				},
				h5: ({ children }) => {
					return <h5 className="text-sm font-bold">{children}</h5>;
				},
				h6: ({ children }) => {
					return <h6 className="text-xs font-bold">{children}</h6>;
				},
				p: ({ children }) => {
					return <p className="text-base">{children}</p>;
				},
				ul: ({ children }) => {
					return <ul className="list-disc list-inside">{children}</ul>;
				},
				ol: ({ children }) => {
					return <ol className="list-decimal list-inside">{children}</ol>;
				},
				li: ({ children }) => {
					return <li className="text-base">{children}</li>;
				},
				blockquote: ({ children }) => {
					return (
						<blockquote className="border-l-4 border-gray-300 pl-4">
							{children}
						</blockquote>
					);
				},
				code: ({ children }) => {
					return <code className="bg-gray-100 p-1 rounded">{children}</code>;
				},
				img: ({ src, alt }) => {
					return <img src={src} alt={alt} className="w-full" />;
				},
				pre: ({ children }) => {
					return <pre className="bg-gray-100 p-4 rounded">{children}</pre>;
				},
				table: ({ children }) => {
					return <table className="w-full">{children}</table>;
				},
				tr: ({ children }) => {
					return <tr className="border-b">{children}</tr>;
				},
				th: ({ children }) => {
					return <th className="border-b p-2">{children}</th>;
				},
				td: ({ children }) => {
					return <td className="border-b p-2">{children}</td>;
				},
				hr: () => {
					return <hr className="my-4" />;
				},
			}}
		>
			{populateLinks({
				content,
				people,
				locations,
			})}
		</Markdown>
	);
}

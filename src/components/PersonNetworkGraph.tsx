"use client";

import { User } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { Link } from "#i18n/navigation";

interface PersonNetworkGraphProps {
	currentPerson: {
		id: string;
		name: string;
	};
	mentions: Array<{
		diaryEntry: {
			mentions: Array<{
				person: {
					id: string;
					name: string;
				};
			}>;
		};
	}>;
}

export function PersonNetworkGraph({
	currentPerson,
	mentions,
}: PersonNetworkGraphProps) {
	const t = useTranslations();
	const [hoveredNode, setHoveredNode] = useState<string | null>(null);

	// Process data to find connections
	const connections = useMemo(() => {
		const stats = new Map<string, { name: string; count: number }>();

		for (const mention of mentions) {
			const entryMentions = mention.diaryEntry.mentions;
			// If there's only the current person, skip
			if (entryMentions.length <= 1) continue;

			for (const m of entryMentions) {
				if (m.person.id === currentPerson.id) continue;

				const existing = stats.get(m.person.id);
				if (existing) {
					existing.count++;
				} else {
					stats.set(m.person.id, {
						name: m.person.name,
						count: 1,
					});
				}
			}
		}

		return Array.from(stats.entries())
			.map(([id, data]) => ({ id, ...data }))
			.sort((a, b) => b.count - a.count)
			.slice(0, 12); // Limit to top 12 connections to avoid crowding
	}, [mentions, currentPerson.id]);

	if (connections.length === 0) {
		return null;
	}

	// Layout configuration
	const width = 600;
	const height = 400;
	const centerX = width / 2;
	const centerY = height / 2;
	const centerRadius = 40;
	const orbitRadius = 140;

	// Calculate positions
	const nodes = connections.map((node, i) => {
		const angle = (i / connections.length) * 2 * Math.PI - Math.PI / 2; // Start from top
		return {
			...node,
			x: centerX + orbitRadius * Math.cos(angle),
			y: centerY + orbitRadius * Math.sin(angle),
			radius: Math.max(20, Math.min(30, 15 + node.count * 2)), // Size based on count
		};
	});

	return (
		<div className="w-full overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
			<h2 className="text-xl font-bold mb-6 flex items-center gap-2">
				<span className="text-indigo-600">🕸️</span>
				{t("people.network.title")}
			</h2>

			<div className="relative w-full aspect-[3/2] max-h-[500px]">
				<svg
					viewBox={`0 0 ${width} ${height}`}
					className="w-full h-full"
					style={{ overflow: "visible" }}
				>
					{/* Connections (Lines) */}
					{nodes.map((node) => (
						<line
							key={`link-${node.id}`}
							x1={centerX}
							y1={centerY}
							x2={node.x}
							y2={node.y}
							stroke="#E0E7FF"
							strokeWidth={Math.max(1, Math.min(4, node.count))}
							strokeLinecap="round"
						/>
					))}

					{/* Center Node (Current Person) */}
					<g>
						<circle
							cx={centerX}
							cy={centerY}
							r={centerRadius}
							fill="white"
							stroke="#4F46E5"
							strokeWidth="3"
							className="shadow-md"
						/>
						<foreignObject
							x={centerX - centerRadius}
							y={centerY - centerRadius}
							width={centerRadius * 2}
							height={centerRadius * 2}
						>
							<div className="w-full h-full flex items-center justify-center text-indigo-600">
								<User size={32} />
							</div>
						</foreignObject>
					</g>

					{/* Connected Nodes */}
					{nodes.map((node) => {
						const isHovered = hoveredNode === node.id;
						const displayRadius = isHovered ? node.radius * 1.15 : node.radius;

						return (
							<Link key={node.id} href={`/people/${node.id}`}>
								{/* biome-ignore lint/a11y/noStaticElementInteractions: SVG group for hover effects inside Link */}
								<g
									onMouseEnter={() => setHoveredNode(node.id)}
									onMouseLeave={() => setHoveredNode(null)}
									style={{ cursor: "pointer" }}
								>
									{/* Stable Invisible Hit Target */}
									<circle
										cx={node.x}
										cy={node.y}
										r={node.radius * 1.5} // Larger hit area
										fill="transparent"
									/>

									{/* Visible Node Circle */}
									<circle
										cx={node.x}
										cy={node.y}
										r={displayRadius}
										fill={isHovered ? "#EEF2FF" : "white"}
										stroke={isHovered ? "#4F46E5" : "#94A3B8"}
										strokeWidth="2"
										className="transition-all duration-200 ease-out"
									/>

									{/* Initials */}
									<text
										x={node.x}
										y={node.y}
										dy=".35em"
										textAnchor="middle"
										fill={isHovered ? "#4F46E5" : "#64748B"}
										fontSize={Math.max(10, node.radius * 0.8)}
										fontWeight="bold"
										pointerEvents="none"
										className="transition-colors duration-200"
									>
										{node.name.slice(0, 2).toUpperCase()}
									</text>

									{/* Tooltip Label */}
									<text
										x={node.x}
										y={node.y + displayRadius + 16}
										textAnchor="middle"
										className={`text-xs font-medium fill-gray-600 transition-opacity duration-200 ${
											isHovered ? "opacity-100" : "opacity-0"
										}`}
									>
										{node.name} ({node.count})
									</text>
								</g>
							</Link>
						);
					})}
				</svg>
			</div>

			<p className="text-sm text-gray-400 text-center mt-2 italic">
				{t("people.network.description")}
			</p>
		</div>
	);
}

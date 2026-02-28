"use client";

import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "#i18n/navigation";

interface Person {
	id: string;
	name: string;
	mentions: Array<{
		diaryEntry: {
			mentions: Array<{
				person: {
					id: string;
				};
			}>;
		};
	}>;
}

interface Node {
	id: string;
	name: string;
	x: number;
	y: number;
	vx: number;
	vy: number;
	radius: number;
	connections: number;
}

interface LinkData {
	source: string;
	target: string;
	strength: number;
}

interface GlobalNetworkGraphProps {
	people: Person[];
}

export function GlobalNetworkGraph({ people }: GlobalNetworkGraphProps) {
	const t = useTranslations();
	const [hoveredNode, setHoveredNode] = useState<string | null>(null);
	const [simulationNodes, setSimulationNodes] = useState<Node[]>([]);
	const svgRef = useRef<SVGSVGElement>(null);

	// Configuration
	const width = 800;
	const height = 600;
	const centerX = width / 2;
	const centerY = height / 2;

	// Process data into nodes and links
	const { initialNodes, links } = useMemo(() => {
		const nodes: Node[] = people.map((p) => ({
			id: p.id,
			name: p.name,
			x: centerX + (Math.random() - 0.5) * 200,
			y: centerY + (Math.random() - 0.5) * 200,
			vx: 0,
			vy: 0,
			radius: 20,
			connections: 0,
		}));

		const linksMap = new Map<string, number>();

		// Calculate connections based on shared diary entries
		for (const person of people) {
			for (const mention of person.mentions) {
				const entryMentions = mention.diaryEntry.mentions;
				if (entryMentions.length <= 1) continue;

				for (const m of entryMentions) {
					if (m.person.id === person.id) continue;

					// Create a unique key for the pair (sorted to avoid duplicates A-B vs B-A)
					const [source, target] = [person.id, m.person.id].sort();
					const key = `${source}-${target}`;
					linksMap.set(key, (linksMap.get(key) || 0) + 1);
				}
			}
		}

		const links: LinkData[] = Array.from(linksMap.entries()).map(
			([key, count]) => {
				const [source, target] = key.split("-") as [string, string];
				return { source, target, strength: count };
			},
		);

		// Update node connection counts and radius
		for (const link of links) {
			const sourceNode = nodes.find((n) => n.id === link.source);
			const targetNode = nodes.find((n) => n.id === link.target);
			if (sourceNode) sourceNode.connections += link.strength;
			if (targetNode) targetNode.connections += link.strength;
		}

		nodes.forEach((n) => {
			n.radius = Math.max(15, Math.min(40, 15 + Math.sqrt(n.connections) * 3));
		});

		return { initialNodes: nodes, links };
	}, [people, centerX, centerY]);

	// Run Simulation
	useEffect(() => {
		const nodes = JSON.parse(JSON.stringify(initialNodes)); // Deep copy to avoid mutating prop-derived state
		const iterations = 300;
		const k = 0.1; // Spring constant
		const repulsion = 5000;
		const centerForce = 0.05;
		const damping = 0.8;
		const dt = 0.5;

		for (let i = 0; i < iterations; i++) {
			// Reset forces
			for (const node of nodes) {
				node.fx = 0;
				node.fy = 0;
			}

			// Repulsion between all nodes
			for (let a = 0; a < nodes.length; a++) {
				for (let b = a + 1; b < nodes.length; b++) {
					const nodeA = nodes[a];
					const nodeB = nodes[b];
					const dx = nodeA.x - nodeB.x;
					const dy = nodeA.y - nodeB.y;
					const distSq = dx * dx + dy * dy || 1; // Avoid division by zero
					const dist = Math.sqrt(distSq);
					const force = repulsion / distSq;

					const fx = (dx / dist) * force;
					const fy = (dy / dist) * force;

					nodeA.fx += fx;
					nodeA.fy += fy;
					nodeB.fx -= fx;
					nodeB.fy -= fy;
				}
			}

			// Attraction along links (Spring force)
			for (const link of links) {
				const sourceNode = nodes.find((n: Node) => n.id === link.source);
				const targetNode = nodes.find((n: Node) => n.id === link.target);
				if (!sourceNode || !targetNode) continue;

				const dx = targetNode.x - sourceNode.x;
				const dy = targetNode.y - sourceNode.y;
				const dist = Math.sqrt(dx * dx + dy * dy) || 1;

				// Ideal distance based on link strength (stronger link = shorter distance)
				const idealDist = 150 / Math.sqrt(link.strength);
				const displacement = dist - idealDist;

				const force = k * displacement;
				const fx = (dx / dist) * force;
				const fy = (dy / dist) * force;

				sourceNode.fx += fx;
				sourceNode.fy += fy;
				targetNode.fx -= fx;
				targetNode.fy -= fy;
			}

			// Center gravity and Update Positions
			for (const node of nodes) {
				// Pull to center
				node.fx += (centerX - node.x) * centerForce;
				node.fy += (centerY - node.y) * centerForce;

				// Update velocity (Verlet-ish)
				node.vx = (node.vx + node.fx * dt) * damping;
				node.vy = (node.vy + node.fy * dt) * damping;

				// Update position
				node.x += node.vx * dt;
				node.y += node.vy * dt;

				// Simple boundary constraint
				const margin = node.radius;
				node.x = Math.max(margin, Math.min(width - margin, node.x));
				node.y = Math.max(margin, Math.min(height - margin, node.y));
			}
		}

		setSimulationNodes(nodes);
	}, [initialNodes, links, centerX, centerY]);

	if (people.length < 2 || links.length === 0) {
		return null;
	}

	return (
		<div className="w-full overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
			<h2 className="text-xl font-bold mb-6 flex items-center gap-2">
				{/* biome-ignore lint/style/noJsxLiterals: decorative emoji */}
				<span className="text-indigo-600">🕸️</span>
				{t("people.globalNetwork.title")}
			</h2>

			<div className="relative w-full aspect-[4/3] max-h-[600px] bg-slate-50 rounded-xl overflow-hidden border border-gray-100">
				{simulationNodes.length === 0 ? (
					<div className="w-full h-full flex items-center justify-center text-gray-400">
						{t("people.globalNetwork.loading")}
					</div>
				) : (
					<svg
						ref={svgRef}
						viewBox={`0 0 ${width} ${height}`}
						className="w-full h-full"
						style={{ overflow: "visible" }}
					>
						{/* Links */}
						{links.map((link) => {
							const source = simulationNodes.find((n) => n.id === link.source);
							const target = simulationNodes.find((n) => n.id === link.target);
							if (!source || !target) return null;

							return (
								<line
									key={`${link.source}-${link.target}`}
									x1={source.x}
									y1={source.y}
									x2={target.x}
									y2={target.y}
									stroke="#CBD5E1"
									strokeWidth={Math.max(
										1,
										Math.min(5, Math.sqrt(link.strength)),
									)}
									strokeOpacity={0.6}
									strokeLinecap="round"
								/>
							);
						})}

						{/* Nodes */}
						{simulationNodes.map((node) => {
							const isHovered = hoveredNode === node.id;
							const displayRadius = isHovered
								? node.radius * 1.15
								: node.radius;

							return (
								<Link key={node.id} href={`/people/${node.id}`}>
									{/* biome-ignore lint/a11y/noStaticElementInteractions: SVG group for hover effects inside Link */}
									<g
										onMouseEnter={() => setHoveredNode(node.id)}
										onMouseLeave={() => setHoveredNode(null)}
										style={{ cursor: "pointer" }}
									>
										{/* Hit Area */}
										<circle
											cx={node.x}
											cy={node.y}
											r={node.radius * 1.5}
											fill="transparent"
										/>

										{/* Node Body */}
										<circle
											cx={node.x}
											cy={node.y}
											r={displayRadius}
											fill={isHovered ? "#EEF2FF" : "white"}
											stroke={isHovered ? "#4F46E5" : "#94A3B8"}
											strokeWidth={isHovered ? 3 : 2}
											className="transition-all duration-200 ease-out shadow-sm"
										/>

										{/* Initials (if large enough) */}
										{node.radius > 18 && (
											<text
												x={node.x}
												y={node.y}
												dy=".35em"
												textAnchor="middle"
												fill={isHovered ? "#4F46E5" : "#64748B"}
												fontSize={Math.max(10, node.radius * 0.7)}
												fontWeight="bold"
												pointerEvents="none"
												className="select-none"
											>
												{node.name.slice(0, 2).toUpperCase()}
											</text>
										)}

										{/* Tooltip Label */}
										<text
											x={node.x}
											y={node.y + displayRadius + 16}
											textAnchor="middle"
											className={`text-xs font-medium fill-gray-700 pointer-events-none select-none transition-opacity duration-200 ${
												isHovered ? "opacity-100" : "opacity-0"
											} bg-white`}
											style={{ textShadow: "0 1px 2px rgba(255,255,255,0.8)" }}
										>
											{node.name}
										</text>
									</g>
								</Link>
							);
						})}
					</svg>
				)}
			</div>

			<p className="text-sm text-gray-400 text-center mt-3 italic">
				{t("people.globalNetwork.description")}
			</p>
		</div>
	);
}

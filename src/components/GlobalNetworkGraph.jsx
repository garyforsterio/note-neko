"use client";

Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalNetworkGraph = GlobalNetworkGraph;
var next_intl_1 = require("next-intl");
var react_1 = require("react");
var navigation_1 = require("#i18n/navigation");
function GlobalNetworkGraph(_a) {
    var people = _a.people;
    var t = (0, next_intl_1.useTranslations)();
    var _b = (0, react_1.useState)(null), hoveredNode = _b[0], setHoveredNode = _b[1];
    var _c = (0, react_1.useState)([]), simulationNodes = _c[0], setSimulationNodes = _c[1];
    var svgRef = (0, react_1.useRef)(null);
    // Configuration
    var width = 800;
    var height = 600;
    var centerX = width / 2;
    var centerY = height / 2;
    // Process data into nodes and links
    var _d = (0, react_1.useMemo)(() => {
        var nodes = people.map((p) => ({
            id: p.id,
            name: p.name,
            x: centerX + (Math.random() - 0.5) * 200,
            y: centerY + (Math.random() - 0.5) * 200,
            vx: 0,
            vy: 0,
            radius: 20,
            connections: 0,
        }));
        var linksMap = new Map();
        // Calculate connections based on shared diary entries
        for (var _i = 0, people_1 = people; _i < people_1.length; _i++) {
            var person = people_1[_i];
            for (var _a = 0, _b = person.mentions; _a < _b.length; _a++) {
                var mention = _b[_a];
                var entryMentions = mention.diaryEntry.mentions;
                if (entryMentions.length <= 1)
                    continue;
                for (var _c = 0, entryMentions_1 = entryMentions; _c < entryMentions_1.length; _c++) {
                    var m = entryMentions_1[_c];
                    if (m.person.id === person.id)
                        continue;
                    // Create a unique key for the pair (sorted to avoid duplicates A-B vs B-A)
                    var _d = [person.id, m.person.id].sort(), source = _d[0], target = _d[1];
                    var key = "".concat(source, "-").concat(target);
                    linksMap.set(key, (linksMap.get(key) || 0) + 1);
                }
            }
        }
        var links = Array.from(linksMap.entries()).map((_a) => {
            var key = _a[0], count = _a[1];
            var _b = key.split("-"), source = _b[0], target = _b[1];
            return { source: source, target: target, strength: count };
        });
        var _loop_1 = (link) => {
            var sourceNode = nodes.find((n) => n.id === link.source);
            var targetNode = nodes.find((n) => n.id === link.target);
            if (sourceNode)
                sourceNode.connections += link.strength;
            if (targetNode)
                targetNode.connections += link.strength;
        };
        // Update node connection counts and radius
        for (var _e = 0, links_1 = links; _e < links_1.length; _e++) {
            var link = links_1[_e];
            _loop_1(link);
        }
        nodes.forEach((n) => {
            n.radius = Math.max(15, Math.min(40, 15 + Math.sqrt(n.connections) * 3));
        });
        return { initialNodes: nodes, links: links };
    }, [people, centerX, centerY]), initialNodes = _d.initialNodes, links = _d.links;
    // Run Simulation
    (0, react_1.useEffect)(() => {
        var nodes = JSON.parse(JSON.stringify(initialNodes)); // Deep copy to avoid mutating prop-derived state
        var iterations = 300;
        var k = 0.1; // Spring constant
        var repulsion = 5000;
        var centerForce = 0.05;
        var damping = 0.8;
        var dt = 0.5;
        for (var i = 0; i < iterations; i++) {
            // Reset forces
            for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
                var node = nodes_1[_i];
                node.fx = 0;
                node.fy = 0;
            }
            // Repulsion between all nodes
            for (var a = 0; a < nodes.length; a++) {
                for (var b = a + 1; b < nodes.length; b++) {
                    var nodeA = nodes[a];
                    var nodeB = nodes[b];
                    var dx = nodeA.x - nodeB.x;
                    var dy = nodeA.y - nodeB.y;
                    var distSq = dx * dx + dy * dy || 1; // Avoid division by zero
                    var dist = Math.sqrt(distSq);
                    var force = repulsion / distSq;
                    var fx = (dx / dist) * force;
                    var fy = (dy / dist) * force;
                    nodeA.fx += fx;
                    nodeA.fy += fy;
                    nodeB.fx -= fx;
                    nodeB.fy -= fy;
                }
            }
            var _loop_2 = (link) => {
                var sourceNode = nodes.find((n) => n.id === link.source);
                var targetNode = nodes.find((n) => n.id === link.target);
                if (!sourceNode || !targetNode)
                    return "continue";
                var dx = targetNode.x - sourceNode.x;
                var dy = targetNode.y - sourceNode.y;
                var dist = Math.sqrt(dx * dx + dy * dy) || 1;
                // Ideal distance based on link strength (stronger link = shorter distance)
                var idealDist = 150 / Math.sqrt(link.strength);
                var displacement = dist - idealDist;
                var force = k * displacement;
                var fx = (dx / dist) * force;
                var fy = (dy / dist) * force;
                sourceNode.fx += fx;
                sourceNode.fy += fy;
                targetNode.fx -= fx;
                targetNode.fy -= fy;
            };
            // Attraction along links (Spring force)
            for (var _a = 0, links_2 = links; _a < links_2.length; _a++) {
                var link = links_2[_a];
                _loop_2(link);
            }
            // Center gravity and Update Positions
            for (var _b = 0, nodes_2 = nodes; _b < nodes_2.length; _b++) {
                var node = nodes_2[_b];
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
                var margin = node.radius;
                node.x = Math.max(margin, Math.min(width - margin, node.x));
                node.y = Math.max(margin, Math.min(height - margin, node.y));
            }
        }
        setSimulationNodes(nodes);
    }, [initialNodes, links, centerX, centerY]);
    if (people.length < 2 || links.length === 0) {
        return null;
    }
    return (<div className="w-full overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
			<h2 className="text-xl font-bold mb-6 flex items-center gap-2">
				<span className="text-indigo-600">🕸️</span>
				{t("people.globalNetwork.title")}
			</h2>

			<div className="relative w-full aspect-[4/3] max-h-[600px] bg-slate-50 rounded-xl overflow-hidden border border-gray-100">
				{simulationNodes.length === 0 ? (<div className="w-full h-full flex items-center justify-center text-gray-400">
						{t("people.globalNetwork.loading")}
					</div>) : (<svg ref={svgRef} viewBox={"0 0 ".concat(width, " ").concat(height)} className="w-full h-full" style={{ overflow: "visible" }}>
						{/* Links */}
						{links.map((link) => {
                var source = simulationNodes.find((n) => n.id === link.source);
                var target = simulationNodes.find((n) => n.id === link.target);
                if (!source || !target)
                    return null;
                return (<line key={"".concat(link.source, "-").concat(link.target)} x1={source.x} y1={source.y} x2={target.x} y2={target.y} stroke="#CBD5E1" strokeWidth={Math.max(1, Math.min(5, Math.sqrt(link.strength)))} strokeOpacity={0.6} strokeLinecap="round"/>);
            })}

						{/* Nodes */}
						{simulationNodes.map((node) => {
                var isHovered = hoveredNode === node.id;
                var displayRadius = isHovered
                    ? node.radius * 1.15
                    : node.radius;
                return (<navigation_1.Link key={node.id} href={"/people/".concat(node.id)}>
									{/* biome-ignore lint/a11y/noStaticElementInteractions: SVG group for hover effects inside Link */}
									<g onMouseEnter={() => setHoveredNode(node.id)} onMouseLeave={() => setHoveredNode(null)} style={{ cursor: "pointer" }}>
										{/* Hit Area */}
										<circle cx={node.x} cy={node.y} r={node.radius * 1.5} fill="transparent"/>

										{/* Node Body */}
										<circle cx={node.x} cy={node.y} r={displayRadius} fill={isHovered ? "#EEF2FF" : "white"} stroke={isHovered ? "#4F46E5" : "#94A3B8"} strokeWidth={isHovered ? 3 : 2} className="transition-all duration-200 ease-out shadow-sm"/>

										{/* Initials (if large enough) */}
										{node.radius > 18 && (<text x={node.x} y={node.y} dy=".35em" textAnchor="middle" fill={isHovered ? "#4F46E5" : "#64748B"} fontSize={Math.max(10, node.radius * 0.7)} fontWeight="bold" pointerEvents="none" className="select-none">
												{node.name.slice(0, 2).toUpperCase()}
											</text>)}

										{/* Tooltip Label */}
										<text x={node.x} y={node.y + displayRadius + 16} textAnchor="middle" className={"text-xs font-medium fill-gray-700 pointer-events-none select-none transition-opacity duration-200 ".concat(isHovered ? "opacity-100" : "opacity-0", " bg-white")} style={{ textShadow: "0 1px 2px rgba(255,255,255,0.8)" }}>
											{node.name}
										</text>
									</g>
								</navigation_1.Link>);
            })}
					</svg>)}
			</div>

			<p className="text-sm text-gray-400 text-center mt-3 italic">
				{t("people.globalNetwork.description")}
			</p>
		</div>);
}

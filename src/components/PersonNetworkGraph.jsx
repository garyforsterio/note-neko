"use client";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.hasOwn(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonNetworkGraph = PersonNetworkGraph;
var lucide_react_1 = require("lucide-react");
var next_intl_1 = require("next-intl");
var react_1 = require("react");
var navigation_1 = require("#i18n/navigation");
function PersonNetworkGraph(_a) {
    var currentPerson = _a.currentPerson, mentions = _a.mentions;
    var t = (0, next_intl_1.useTranslations)();
    var _b = (0, react_1.useState)(null), hoveredNode = _b[0], setHoveredNode = _b[1];
    // Process data to find connections
    var connections = (0, react_1.useMemo)(() => {
        var stats = new Map();
        for (var _i = 0, mentions_1 = mentions; _i < mentions_1.length; _i++) {
            var mention = mentions_1[_i];
            var entryMentions = mention.diaryEntry.mentions;
            // If there's only the current person, skip
            if (entryMentions.length <= 1)
                continue;
            for (var _a = 0, entryMentions_1 = entryMentions; _a < entryMentions_1.length; _a++) {
                var m = entryMentions_1[_a];
                if (m.person.id === currentPerson.id)
                    continue;
                var existing = stats.get(m.person.id);
                if (existing) {
                    existing.count++;
                }
                else {
                    stats.set(m.person.id, {
                        name: m.person.name,
                        count: 1,
                    });
                }
            }
        }
        return Array.from(stats.entries())
            .map((_a) => {
            var id = _a[0], data = _a[1];
            return (__assign({ id: id }, data));
        })
            .sort((a, b) => b.count - a.count)
            .slice(0, 12); // Limit to top 12 connections to avoid crowding
    }, [mentions, currentPerson.id]);
    if (connections.length === 0) {
        return null;
    }
    // Layout configuration
    var width = 600;
    var height = 400;
    var centerX = width / 2;
    var centerY = height / 2;
    var centerRadius = 40;
    var orbitRadius = 140;
    // Calculate positions
    var nodes = connections.map((node, i) => {
        var angle = (i / connections.length) * 2 * Math.PI - Math.PI / 2; // Start from top
        return __assign(__assign({}, node), { x: centerX + orbitRadius * Math.cos(angle), y: centerY + orbitRadius * Math.sin(angle), radius: Math.max(20, Math.min(30, 15 + node.count * 2)) });
    });
    return (<div className="w-full overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
			<h2 className="text-xl font-bold mb-6 flex items-center gap-2">
				<span className="text-indigo-600">🕸️</span>
				{t("people.network.title")}
			</h2>

			<div className="relative w-full aspect-[3/2] max-h-[500px]">
				<svg viewBox={"0 0 ".concat(width, " ").concat(height)} className="w-full h-full" style={{ overflow: "visible" }}>
					{/* Connections (Lines) */}
					{nodes.map((node) => (<line key={"link-".concat(node.id)} x1={centerX} y1={centerY} x2={node.x} y2={node.y} stroke="#E0E7FF" strokeWidth={Math.max(1, Math.min(4, node.count))} strokeLinecap="round"/>))}

					{/* Center Node (Current Person) */}
					<g>
						<circle cx={centerX} cy={centerY} r={centerRadius} fill="white" stroke="#4F46E5" strokeWidth="3" className="shadow-md"/>
						<foreignObject x={centerX - centerRadius} y={centerY - centerRadius} width={centerRadius * 2} height={centerRadius * 2}>
							<div className="w-full h-full flex items-center justify-center text-indigo-600">
								<lucide_react_1.User size={32}/>
							</div>
						</foreignObject>
					</g>

					{/* Connected Nodes */}
					{nodes.map((node) => {
            var isHovered = hoveredNode === node.id;
            var displayRadius = isHovered ? node.radius * 1.15 : node.radius;
            return (<navigation_1.Link key={node.id} href={"/people/".concat(node.id)}>
								{/* biome-ignore lint/a11y/noStaticElementInteractions: SVG group for hover effects inside Link */}
								<g onMouseEnter={() => setHoveredNode(node.id)} onMouseLeave={() => setHoveredNode(null)} style={{ cursor: "pointer" }}>
									{/* Stable Invisible Hit Target */}
									<circle cx={node.x} cy={node.y} r={node.radius * 1.5} // Larger hit area
             fill="transparent"/>

									{/* Visible Node Circle */}
									<circle cx={node.x} cy={node.y} r={displayRadius} fill={isHovered ? "#EEF2FF" : "white"} stroke={isHovered ? "#4F46E5" : "#94A3B8"} strokeWidth="2" className="transition-all duration-200 ease-out"/>

									{/* Initials */}
									<text x={node.x} y={node.y} dy=".35em" textAnchor="middle" fill={isHovered ? "#4F46E5" : "#64748B"} fontSize={Math.max(10, node.radius * 0.8)} fontWeight="bold" pointerEvents="none" className="transition-colors duration-200">
										{node.name.slice(0, 2).toUpperCase()}
									</text>

									{/* Tooltip Label */}
									<text x={node.x} y={node.y + displayRadius + 16} textAnchor="middle" className={"text-xs font-medium fill-gray-600 transition-opacity duration-200 ".concat(isHovered ? "opacity-100" : "opacity-0")}>
										{node.name} ({node.count})
									</text>
								</g>
							</navigation_1.Link>);
        })}
				</svg>
			</div>

			<p className="text-sm text-gray-400 text-center mt-2 italic">
				{t("people.network.description")}
			</p>
		</div>);
}

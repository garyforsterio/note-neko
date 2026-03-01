"use client";

import { useTranslations } from "next-intl";

export default function DemoAnimation() {
	const t = useTranslations("home.demo");

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
			{/* Left: Simulated diary entry with typewriter effect */}
			<div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
				<div className="flex items-center gap-2 mb-4">
					<div className="w-3 h-3 rounded-full bg-red-400" />
					<div className="w-3 h-3 rounded-full bg-yellow-400" />
					<div className="w-3 h-3 rounded-full bg-green-400" />
					<span className="ml-2 text-sm text-gray-400 font-medium">
						{t("diaryTitle")}
					</span>
				</div>
				<div className="font-mono text-sm leading-relaxed text-gray-700">
					<p className="demo-typewriter demo-line-1">{t("line1")}</p>
					<p className="demo-typewriter demo-line-2 mt-2">{t("line2")}</p>
					<p className="demo-typewriter demo-line-3 mt-2">{t("line3")}</p>
				</div>
			</div>

			{/* Right: Person profile card that fades in */}
			<div className="demo-profile-card bg-white rounded-xl shadow-lg p-6 border border-gray-200">
				<div className="flex items-center gap-2 mb-2">
					<span className="text-xs font-semibold uppercase tracking-wide text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
						{t("aiExtracted")}
					</span>
				</div>
				<div className="flex items-center gap-4 mb-4">
					<div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
						{t("profileInitial")}
					</div>
					<div>
						<h4 className="text-lg font-semibold text-gray-900">
							{t("profileName")}
						</h4>
						<p className="text-sm text-gray-500">{t("profileRelation")}</p>
					</div>
				</div>
				<div className="space-y-2 text-sm">
					<div className="flex items-center gap-2 text-gray-600">
						<span className="text-indigo-500">{"\u25CF"}</span>
						<span>{t("profileDetail1")}</span>
					</div>
					<div className="flex items-center gap-2 text-gray-600">
						<span className="text-indigo-500">{"\u25CF"}</span>
						<span>{t("profileDetail2")}</span>
					</div>
					<div className="flex items-center gap-2 text-gray-600">
						<span className="text-indigo-500">{"\u25CF"}</span>
						<span>{t("profileDetail3")}</span>
					</div>
				</div>
			</div>

			{/* Arrow connector (visible on md+) */}
			<div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 demo-arrow">
				<svg
					width="48"
					height="48"
					viewBox="0 0 48 48"
					fill="none"
					className="text-indigo-400"
				>
					<title>{t("arrowAlt")}</title>
					<path
						d="M8 24h28m0 0l-8-8m8 8l-8 8"
						stroke="currentColor"
						strokeWidth="3"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</div>

			{/* CSS-only animations */}
			<style>
				{`
					/* Typewriter effect */
					.demo-typewriter {
						overflow: hidden;
						white-space: nowrap;
						border-right: 2px solid transparent;
						width: 0;
					}

					.demo-line-1 {
						animation:
							demo-type 1.5s steps(40, end) 0.5s forwards,
							demo-cursor 0.6s step-end 0.5s 3;
					}
					.demo-line-2 {
						animation:
							demo-type 1.5s steps(40, end) 2.5s forwards,
							demo-cursor 0.6s step-end 2.5s 3;
					}
					.demo-line-3 {
						animation:
							demo-type 1.5s steps(40, end) 4.5s forwards,
							demo-cursor 0.6s step-end 4.5s 3;
					}

					@keyframes demo-type {
						from { width: 0; }
						to { width: 100%; }
					}

					@keyframes demo-cursor {
						from, to { border-color: transparent; }
						50% { border-color: #6366f1; }
					}

					/* Profile card fade in */
					.demo-profile-card {
						opacity: 0;
						transform: translateY(12px);
						animation: demo-fade-in 0.8s ease-out forwards;
						animation-delay: 6s;
					}

					@keyframes demo-fade-in {
						to {
							opacity: 1;
							transform: translateY(0);
						}
					}

					/* Arrow animation */
					.demo-arrow {
						opacity: 0;
						animation: demo-fade-in 0.5s ease-out forwards;
						animation-delay: 5.8s;
					}

					/* Respect reduced motion */
					@media (prefers-reduced-motion: reduce) {
						.demo-typewriter {
							animation: none;
							width: 100%;
							white-space: normal;
						}
						.demo-profile-card,
						.demo-arrow {
							animation: none;
							opacity: 1;
							transform: none;
						}
					}
				`}
			</style>
		</div>
	);
}

"use client";

import { BookOpen, Settings, Users, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { use, useCallback, useState } from "react";
import { Link, usePathname, useRouter } from "#i18n/navigation";
import { cn } from "#lib/utils";
import Calendar from "./Calendar";

interface NavigationProps {
	entries: Promise<{
		entries: {
			id: string;
			date: Date;
		}[];
		total: number;
	}>;
}

const navigation = [
	{
		name: "Diary",
		href: "/diary",
		icon: BookOpen,
	},
	{
		name: "People",
		href: "/people",
		icon: Users,
	},
];

export default function Navigation({
	entries: entriesPromise,
}: NavigationProps) {
	const t = useTranslations();
	const entries = use(entriesPromise);
	const pathname = usePathname();
	const router = useRouter();
	const searchParams = useSearchParams();
	const pageSize = searchParams.get("pageSize") || "10";
	const startDate = searchParams.get("startDate");
	const endDate = searchParams.get("endDate");
	const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

	const updateFilters = useCallback(
		(updates: Record<string, string | null>) => {
			const params = new URLSearchParams(searchParams.toString());
			for (const [key, value] of Object.entries(updates)) {
				if (value === null) {
					params.delete(key);
				} else {
					params.set(key, value);
				}
			}
			router.push(`/diary?${params.toString()}`);
		},
		[router, searchParams],
	);

	const handleDateRangeChange = useCallback(
		(start: Date | null, end: Date | null) => {
			updateFilters({
				startDate: start?.toISOString().split("T")[0] || null,
				endDate: end?.toISOString().split("T")[0] || null,
			});
		},
		[updateFilters],
	);

	const clearDateRange = useCallback(() => {
		updateFilters({
			startDate: null,
			endDate: null,
		});
	}, [updateFilters]);

	return (
		<>
			{/* Desktop Sidebar */}
			<div className="hidden md:fixed md:inset-y-0 md:flex md:w-72 md:flex-col">
				<div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
					<div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
						<div className="flex flex-shrink-0 items-center px-4">
							<Link href="/" className="text-xl font-bold text-gray-900">
								Note Neko
							</Link>
						</div>
						<nav className="mt-5 flex-1 space-y-1 bg-white px-2">
							{navigation.map((item) => {
								const isActive = pathname.startsWith(item.href);
								return (
									<Link
										key={item.name}
										href={item.href}
										className={cn(
											isActive
												? "bg-gray-100 text-gray-900"
												: "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
											"group flex items-center px-2 py-2 text-sm font-medium rounded-md",
										)}
									>
										<item.icon
											className={cn(
												isActive
													? "text-gray-500"
													: "text-gray-400 group-hover:text-gray-500",
												"mr-3 flex-shrink-0 h-6 w-6",
											)}
											aria-hidden="true"
										/>
										{item.name}
									</Link>
								);
							})}
						</nav>

						{pathname.startsWith("/diary") && (
							<div className="px-4 pb-4 space-y-4">
								<div className="flex items-center justify-between">
									<h3 className="text-sm font-medium text-gray-700">
										{t("diary.itemsPerPage")}
									</h3>
									<select
										value={pageSize}
										onChange={(e) =>
											updateFilters({ pageSize: e.target.value })
										}
										className="block w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
									>
										<option value="5">5</option>
										<option value="10">10</option>
										<option value="20">20</option>
										<option value="50">50</option>
									</select>
								</div>

								{(startDate || endDate) && (
									<div className="flex items-center justify-between text-sm text-gray-600">
										<span>
											{startDate && endDate
												? `${startDate} - ${endDate}`
												: startDate || endDate}
										</span>
										<button
											type="button"
											onClick={clearDateRange}
											className="p-1 hover:bg-gray-100 rounded-full transition-colors"
											title={t("diary.clearDateRange")}
										>
											<X className="h-4 w-4" />
										</button>
									</div>
								)}

								{entries && (
									<Calendar
										entries={entries.entries}
										onDateRangeChange={handleDateRangeChange}
									/>
								)}
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Mobile Navigation */}
			<div className="md:hidden">
				{/* Floating Action Button */}
				{pathname.startsWith("/diary") && (
					<button
						type="button"
						onClick={() => setIsMobileFiltersOpen(true)}
						className="fixed bottom-20 right-4 z-20 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
						title={t("diary.filters")}
					>
						<Settings className="h-6 w-6" />
					</button>
				)}

				<div className="fixed inset-x-0 bottom-0 z-10 bg-white border-t border-gray-200">
					<nav className="flex justify-around">
						{navigation.map((item) => {
							const isActive = pathname.startsWith(item.href);
							return (
								<Link
									key={item.name}
									href={item.href}
									className={cn(
										isActive
											? "text-blue-600"
											: "text-gray-500 hover:text-gray-900",
										"flex flex-col items-center px-3 py-2 text-sm font-medium",
									)}
								>
									<item.icon
										className={cn(
											isActive ? "text-blue-600" : "text-gray-400",
											"h-6 w-6",
										)}
										aria-hidden="true"
									/>
									<span className="mt-1">{item.name}</span>
								</Link>
							);
						})}
					</nav>
				</div>

				{/* Bottom Sheet */}
				<div
					className={cn(
						"fixed inset-0 bg-black transition-opacity duration-300",
						isMobileFiltersOpen
							? "bg-opacity-50 z-40"
							: "bg-opacity-0 pointer-events-none",
					)}
					onClick={() => setIsMobileFiltersOpen(false)}
					onKeyDown={(e) => {
						if (e.key === "Enter" || e.key === " ") {
							setIsMobileFiltersOpen(false);
						}
					}}
					role="button"
					tabIndex={0}
				/>
				<div
					className={cn(
						"fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl shadow-xl transition-transform duration-300 ease-in-out transform",
						isMobileFiltersOpen ? "translate-y-0" : "translate-y-full",
					)}
				>
					<div className="p-4">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-lg font-semibold text-gray-900">
								{t("diary.filters")}
							</h3>
							<button
								type="button"
								onClick={() => setIsMobileFiltersOpen(false)}
								className="p-2 text-gray-400 hover:text-gray-500"
							>
								<X className="h-6 w-6" />
							</button>
						</div>

						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<h4 className="text-sm font-medium text-gray-700">
									{t("diary.itemsPerPage")}
								</h4>
								<select
									value={pageSize}
									onChange={(e) => {
										updateFilters({ pageSize: e.target.value });
										setIsMobileFiltersOpen(false);
									}}
									className="block w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
								>
									<option value="5">5</option>
									<option value="10">10</option>
									<option value="20">20</option>
									<option value="50">50</option>
								</select>
							</div>

							{(startDate || endDate) && (
								<div className="flex items-center justify-between text-sm text-gray-600">
									<span>
										{startDate && endDate
											? `${startDate} - ${endDate}`
											: startDate || endDate}
									</span>
									<button
										type="button"
										onClick={() => {
											clearDateRange();
											setIsMobileFiltersOpen(false);
										}}
										className="p-1 hover:bg-gray-100 rounded-full transition-colors"
										title={t("diary.clearDateRange")}
									>
										<X className="h-4 w-4" />
									</button>
								</div>
							)}

							{entries && (
								<div className="mt-4">
									<h4 className="text-sm font-medium text-gray-700 mb-2">
										{t("diary.selectDateRange")}
									</h4>
									<Calendar
										entries={entries.entries}
										onDateRangeChange={(start, end) => {
											handleDateRangeChange(start, end);
											setIsMobileFiltersOpen(false);
										}}
									/>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

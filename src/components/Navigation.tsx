"use client";

import {
	BookOpen,
	Bug,
	CreditCard,
	LogOut,
	Settings,
	Share2,
	Shield,
	User,
	Users,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { logout } from "#actions/auth";
import { Link, usePathname } from "#i18n/navigation";
import { cn } from "#lib/utils";

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
	{
		name: "Settings",
		href: "/settings",
		icon: Settings,
		subItems: [
			{
				name: "profile",
				href: "/settings/profile",
				icon: User,
			},
			{
				name: "social",
				href: "/settings/social",
				icon: Share2,
			},
			{
				name: "privacy",
				href: "/settings/privacy",
				icon: Shield,
			},
			{
				name: "account",
				href: "/settings/account",
				icon: CreditCard,
			},
		],
	},
];

export default function Navigation() {
	const t = useTranslations();
	const pathname = usePathname();

	return (
		<>
			{/* Desktop Sidebar */}
			<div className="hidden md:fixed md:inset-y-0 md:flex md:w-72 md:flex-col">
				<div className="flex min-h-0 flex-1 flex-col border-r border-gray-100 bg-white shadow-[1px_0_20px_0_rgba(0,0,0,0.02)]">
					{/* Brand */}
					<div className="flex h-20 flex-shrink-0 items-center px-8">
						<Link
							href="/"
							className="text-2xl font-serif font-bold text-gray-900 tracking-tight"
						>
							Note Neko
						</Link>
					</div>

					{/* Navigation Links */}
					<nav className="flex-1 space-y-2 px-4 py-6">
						{navigation.map((item) => {
							const isActive = pathname.startsWith(item.href);
							const isSettingsSection =
								item.name === "Settings" && pathname.startsWith("/settings");

							return (
								<div key={item.name} className="space-y-1">
									<Link
										href={item.href}
										className={cn(
											isActive
												? "bg-gray-900 text-white shadow-md shadow-gray-200"
												: "text-gray-500 hover:bg-gray-50 hover:text-gray-900",
											"group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ease-in-out",
										)}
									>
										<item.icon
											className={cn(
												isActive
													? "text-white"
													: "text-gray-400 group-hover:text-gray-600",
												"mr-3 flex-shrink-0 h-5 w-5 transition-colors",
											)}
											aria-hidden="true"
										/>
										{item.name}
									</Link>

									{/* Settings Subitems */}
									{isSettingsSection && item.subItems && (
										<div className="mt-2 ml-4 pl-4 border-l border-gray-100 space-y-0.5">
											{item.subItems.map((subItem) => {
												const isSubActive =
													pathname === subItem.href ||
													pathname.startsWith(`${subItem.href}/`);
												return (
													<Link
														key={subItem.name}
														href={subItem.href}
														className={cn(
															isSubActive
																? "bg-gray-100 text-gray-900 font-semibold"
																: "text-gray-500 hover:bg-gray-50 hover:text-gray-700",
															"group flex items-center px-4 py-2 text-sm rounded-lg transition-colors",
														)}
													>
														<subItem.icon
															className={cn(
																isSubActive
																	? "text-gray-900"
																	: "text-gray-400 group-hover:text-gray-600",
																"mr-3 flex-shrink-0 h-4 w-4",
															)}
															aria-hidden="true"
														/>
														{t(`settings.navigation.${subItem.name}`)}
													</Link>
												);
											})}

											{/* Logout and Feedback Buttons */}
											<div className="pt-2 mt-2 border-t border-gray-100 space-y-1">
												<button
													type="button"
													id="sentry-feedback-button"
													className="group flex items-center w-full px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
												>
													<Bug className="mr-3 flex-shrink-0 h-4 w-4 text-gray-400 group-hover:text-gray-600" />
													Report a Bug
												</button>
												<button
													type="button"
													onClick={async () => {
														if (confirm(t("settings.logout.confirm"))) {
															await logout();
														}
													}}
													className="group flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
												>
													<LogOut className="mr-3 flex-shrink-0 h-4 w-4" />
													{t("settings.logout.title")}
												</button>
											</div>
										</div>
									)}
								</div>
							);
						})}
					</nav>
				</div>
			</div>

			{/* Mobile Bottom Navigation */}
			<div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 pb-[env(safe-area-inset-bottom)]">
				<div className="flex justify-around items-center h-16 px-2">
					{navigation.map((item) => {
						const isActive = pathname.startsWith(item.href);
						return (
							<Link
								key={item.name}
								href={item.href}
								className={cn(
									"flex flex-col items-center justify-center w-full h-full space-y-1 active:scale-95 transition-transform",
									isActive
										? "text-gray-900"
										: "text-gray-400 hover:text-gray-600",
								)}
							>
								<item.icon
									className={cn(
										"h-6 w-6 transition-colors",
										isActive ? "text-gray-900" : "text-gray-400",
									)}
								/>
								<span className="text-[10px] font-medium">{item.name}</span>
							</Link>
						);
					})}
				</div>
			</div>
		</>
	);
}

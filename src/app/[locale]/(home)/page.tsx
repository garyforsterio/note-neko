import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "#i18n/navigation";

import DemoAnimation from "./DemoAnimation";
import Emma from "./emma.svg";
import GithubIcon from "./github.svg";
import HeroImage from "./hero-image.png";
import Michael from "./michael.svg";
import Sarah from "./sarah.svg";

export default async function Home() {
	const t = await getTranslations("home");

	return (
		<div className="min-h-screen">
			{/* Hero Section */}
			<div className="relative h-[60vh] overflow-hidden">
				<div className="absolute inset-0">
					<div className="fixed top-0 left-0 w-full h-[60vh] -z-10">
						<Image
							src={HeroImage}
							alt={t("hero.heroImageAlt")}
							fill
							className="object-cover"
							priority
							placeholder="blur"
						/>
					</div>
					<div className="absolute inset-0 bg-black/40" />
				</div>
				{/* GitHub Link */}
				<a
					href="https://github.com/garyforsterio/life-tracker"
					target="_blank"
					rel="noopener noreferrer"
					className="absolute top-4 right-4 z-20 text-white hover:text-gray-300 transition-colors"
				>
					<Image
						src={GithubIcon}
						alt={t("footer.githubAlt")}
						className="h-8 w-8 text-white"
					/>
				</a>
				<div className="relative h-full flex items-center justify-center text-center px-4 z-10">
					<div className="max-w-3xl">
						<h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
							{t("hero.title")}
						</h1>
						<p className="text-xl text-gray-100 mb-8">{t("hero.subtitle")}</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Link
								href="/auth/signup"
								className="inline-block bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
							>
								{t("hero.cta")}
							</Link>
							<a
								href="https://github.com/garyforsterio/life-tracker"
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center gap-2 border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
							>
								<Image
									src={GithubIcon}
									alt=""
									className="h-5 w-5"
									aria-hidden="true"
								/>
								{t("hero.githubCta")}
							</a>
						</div>
					</div>
				</div>
			</div>

			{/* Animated Demo Section */}
			<div className="bg-gray-50 py-16 md:py-24">
				<div className="max-w-5xl mx-auto px-4">
					<div className="text-center mb-12">
						<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
							{t("demo.title")}
						</h2>
						<p className="text-lg text-gray-600 max-w-2xl mx-auto">
							{t("demo.subtitle")}
						</p>
					</div>
					<div className="relative">
						<DemoAnimation />
					</div>
				</div>
			</div>

			{/* Features Section */}
			<div className="bg-white py-16 md:py-24">
				<div className="max-w-7xl mx-auto px-4">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<div className="bg-gray-50 p-8 rounded-xl">
							<div className="text-4xl mb-4" aria-hidden="true">
								{"\uD83D\uDCD6"}
							</div>
							<h3 className="text-2xl font-semibold mb-4">
								{t("features.diary.title")}
							</h3>
							<p className="text-gray-600">{t("features.diary.description")}</p>
						</div>
						<div className="bg-gray-50 p-8 rounded-xl">
							<div className="text-4xl mb-4" aria-hidden="true">
								{"\uD83E\uDD1D"}
							</div>
							<h3 className="text-2xl font-semibold mb-4">
								{t("features.people.title")}
							</h3>
							<p className="text-gray-600">
								{t("features.people.description")}
							</p>
						</div>
						<div className="bg-gray-50 p-8 rounded-xl">
							<div className="text-4xl mb-4" aria-hidden="true">
								{"\uD83D\uDCCD"}
							</div>
							<h3 className="text-2xl font-semibold mb-4">
								{t("features.places.title")}
							</h3>
							<p className="text-gray-600">
								{t("features.places.description")}
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Open Source & Privacy Section */}
			<div className="bg-gray-900 text-white py-16 md:py-24">
				<div className="max-w-7xl mx-auto px-4">
					<div className="text-center mb-12">
						<h2 className="text-3xl md:text-4xl font-bold mb-4">
							{t("openSource.title")}
						</h2>
						<p className="text-lg text-gray-300 max-w-2xl mx-auto">
							{t("openSource.subtitle")}
						</p>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
						<div className="bg-gray-800 p-8 rounded-xl">
							<div className="text-4xl mb-4" aria-hidden="true">
								{"\uD83D\uDCBB"}
							</div>
							<h3 className="text-xl font-semibold mb-3">
								{t("openSource.ossTitle")}
							</h3>
							<p className="text-gray-400">{t("openSource.ossDescription")}</p>
						</div>
						<div className="bg-gray-800 p-8 rounded-xl">
							<div className="text-4xl mb-4" aria-hidden="true">
								{"\uD83D\uDD12"}
							</div>
							<h3 className="text-xl font-semibold mb-3">
								{t("openSource.privacyTitle")}
							</h3>
							<p className="text-gray-400">
								{t("openSource.privacyDescription")}
							</p>
						</div>
						<div className="bg-gray-800 p-8 rounded-xl">
							<div className="text-4xl mb-4" aria-hidden="true">
								{"\uD83C\uDFE0"}
							</div>
							<h3 className="text-xl font-semibold mb-3">
								{t("openSource.selfHostTitle")}
							</h3>
							<p className="text-gray-400">
								{t("openSource.selfHostDescription")}
							</p>
						</div>
					</div>
					<div className="text-center">
						<a
							href="https://github.com/garyforsterio/life-tracker"
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
						>
							<Image
								src={GithubIcon}
								alt=""
								className="h-5 w-5 invert"
								aria-hidden="true"
							/>
							{t("openSource.viewSource")}
						</a>
					</div>
				</div>
			</div>

			{/* Testimonials Section */}
			<div className="bg-gray-100 py-16">
				<div className="max-w-7xl mx-auto px-4">
					<h2 className="text-3xl font-bold text-center mb-12">
						{t("testimonials.title")}
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<div className="bg-white p-8 rounded-lg shadow-sm transform hover:scale-105 transition-transform duration-300">
							<div className="flex items-center mb-6">
								<div className="relative w-16 h-16 rounded-full overflow-hidden mr-4 flex-shrink-0">
									<Image
										src={Sarah}
										alt={t("testimonials.sarah.avatarAlt")}
										fill
										className="object-cover object-center"
									/>
								</div>
								<div>
									<p className="font-semibold">
										{t("testimonials.sarah.name")}
									</p>
									<p className="text-gray-500 text-sm">
										{t("testimonials.sarah.title")}
									</p>
								</div>
							</div>
							<p className="text-gray-600 italic text-lg">
								{t("testimonials.sarah.quote")}
							</p>
						</div>
						<div className="bg-white p-8 rounded-lg shadow-sm transform hover:scale-105 transition-transform duration-300">
							<div className="flex items-center mb-6">
								<div className="relative w-16 h-16 rounded-full overflow-hidden mr-4 flex-shrink-0">
									<Image
										src={Michael}
										alt={t("testimonials.michael.avatarAlt")}
										fill
										className="object-cover object-center"
									/>
								</div>
								<div>
									<p className="font-semibold">
										{t("testimonials.michael.name")}
									</p>
									<p className="text-gray-500 text-sm">
										{t("testimonials.michael.title")}
									</p>
								</div>
							</div>
							<p className="text-gray-600 italic text-lg">
								{t("testimonials.michael.quote")}
							</p>
						</div>
						<div className="bg-white p-8 rounded-lg shadow-sm transform hover:scale-105 transition-transform duration-300">
							<div className="flex items-center mb-6">
								<div className="relative w-16 h-16 rounded-full overflow-hidden mr-4 flex-shrink-0">
									<Image
										src={Emma}
										alt={t("testimonials.emma.avatarAlt")}
										fill
										className="object-cover object-center"
									/>
								</div>
								<div>
									<p className="font-semibold">{t("testimonials.emma.name")}</p>
									<p className="text-gray-500 text-sm">
										{t("testimonials.emma.title")}
									</p>
								</div>
							</div>
							<p className="text-gray-600 italic text-lg">
								{t("testimonials.emma.quote")}
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Footer */}
			<footer className="bg-gray-50 border-t border-gray-100 py-6">
				<div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-gray-500 text-sm">
					<div className="flex gap-4">
						<Link
							href="/privacy"
							className="text-gray-500 hover:text-gray-900 transition-colors"
						>
							{t("footer.privacy")}
						</Link>
						<Link
							href="/terms"
							className="text-gray-500 hover:text-gray-900 transition-colors"
						>
							{t("footer.terms")}
						</Link>
					</div>
					<p>
						{t("footer.createdBy")}{" "}
						<a
							href="https://garyforster.io"
							className="text-gray-600 hover:text-gray-900 transition-colors"
						>
							{t("footer.authorName")}
						</a>
					</p>
				</div>
			</footer>
		</div>
	);
}

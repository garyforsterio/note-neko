import createNextIntlPlugin from "next-intl/plugin";

/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				hostname: "api.dicebear.com",
			},
		],
	},
	experimental: {
		nodeMiddleware: true,
		reactCompiler: true,
		ppr: true,
		useCache: true,
	},
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);

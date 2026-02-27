declare namespace NodeJS {
	interface ProcessEnv {
		POSTGRES_PRISMA_URL: string;
		POSTGRES_URL_NON_POOLING: string;
		JWT_SECRET: string;
		OPENROUTER_API_KEY: string;
		GOOGLE_MAPS_API_KEY: string;
		SENTRY_AUTH_TOKEN?: string;
		VERCEL_OIDC_TOKEN?: string;
		NODE_ENV: "development" | "production" | "test";
	}
}

declare namespace NodeJS {
	interface ProcessEnv {
		DATABASE_URL: string;
		JWT_SECRET: string;
		OPENROUTER_API_KEY: string;
		GOOGLE_MAPS_API_KEY: string;
		SENTRY_AUTH_TOKEN?: string;
		VERCEL_OIDC_TOKEN?: string;
		STRIPE_SECRET_KEY: string;
		STRIPE_WEBHOOK_SECRET: string;
		NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: string;
		STRIPE_PRICE_ID: string;
		NODE_ENV: "development" | "production" | "test";
	}
}

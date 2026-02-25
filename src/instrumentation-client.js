
// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/
Object.defineProperty(exports, "__esModule", { value: true });
exports.onRouterTransitionStart = void 0;
var Sentry = require("@sentry/nextjs");
Sentry.init({
    dsn: "https://e543dcae14bad288339978f5c7f02922@o310913.ingest.us.sentry.io/4509516122423296",
    // Add optional integrations for additional features
    integrations: [Sentry.replayIntegration()],
    // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
    tracesSampleRate: 1,
    // Define how likely Replay events are sampled.
    // This sets the sample rate to be 10%. You may want this to be 100% while
    // in development and sample at a lower rate in production
    replaysSessionSampleRate: 0.1,
    // Define how likely Replay events are sampled when an error occurs.
    replaysOnErrorSampleRate: 1.0,
    // Setting this option to true will print useful information to the console while you're setting up Sentry.
    debug: false,
});
exports.onRouterTransitionStart = Sentry.captureRouterTransitionStart;

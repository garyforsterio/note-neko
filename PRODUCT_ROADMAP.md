# Note Neko - Launch & Product Roadmap

This document outlines the prioritized tasks for launching Note Neko, focusing on **Convenience**, **Security/Privacy**, and **Reliability**. These tasks are structured so that AI sub-agents can pick them up individually.

*Note: The initial launch will be completely free to build user base, with monetization (Stripe) planned for a later phase.*

## Phase 1: Launch Blockers (Must-Have Before Public Release)
*These tasks are critical for establishing trust, ensuring a reliable user experience, and making the app functionally ready for real users.*

### Task 1.1: Form Input Protection & Autosave (Reliability/Convenience)
- **Description:** Prevent users from losing their diary entries if they accidentally navigate away or if an error occurs during submission.
- **Agent Instructions:** 
  1. Implement a `useLeaveConfirm` hook that intercepts route changes or window unloads if the diary form is dirty.
  2. Implement local storage autosave for the diary form draft, restoring it on page load.
  3. Ensure server action errors preserve the form state instead of resetting it.
- **Launch Blocker:** Yes
- **Priority:** High

### Task 1.2: Global Error Page & Fallbacks (Reliability)
- **Description:** Create a user-friendly global error page (`global-error.tsx`) to gracefully handle unhandled exceptions in production, rather than showing a generic crash screen.
- **Agent Instructions:** Update/create `src/app/global-error.tsx` and `src/app/[locale]/error.tsx` using the existing UI components. Ensure the error pages offer a way to navigate back home and ideally log the error boundary crash to Sentry (already configured).
- **Launch Blocker:** Yes
- **Priority:** High

### Task 1.3: Bug Reporting & Feedback Mechanism (User Trust)
- **Description:** Give early users a simple way to report bugs, suggest features, or ask for help directly from the app shell.
- **Agent Instructions:** 
  1. Create a "Report Bug / Feedback" button in the sidebar or user dropdown.
  2. Implement a simple modal form (Title, Description).
  3. Create a Server Action to send this feedback either to an admin email (using `src/lib/email.ts`) or store it in a new `Feedback` database table (requires Prisma schema update).
- **Launch Blocker:** Yes
- **Priority:** High

### Task 1.4: Privacy Policy & Terms of Service (Security/Legal)
- **Description:** Create comprehensive legal pages explaining exactly how data is used, stored, and sent to third-party APIs (OpenRouter/Google Maps). Explicitly state that data is not used for training.
- **Agent Instructions:** Create `src/app/[locale]/(home)/privacy/page.tsx` and `src/app/[locale]/(home)/terms/page.tsx`. Write standard SaaS privacy/terms copy with specific clauses for AI API usage and user data ownership. Ensure translations in `messages/en.json` and `messages/ja.json`.
- **Launch Blocker:** Yes
- **Priority:** High

### Task 1.5: Data Export / Takeout Feature (Security/Trust)
- **Description:** Users need to know their data isn't trapped. Build a one-click export that zips their diary entries into Markdown files with YAML frontmatter.
- **Agent Instructions:** Create a server action or a route handler that queries all `DiaryEntry`, `Person`, and `DiaryLocation` records for the authenticated user, formats them as Markdown strings, uses `archiver` or `jszip` to create a `.zip` file, and streams it to the client.
- **Launch Blocker:** Yes
- **Priority:** High

### Task 1.6: Landing Page "Aha!" Moment Update (Marketing)
- **Description:** The homepage must visually demonstrate the AI extracting a person's profile from a diary entry.
- **Agent Instructions:** Update `src/app/[locale]/(home)/page.tsx`. Replace static hero sections with a dynamic, animated UI component or embedded video/GIF that simulates typing a diary entry and instantly generating a CRM card.
- **Launch Blocker:** Yes
- **Priority:** Medium

### Task 1.7: Comprehensive Security & Dependency Audit (Security)
- **Description:** Ensure the application is secure from common vulnerabilities before public release.
- **Agent Instructions:** 
  1. Run `pnpm audit` and fix any high/critical vulnerabilities.
  2. Implement proper Content Security Policy (CSP) headers in `next.config.mjs`.
  3. Verify Row-Level Security (RLS) or application-level authorization logic in `src/lib/dal.ts` ensures users can only access their own data.
  4. Ensure rate limiting is applied to authentication and AI entity extraction actions to prevent abuse.
  5. Audit authentication logic: ensure robust password hashing (e.g., strong bcrypt work factor or Argon2) is used, enforce minimum password strength requirements on registration, and verify token rotation/invalidation logic.
- **Launch Blocker:** Yes
- **Priority:** High

### Task 1.8: Open Source Licensing & Repository Protection (Legal/Marketing)
- **Description:** Since the repository is public, it must have a license to protect your ability to monetize and prevent competitors from cloning and selling it.
- **Agent Instructions:** 
  1. Create a `LICENSE` file in the root directory. Recommend **AGPL-3.0** (requires anyone who modifies and hosts the code to also open-source their changes) or a **BSL** (Business Source License) to explicitly prevent commercial competition.
  2. Update `README.md` to clearly state that the repo is open for transparency, but commercial usage/hosting is restricted or requires a license. 
  3. Ensure no API keys or secrets are currently in the git history.
- **Launch Blocker:** Yes
- **Priority:** High


## Phase 2: High Priority Fast-Follows (Focus on Convenience)
*These tasks dramatically reduce the friction of data entry and make the app habit-forming.*

### Task 2.1: Audio / Voice Memo Capture (Convenience)
- **Description:** Allow users to record a voice memo on their phone/desktop (PWA) which is transcribed using OpenAI Whisper (via OpenRouter/OpenAI API) and saved as a diary entry.
- **Agent Instructions:** 
  1. Add a microphone recording component in the Diary UI (`src/components/diary/`) using the MediaRecorder API.
  2. Create a server action to receive the audio `Blob` or `Base64` string, send it to a transcription API, and pipe the text into the existing `createDiaryEntryAction` pipeline.
- **Launch Blocker:** No
- **Priority:** High

### Task 2.2: Proactive "Catch Up" Suggestions (Convenience/Engagement)
- **Description:** Use the existing `Suggestion` and `Conversation` models to create a "Dashboard" widget that reminds users to reach out to people they haven't mentioned in 3+ months.
- **Agent Instructions:** Create a `getRecommendations` DAL function in `src/lib/dal.ts` that queries `Person` records associated with the user where the latest `DiaryMention` is older than 90 days. Build a `SuggestionsList` UI component on the authenticated dashboard.
- **Launch Blocker:** No
- **Priority:** Medium

### Task 2.3: Application-Level Data Encryption (Security)
- **Description:** While Postgres encrypts data at rest, adding application-level encryption (e.g., AES-256) for the `DiaryEntry.content` ensures that even a database dump won't expose user secrets.
- **Agent Instructions:** Add utility functions in `src/lib/crypto.ts` to encrypt/decrypt strings using a server-side master key (`ENCRYPTION_KEY` env var). Update the DAL (`src/lib/dal.ts`) to transparently encrypt on write and decrypt on read for diary contents.
- **Launch Blocker:** No (Can be rolled out later, but requires a data migration script for existing data)
- **Priority:** Medium


## Phase 3: Future Polish (Long-Term Growth)

### Task 3.1: Telegram / WhatsApp Bot Integration (Convenience)
- **Description:** Users can text their diary entries or photos directly to a bot, which routes them to their Note Neko account via webhooks.
- **Agent Instructions:** Set up a Telegram bot webhook. Map Telegram User IDs to Note Neko users (add a field in the `User` schema). Parse incoming text and trigger the AI entity extraction pipeline asynchronously.
- **Launch Blocker:** No
- **Priority:** Low

### Task 3.2: Image Uploads & Contextual OCR (Convenience)
- **Description:** Allow users to attach photos to diary entries. Use an AI Vision model (Gemini Pro Vision) to extract context (e.g., recognizing a restaurant receipt or people in the photo).
- **Agent Instructions:** Integrate an S3-compatible storage bucket (like AWS S3 or Cloudflare R2). Update Prisma schema to support `EntryAttachment` models. Add an image upload dropzone component to the frontend.
- **Launch Blocker:** No
- **Priority:** Low


## Phase 4: Monetization (Post-Launch)
*Once a core user base is established, introduce a premium tier.*

### Task 4.1: Stripe Integration for Subscriptions
- **Description:** Implement a freemium model. Add Stripe Checkout and a webhook handler to upgrade users to a "Pro" tier.
- **Agent Instructions:** 
  1. Add `@stripe/stripe-js` and `stripe` dependencies.
  2. Create a Server Action to generate a Checkout session.
  3. Update `Prisma` schema to add `stripeCustomerId`, `stripeSubscriptionId`, and `subscriptionStatus` to the `User` model.
  4. Create an API route `src/app/api/webhooks/stripe/route.ts` to listen for `checkout.session.completed`.
- **Launch Blocker:** No
- **Priority:** Medium (Post-Launch)

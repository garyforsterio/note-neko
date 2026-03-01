# API Documentation

## Overview

Note Neko uses Server Actions for ALL data mutations and complex operations. **API route handlers should NEVER be used** - they are legacy patterns that have been superseded by Server Actions in modern Next.js applications.

## Important Guidelines

**❌ NEVER use API route handlers (`/app/api/*/route.ts` files)**
- API routes add unnecessary complexity
- Server Actions provide better type safety
- Server Actions integrate seamlessly with React forms
- Server Actions support progressive enhancement
- Better caching and invalidation patterns

**✅ ALWAYS use Server Actions instead**
- Located in `src/actions/` directory
- Use the `'use server'` directive
- Direct function calls from components
- Built-in form integration with `useFormState`

## Server Actions

Server actions are located in `src/actions/` and use the `'use server'` directive.

### updateDiaryEntryAction

Updates an existing diary entry. When saving, the action passes `reviewed: true` to mark the entry as reviewed by the user. This is used in conjunction with the notification workflow where AI-extracted entities are validated during review.

## Password Reset Flow

1. User submits email via `/auth/forgot-password` form
2. `requestPasswordReset()` server action generates a UUID reset token
3. Token stored on User record with 1-hour expiry (`resetToken`, `resetTokenExpiry`)
4. Password reset email sent via Resend with a locale-aware HTML template
5. Email contains a link to `/auth/reset-password?token=<token>`
6. User submits new password via `resetPassword()` server action
7. Token validated against database; password updated and token cleared
8. User redirected to login page

Email sending failures are caught and logged — the action still returns success to avoid revealing user existence.

### Email Infrastructure

- **Provider**: Resend (`RESEND_API_KEY`)
- **Utility**: `src/lib/email.ts` — `sendEmail()` function
- **Templates**: `src/lib/email-templates/` — inline-styled HTML with plain text fallback
- **i18n**: Templates include built-in translations (en, ja) selected by locale

### processDiaryEntryAction

Processes (or reprocesses) a single diary entry with AI entity extraction. Calls the shared `processEntryWithAI()` function to extract people and locations, then sets `processed: true` and `reviewed: false`. Returns `{ success: boolean; error?: string }`.

### getUnprocessedDiaryIdsAction

Returns an array of `{ id: string }` for all unprocessed diary entries belonging to the authenticated user. Used by the bulk processing UI on the settings data page.

## Data Access Layer (DAL)

Cached data access functions in `src/lib/dal.ts`.

### Notification-Related Functions

- **`getUnreviewedDiaryCount()`** - Returns the count of diary entries where `reviewed === false` for the authenticated user. Used by the navigation badge.
- **`getUnreviewedDiaryEntries()`** - Returns all unreviewed diary entries for the authenticated user. Used by the `/notifications` page.
- **`updateDiaryEntry()`** - Accepts an optional `reviewed` boolean parameter to mark entries as reviewed.

### Processing-Related Functions

- **`getUnprocessedDiaryCount()`** - Returns the count of diary entries where `processed === false`. Used by the settings data page.
- **`getUnprocessedDiaryIds()`** - Returns IDs of all unprocessed diary entries, ordered by date ascending. Used by bulk processing.

## Rate Limiting

Currently no rate limiting implemented. Consider adding for:
- Authentication endpoints
- AI processing endpoints
- External API calls

## CORS Configuration

Server Actions don't require CORS configuration. API routes use Next.js defaults:
- Same-origin requests allowed
- Cross-origin requests blocked

## Testing

### Testing Server Actions
```typescript
import { createDiaryEntry } from '#actions/diary';

test('creates diary entry', async () => {
  const formData = new FormData();
  formData.set('content', 'Test entry');

  const result = await createDiaryEntry(formData);
  expect(result.status).toBe('success');
});
```

### Mocking Authentication
```typescript
import { requireAuth } from '#lib/auth';
jest.mock('#lib/auth');

requireAuth.mockResolvedValue('user123');
```
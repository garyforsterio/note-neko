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
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

### Authentication Actions (`src/actions/auth.ts`)

#### `login(formData: FormData)`
Authenticates user and sets JWT cookies.

**Input:**
- `email`: string - User email
- `password`: string - User password

**Returns:**
- Success: Redirects to `/diary`
- Failure: Form validation errors

**Example:**
```typescript
const [lastResult, action] = useFormState(login);
<form action={action}>...</form>
```

#### `signup(formData: FormData)`
Creates new user account.

**Input:**
- `email`: string - User email
- `password`: string - Password (min 8 chars)
- `confirmPassword`: string - Password confirmation

**Returns:**
- Success: Redirects to `/auth/login`
- Failure: Form validation errors

#### `logout()`
Clears authentication cookies and redirects to home.

**Input:** None

**Returns:** Redirects to `/`

#### `requestPasswordReset(formData: FormData)`
Initiates password reset process.

**Input:**
- `email`: string - User email

**Returns:**
- Success: Redirects to `/auth/login`
- Failure: Form validation errors

#### `resetPassword(formData: FormData)`
Resets user password with token.

**Input:**
- `token`: string - Reset token from email
- `password`: string - New password
- `confirmPassword`: string - Password confirmation

**Returns:**
- Success: Redirects to `/auth/login`
- Failure: Form validation errors

### Diary Actions (`src/actions/diary.ts`)

#### `createDiaryEntryAction(formData: FormData)`
Creates new diary entry with AI processing for entity extraction.

**Input:**
- `content`: string - Diary content (required)
- `date`: string - Entry date (ISO format)
- `location`: JSON - Optional user location for better geocoding
  ```json
  {
    "latitude": number,
    "longitude": number
  }
  ```

**Processing Steps:**
1. Creates initial diary entry with original content
2. Extracts people and locations using AI (via `extractEntitiesFromText`)
3. Creates new people if confidence > 0.7
4. Geocodes locations with Google Places API
5. Updates diary content with entity references (`[person:id]`, `[location:placeId]`)
6. Saves enhanced entry with extracted entities

**Returns:**
- Success: Redirects to `/diary/{entryId}/edit` for validation
- Failure: Form validation errors

**Protected:** Yes (requires authentication)

#### `updateDiaryEntry(formData: FormData)`
Updates existing diary entry.

**Input:**
- `entryId`: string - Entry ID to update
- `content`: string - Updated content
- `date`: string - Updated date
- `mentions`: string[] - Updated person mentions
- `locations`: JSON - Updated locations

**Returns:**
- Success: Redirects to `/diary`
- Failure: Form validation errors

**Protected:** Yes (requires authentication)

#### `deleteDiaryEntry(entryId: string)`
Deletes diary entry.

**Input:**
- `entryId`: string - Entry ID to delete

**Returns:**
- Success: Redirects to `/diary`
- Failure: Error response

**Protected:** Yes (requires authentication)

### People Actions (`src/actions/people.ts`)

#### `createPerson(formData: FormData)`
Creates new person record.

**Input:**
- `name`: string - Person's name (required)
- `nickname`: string - Optional nickname
- `birthday`: string - Birthday (ISO date)
- `howWeMet`: string - How you met story
- `interests`: string - Comma-separated interests
- `notes`: string - Additional notes

**Returns:**
- Success: Redirects to `/people/{id}`
- Failure: Form validation errors

**Protected:** Yes (requires authentication)

#### `updatePerson(formData: FormData)`
Updates person information.

**Input:**
- `personId`: string - Person ID to update
- Same fields as `createPerson`

**Returns:**
- Success: Redirects to `/people/{id}`
- Failure: Form validation errors

**Protected:** Yes (requires authentication)

#### `deletePerson(personId: string)`
Deletes person record.

**Input:**
- `personId`: string - Person ID to delete

**Returns:**
- Success: Redirects to `/people`
- Failure: Error response

**Protected:** Yes (requires authentication)

#### `generatePersonSummary(personId: string)`
Generates AI summary of interactions with person.

**Input:**
- `personId`: string - Person ID

**Returns:**
- Success: JSON with summary text
- Failure: Error response

**Protected:** Yes (requires authentication)

### Location Actions (`src/actions/locations.ts`)

#### `searchLocationsAction(query: string)`
Searches for locations using Google Places Text Search API. Returns multiple location options for user selection.

**Input:**
- `query`: string - Search query

**Returns:**
```typescript
LocationResult[] = Array<{
  name: string;
  placeId: string;
  lat: number;
  lng: number;
}>
```

**Protected:** Yes (requires authentication)

#### `getPlaceDetails(placeId: string)`
Gets detailed place information.

**Input:**
- `placeId`: string - Google Place ID

**Returns:**
```typescript
{
  name: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}
```

**Protected:** Yes (requires authentication)

### Entity Extraction (`src/actions/extractEntities.ts`)

#### `extractEntitiesFromText(text: string, latitude?: number, longitude?: number)`
Uses AI to extract people and locations from diary text.

**Input:**
- `text`: string - Diary content
- `latitude`: number - Optional user latitude
- `longitude`: number - Optional user longitude

**Returns:**
```typescript
{
  people: Array<{
    name: string;
    confidence: number;
    existingPerson?: Person;
  }>;
  locations: Array<{
    name: string;
    confidence: number;
    googlePlaceResult?: PlaceDetails;
  }>;
}
```

**Protected:** No (internal use)

### Social Media Actions (`src/actions/social.ts`)

#### `getUserSocialAccounts()`
Gets user's connected social media accounts.

**Input:** None

**Returns:**
```typescript
SocialAccount[] = Array<{
  id: string;
  platform: SocialPlatform;
  platformId: string;
  username?: string;
  displayName?: string;
  profileUrl?: string;
  profilePictureUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}>
```

**Protected:** Yes (requires authentication)

#### `disconnectSocialAccount(accountId: string)`
Disconnects a social media account.

**Input:**
- `accountId`: string - Social account ID to disconnect

**Returns:**
- Success: Redirects to `/settings/social`
- Failure: Error response

**Protected:** Yes (requires authentication)

#### `addPersonSocialProfile(formData: FormData)`
Adds a social media profile to a person.

**Input:**
- `personId`: string - Person ID to add profile to
- `platform`: SocialPlatform - Social media platform
- `username`: string - Username/handle on the platform
- `profileUrl`: string - Optional profile URL

**Returns:**
- Success: Redirects to `/people/{personId}`
- Failure: Form validation errors

**Protected:** Yes (requires authentication)

#### `removePersonSocialProfile(profileId: string)`
Removes a social media profile from a person.

**Input:**
- `profileId`: string - Profile ID to remove

**Returns:**
- Success: Redirects to `/people/{personId}`
- Failure: Error response

**Protected:** Yes (requires authentication)

#### `searchInstagramProfiles(query: string)`
Searches for Instagram profiles (requires connected Instagram account).

**Input:**
- `query`: string - Search query

**Returns:**
```typescript
InstagramProfile[] = Array<{
  id: string;
  username: string;
  displayName?: string;
}>
```

**Protected:** Yes (requires authentication and connected Instagram account)

#### `exchangeInstagramToken(formData: FormData)`
Exchanges Instagram authorization code for access token and stores the account.

**Input:**
- `code`: string - Authorization code from Instagram OAuth callback

**Processing:**
1. Exchanges authorization code for short-lived access token
2. Attempts to exchange short-lived token for long-lived token (60 days)
3. Fetches user profile data from Instagram API
4. Stores or updates social account in database with token and profile info

**Returns:**
- Success: Redirects to `/settings/social`
- Failure: Throws error with descriptive message

**Protected:** Yes (requires authentication)


## Data Access Layer Functions

The DAL provides cached database operations in `src/lib/dal.ts`.

### People Operations

#### `getPeople(): Promise<Person[]>`
Gets all people for authenticated user.
- **Cache tag:** `people`
- **Protected:** Yes

#### `getPerson(id: string): Promise<Person | null>`
Gets specific person by ID.
- **Cache tag:** `person:${id}`
- **Protected:** Yes

#### `getPersonWithDiaryEntries(id: string): Promise<PersonWithEntries>`
Gets person with their diary mentions.
- **Cache tag:** `person:${id}`
- **Protected:** Yes

### Diary Operations

#### `getDiaryEntries(): Promise<DiaryEntry[]>`
Gets all diary entries for user.
- **Cache tag:** `diaries`
- **Protected:** Yes

#### `getDiaryEntry(id: string): Promise<DiaryEntry | null>`
Gets specific diary entry.
- **Cache tag:** `diary:${id}`
- **Protected:** Yes

#### `getDiaryEntriesForMonth(year: number, month: number): Promise<DiaryEntry[]>`
Gets diary entries for specific month.
- **Cache tag:** `diaries`
- **Protected:** Yes

### Cache Management

#### `updateTag(tag: string)`
Invalidates cache for specific tag.

Common tags:
- `people` - All people data
- `person:${id}` - Specific person
- `diaries` - All diary entries
- `diary:${id}` - Specific diary entry
- `diaryEntry` - Generic diary cache

## Authentication

### JWT Token Management

#### Token Generation
```typescript
const token = await new SignJWT({ userId })
  .setProtectedHeader({ alg: 'HS256' })
  .setExpirationTime('1h')
  .sign(secret);
```

#### Token Verification
```typescript
const { payload } = await jwtVerify(token, secret);
```

### Protected Route Middleware

#### `requireAuth()`
Validates JWT and returns user ID.

**Usage:**
```typescript
export async function serverAction() {
  'use server';
  const userId = await requireAuth();
  // Proceed with authenticated operation
}
```

**Throws:** Redirects to `/auth/login` if unauthorized

## Error Handling

### Standard Error Response
```json
{
  "error": "Error message",
  "details": "Additional error context"
}
```

### Form Validation Errors
```typescript
{
  status: 'error',
  error: {
    fieldName: ['Error message']
  }
}
```

### API Error Codes
- `400` - Bad Request (validation failed)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

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

### Testing API Routes
```typescript
const response = await fetch('/api/diary/process', {
  method: 'POST',
  body: JSON.stringify({ entryId: '123' })
});
```

### Mocking Authentication
```typescript
import { requireAuth } from '#lib/auth';
jest.mock('#lib/auth');

requireAuth.mockResolvedValue('user123');
```
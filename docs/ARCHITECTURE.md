# Architecture Overview

## System Design

Note Neko is a personal relationship management system built as a modern web application using Next.js 15 with a focus on tracking diary entries and managing relationships with people.

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Client Browser                       │
│  (React 19, Next.js App Router, Tailwind CSS)          │
└────────────────────┬────────────────────────────────────┘
                     │ HTTPS
┌────────────────────▼────────────────────────────────────┐
│                 Next.js Application                     │
│  ┌──────────────────────────────────────────────────┐  │
│  │          App Router (Server Components)          │  │
│  ├──────────────────────────────────────────────────┤  │
│  │         Server Actions & API Routes              │  │
│  ├──────────────────────────────────────────────────┤  │
│  │      Data Access Layer (Cached Operations)       │  │
│  ├──────────────────────────────────────────────────┤  │
│  │           Prisma ORM (with Accelerate)           │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│              PostgreSQL Database                        │
└──────────────────────────────────────────────────────────┘

External Services:
- OpenRouter API (AI entity extraction)
- Google Maps API (location geocoding)
- Sentry (error tracking)
- Vercel (hosting & analytics)
```

## Core Design Principles

### 1. Server-First Architecture
- Default to Server Components for all new components
- Client Components only when interactivity is required
- Server-side rendering for optimal performance and SEO
- **NEVER use API route handlers** - use Server Actions exclusively

### 2. Type Safety
- TypeScript strict mode enabled throughout
- Zod schemas for runtime validation
- Prisma for type-safe database operations

### 3. Performance Optimization
- Data Access Layer with caching using `unstable_cache`
- Prisma Accelerate for edge optimization
- Progressive enhancement patterns
- Optimistic UI updates where appropriate

### 4. Security
- JWT-based authentication with refresh tokens
- HttpOnly cookies for token storage
- Server-side validation for all user inputs
- Protected routes using `requireAuth` middleware

## Directory Structure

```
src/
├── actions/              # Server actions with 'use server'
│   ├── auth.ts          # Authentication actions
│   ├── diary.ts         # Diary CRUD operations
│   ├── people.ts        # People management
│   └── extractEntities.ts # AI entity extraction
│
├── app/                  # Next.js App Router
│   └── [locale]/        # Internationalized routes
│       ├── (home)/      # Public home page
│       ├── (with-sidebar)/ # Authenticated app layout
│       │   ├── diary/   # Diary entries pages
│       │   └── people/  # People management pages
│       └── auth/        # Authentication pages
│
├── components/          # Reusable React components
│   ├── ui/             # Base UI components
│   ├── auth/           # Authentication components
│   └── diary/          # Diary-specific components
│
├── lib/                 # Core utilities
│   ├── auth.ts         # JWT authentication logic
│   ├── dal.ts          # Data Access Layer
│   ├── db.ts           # Prisma client instance
│   └── i18n/           # Internationalization config
│
├── hooks/               # Custom React hooks
├── schema/              # Zod validation schemas
└── messages/            # i18n translation files
```

## Request Flow

### Typical User Request Flow

1. **Client Request** → Browser sends request to Next.js server
2. **Routing** → App Router determines the route and locale
3. **Authentication** → `requireAuth()` validates JWT token
4. **Server Component** → Fetches data using DAL functions
5. **Data Access Layer** → Cached database queries via Prisma
6. **Response** → HTML rendered and sent to client

### Form Submission Flow

1. **Client Form** → User submits form (Client Component)
2. **Server Action** → Form data sent to server action
3. **Validation** → Zod schema validates input
4. **Business Logic** → Process data (e.g., create diary entry with AI)
5. **Database Operations** → Multiple Prisma operations (create, update, etc.)
6. **Cache Invalidation** → Revalidate relevant cache tags
7. **Redirect** → Navigate to appropriate page (e.g., edit for validation)

## Data Flow Patterns

### Server Components Data Fetching
```typescript
// Page component (Server Component)
export default async function DiaryPage() {
  const diaryEntries = await getDiaryEntries(); // Cached DAL function
  return <DiaryList entries={diaryEntries} />;
}
```

### Server Actions Pattern
```typescript
// Server action in src/actions/diary.ts
export async function createDiaryEntryAction(formData: FormData) {
  'use server';
  await requireAuth();
  const submission = parseWithZod(formData, { schema });
  if (submission.status !== 'success') {
    return submission.reply();
  }

  // Create entry, extract entities with AI, update content
  const entry = await createDiaryEntry(submission.value);
  const entities = await extractEntitiesFromText(entry.content);
  await updateDiaryEntry(entry.id, processedData);

  // Redirect to edit page for validation
  redirect(`/diary/${entry.id}/edit`);
}
```

### Client Component with Server Action
```typescript
// Client component using server action
'use client';
export function DiaryForm() {
  const [lastResult, action] = useFormState(createDiaryEntry);
  const [form] = useForm({ lastResult });
  return <form action={action}>...</form>;
}
```

## Caching Strategy

### Cache Layers

1. **React Cache** - Request-level memoization
2. **Next.js Cache** - Full route caching with tags
3. **Database Query Cache** - DAL-level caching

### Cache Tags

- `diaries` - All diary entries
- `diary:${id}` - Specific diary entry
- `people` - All people
- `person:${id}` - Specific person
- `diaryEntry` - Generic diary cache tag

### Cache Invalidation

Cache tags are revalidated after mutations:
```typescript
revalidateTag('diaries'); // After diary creation
revalidateTag(`diary:${id}`); // After diary update
```

## Authentication Architecture

### JWT Token Flow

1. **Login** → Validate credentials, generate JWT + refresh token
2. **JWT Storage** → Stored in httpOnly cookie (1 hour expiry)
3. **Refresh Token** → Stored in database (30 days expiry)
4. **Token Refresh** → Automatic refresh when JWT expires
5. **Logout** → Clear cookies and invalidate refresh token

### Protected Routes

All routes under `(with-sidebar)` require authentication:
- `/diary/*` - Diary management
- `/people/*` - People management

## AI Integration

### Entity Extraction Pipeline

1. **Diary Form Submission** → User submits diary content via form
2. **Server Action Processing** → `createDiaryEntryAction` handles form data
3. **Initial Entry Creation** → Creates diary entry with original content
4. **AI Entity Extraction** → Calls `extractEntitiesFromText` with diary content
5. **OpenRouter API** → Uses Gemini 2.5 Flash to extract people and locations
6. **People Processing** → Creates new people if confidence > 0.7
7. **Location Geocoding** → Google Maps API geocodes location references
8. **Content Enhancement** → Adds `[person:id]` and `[location:placeId]` tags
9. **Database Update** → Updates entry with processed content and entities
10. **Redirect to Edit** → User redirected to edit page for validation

## Internationalization

### Supported Locales
- English (en)
- Japanese (ja)

### Implementation
- Server Components: `getTranslations()` from `next-intl/server`
- Client Components: `useTranslations()` hook
- URL-based locale routing: `/en/diary`, `/ja/diary`

## Testing Architecture

### Test Types

1. **Unit Tests** - Vitest for business logic
2. **Component Tests** - Storybook stories with play functions
3. **Integration Tests** - API route testing
4. **E2E Tests** - Playwright (if configured)

### Mocking Strategy
- Database mocked in Storybook via import mapping
- Authentication mocked with `requireAuth.mockResolvedValue()`
- Server functions mocked in test environment

## Performance Considerations

### Optimization Techniques

1. **Server Components** - Reduce JavaScript bundle size
2. **Streaming SSR** - Progressive page rendering
3. **Prisma Accelerate** - Edge-optimized database queries
4. **Image Optimization** - Next.js Image component
5. **Code Splitting** - Automatic with App Router
6. **Prefetching** - Link component prefetches routes

### Bundle Size Management
- Dynamic imports for heavy components
- Tree-shaking with modern bundling
- Minimal client-side JavaScript

## Security Measures

### Input Validation
- Zod schemas for all user inputs
- Server-side validation in actions
- SQL injection prevention via Prisma

### Authentication Security
- bcrypt for password hashing
- JWT with short expiry (1 hour)
- Refresh tokens for extended sessions
- HttpOnly cookies prevent XSS attacks

### Data Protection
- User isolation via database queries
- Row-level security through application logic
- Sensitive data never exposed to client

## Deployment Architecture

### Production Environment
- **Hosting**: Vercel platform
- **Database**: PostgreSQL (via Prisma Accelerate)
- **CDN**: Vercel Edge Network
- **Monitoring**: Sentry for error tracking
- **Analytics**: Vercel Analytics & Speed Insights

### Environment Variables
- Managed via Vercel dashboard
- Separate configs for dev/staging/production
- Secrets never committed to repository
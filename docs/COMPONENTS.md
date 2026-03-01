# Component Documentation

## Component Architecture

### Component Types

#### Server Components (Default)

- Fetch data directly in component
- No `'use client'` directive
- Can use async/await
- Smaller bundle size
- Used for: Pages, layouts, data display

#### Client Components

- Interactive components
- Require `'use client'` directive
- Can use hooks and browser APIs
- Used for: Forms, modals, interactive UI

### Component Patterns

#### Server Component Pattern

```typescript
// src/app/[locale]/(with-sidebar)/people/page.tsx
export default async function PeoplePage() {
  const people = await getPeople(); // Direct data fetching
  const t = await getTranslations('people'); // Server-side i18n

  return (
    <div>
      <h1>{t('title')}</h1>
      <PeopleList people={people} />
    </div>
  );
}
```

#### Client Component with Server Action

```typescript
// src/components/diary/DiaryForm.tsx
'use client';

import { useFormState } from 'react-dom';
import { createDiaryEntry } from '#actions/diary';

export function DiaryForm() {
  const [lastResult, action] = useFormState(createDiaryEntry, undefined);
  const [form, fields] = useForm({ lastResult });

  return (
    <form action={action} {...getFormProps(form)}>
      {/* Form fields */}
    </form>
  );
}
```

## Component Guidelines

### File Organization

```
components/
├── ui/           # Base UI components (buttons, inputs)
├── auth/         # Authentication-related
├── diary/        # Diary-specific components
└── [feature]/    # Feature-specific components
```

### Naming Conventions

- PascalCase for component files
- Descriptive names (e.g., `DiaryEntryCard` not `Card`)
- Group related components in directories

### Import Patterns

```typescript
// Absolute imports for lib
import { requireAuth } from '#lib/auth';

// Relative imports for local components
import { ProfileSettingsForm } from './components/ProfileSettingsForm';

// Server components
import { getTranslations } from 'next-intl/server';

// Client components
import { useTranslations } from 'next-intl';
```

### Styling Patterns

```typescript
// Using Tailwind classes
<div className="flex flex-col gap-4 p-6">

// Using cn() helper for conditional classes
<button className={cn(
  "px-4 py-2 rounded",
  isActive && "bg-blue-500",
  isDisabled && "opacity-50"
)}>

// Responsive design
<div className="w-full md:w-1/2 lg:w-1/3">
```

### Data Fetching Patterns

#### Server Component Data Fetching

```typescript
export default async function Page() {
  const data = await getData(); // Direct fetch
  return <Component data={data} />;
}
```

#### Client Component with Server Action

```typescript
'use client';
export function Form() {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    startTransition(async () => {
      await serverAction();
    });
  };
}
```

### Testing Components

#### Unit Tests

```typescript
// Component.test.tsx
import { render, screen } from '@testing-library/react';

test('renders diary entry', () => {
  render(<DiaryCard entry={mockEntry} />);
  expect(screen.getByText(mockEntry.content)).toBeInTheDocument();
});
```

## Accessibility Guidelines

### ARIA Attributes

```typescript
<button
  aria-label="Delete entry"
  aria-describedby="delete-warning"
>

<div role="status" aria-live="polite">
  {loading && <span>Loading...</span>}
</div>
```

### External Links Security

**CRITICAL: All external links MUST include `rel="noopener noreferrer"`** for security:

```typescript
// ✅ Correct - External link with security attributes
<a
  href="https://external-site.com"
  rel="noopener noreferrer"
  target="_blank"
>
  External Link
</a>

// ❌ Incorrect - Missing security attributes
<a href="https://external-site.com">
  External Link
</a>
```

**Why this is required:**

- `noopener` prevents the external site from accessing `window.opener`
- `noreferrer` prevents sending the referrer header to the external site
- Protects against reverse tabnabbing attacks and privacy leaks

### Keyboard Navigation

- All interactive elements keyboard accessible
- Proper focus management
- Escape key closes modals
- Tab order follows visual flow

### Screen Reader Support

- Semantic HTML elements
- Proper heading hierarchy
- Alt text for images
- Form labels and descriptions

## Performance Optimization

### Code Splitting

```typescript
// Dynamic imports for heavy components
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
});
```

### Image Optimization

```typescript
import Image from 'next/image';

<Image
  src={avatarUrl}
  alt={person.name}
  width={48}
  height={48}
  loading="lazy"
/>
```

### Memoization

```typescript
// For expensive computations
const expensiveValue = useMemo(() => computeExpensive(data), [data]);

// For stable callbacks
const handleClick = useCallback(() => doSomething(id), [id]);
```

## Feature Components

### NotificationList

Server component that displays unreviewed diary entries on the `/notifications` page.

- Fetches unreviewed entries via `getUnreviewedDiaryEntries()` DAL function
- Renders a list of diary entries that have not yet been reviewed (`reviewed === false`)
- Links each entry to its edit page for review

### DiaryEditForm (Notification Enhancements)

When editing an unreviewed entry (`entry.reviewed === false`):

- Displays a purple guidance banner prompting the user to review AI-extracted entities
- Submit button text changes to "Mark as Reviewed" instead of "Update"
- Saving the entry sets `reviewed: true` via the `updateDiaryEntryAction`

### Navigation Notification Badge

A bell icon is added to the main navigation bar displaying the count of unreviewed diary entries. The count is fetched via `getUnreviewedDiaryCount()` DAL function.

### ProcessButton

Client component (`src/app/[locale]/(with-sidebar)/diary/[id]/components/ProcessButton.tsx`) that triggers AI entity extraction on a diary entry. Displayed in the diary entry view footer alongside Edit/Share/Delete buttons.

- Shows "Process with AI" when `processed=false`, "Reprocess" when `processed=true`
- Uses `useTransition` for pending state with animated sparkle icon
- On success, redirects to edit mode (`?mode=edit`) so the user can review extractions
- Reprocessing resets `reviewed=false` to require re-review

### BulkProcessForm

Client component (`src/app/[locale]/(with-sidebar)/settings/data/components/BulkProcessForm.tsx`) for processing all unprocessed diary entries in bulk from the settings data page.

- Shows count of unprocessed entries
- "Process All" button processes entries sequentially
- Progress bar with "Processing X of Y..." indicator
- Completion message when all entries are processed

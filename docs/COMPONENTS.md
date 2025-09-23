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

## Core Components

### Navigation Components

#### `Navigation` (`src/components/Navigation.tsx`)
Main navigation sidebar component.

**Props:**
```typescript
interface NavigationProps {
  locale: string;
  isLoggedIn: boolean;
}
```

**Features:**
- Responsive sidebar (desktop) / bottom nav (mobile)
- Active route highlighting
- User menu with logout
- Internationalization support

#### `MobileNav` (Internal to Navigation)
Mobile-specific navigation menu.

**Features:**
- Fixed bottom positioning
- Touch-optimized targets
- Smooth transitions

### Authentication Components

#### `LoginForm` (`src/components/auth/LoginForm.tsx`)
User login form with validation.

**Type:** Client Component

**Features:**
- Email/password fields
- Client-side validation with Conform
- Server action integration
- Error message display
- Loading states

#### `SignupForm` (`src/components/auth/SignupForm.tsx`)
User registration form.

**Type:** Client Component

**Features:**
- Email/password/confirm fields
- Password strength validation
- Terms acceptance
- Server action integration

#### `LogoutButton` (`src/components/auth/LogoutButton.tsx`)
Logout action trigger.

**Type:** Client Component

**Features:**
- Calls logout server action
- Loading state during logout
- Clears client state

### Diary Components

#### `DiaryList` (`src/components/diary/DiaryList.tsx`)
Displays diary entries in chronological order.

**Type:** Server Component

**Props:**
```typescript
interface DiaryListProps {
  entries: DiaryEntryWithRelations[];
}
```

**Features:**
- Date grouping
- Person mention badges
- Location tags
- Edit/delete actions

#### `DiaryForm` (`src/components/diary/DiaryForm.tsx`)
Create/edit diary entry form.

**Type:** Client Component

**Features:**
- Rich text editor
- Date picker
- People selector (multi-select)
- Location search with autocomplete
- AI processing trigger
- Auto-save draft

#### `DiaryContent` (`src/components/DiaryContent.tsx`)
Renders diary content with entity references.

**Type:** Server Component

**Props:**
```typescript
interface DiaryContentProps {
  content: string;
  mentions?: DiaryMention[];
  locations?: DiaryLocation[];
}
```

**Features:**
- Parses `[person:id]` tags
- Parses `[location:id]` tags
- Renders as interactive links
- Markdown support

#### `ProcessingButton` (`src/components/diary/ProcessingButton.tsx`)
Triggers AI processing of diary entry.

**Type:** Client Component

**Props:**
```typescript
interface ProcessingButtonProps {
  entryId: string;
  onComplete?: () => void;
}
```

**Features:**
- SSE connection for progress
- Real-time status updates
- Error handling
- Location permission request

### People Components

#### `PersonCard` (`src/app/[locale]/(with-sidebar)/people/components/PersonCard.tsx`)
Displays person summary card.

**Type:** Server Component

**Props:**
```typescript
interface PersonCardProps {
  person: Person;
  mentionCount?: number;
}
```

**Features:**
- Avatar display
- Basic info summary
- Recent interaction indicator
- Click to view details

#### `PersonForm` (`src/app/[locale]/(with-sidebar)/people/components/PersonForm.tsx`)
Create/edit person form.

**Type:** Client Component

**Features:**
- Name/nickname fields
- Birthday picker
- Interests tag input
- Notes textarea
- Validation with Conform

#### `PersonDetails` (`src/app/[locale]/(with-sidebar)/people/components/PersonDetails.tsx`)
Full person profile view.

**Type:** Server Component

**Props:**
```typescript
interface PersonDetailsProps {
  person: PersonWithMentions;
}
```

**Features:**
- Full profile information
- Interaction timeline
- AI-generated summary
- Edit/delete actions

#### `PersonSummary` (`src/components/PersonSummary.tsx`)
AI-generated relationship summary.

**Type:** Client Component

**Props:**
```typescript
interface PersonSummaryProps {
  personId: string;
}
```

**Features:**
- Lazy loading
- Skeleton state
- Error handling
- Refresh capability

### UI Components

#### `Button` (`src/components/ui/button.tsx`)
Reusable button component.

**Variants:**
- `default` - Primary action
- `destructive` - Delete/dangerous actions
- `outline` - Secondary actions
- `ghost` - Tertiary actions
- `link` - Text-only actions

**Sizes:**
- `sm` - Small buttons
- `default` - Standard size
- `lg` - Large buttons
- `icon` - Icon-only buttons

#### `Input` (`src/components/ui/input.tsx`)
Form input component.

**Features:**
- Error state styling
- Disabled state
- Focus management
- Accessibility attributes

#### `Calendar` (`src/components/Calendar.tsx`)
Date picker calendar.

**Type:** Client Component

**Props:**
```typescript
interface CalendarProps {
  selected?: Date;
  onSelect?: (date: Date) => void;
  entriesByDate?: Map<string, DiaryEntry[]>;
}
```

**Features:**
- Month navigation
- Entry indicators
- Keyboard navigation
- Mobile-optimized

#### `ActionSheet` (`src/components/ActionSheet.tsx`)
Mobile-style action menu.

**Type:** Client Component

**Props:**
```typescript
interface ActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  actions: ActionItem[];
}
```

**Features:**
- Bottom sheet animation
- Backdrop dismiss
- Keyboard accessible

#### `ErrorMessage` (`src/components/ErrorMessage.tsx`)
Error display component.

**Type:** Server Component

**Props:**
```typescript
interface ErrorMessageProps {
  error?: string | string[];
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
import { Button } from './ui/button';

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

#### Storybook Stories
```typescript
// Component.stories.tsx
export default {
  title: 'Diary/DiaryCard',
  component: DiaryCard,
};

export const Default: Story = {
  args: {
    entry: mockDiaryEntry,
  },
};

export const WithMentions: Story = {
  args: {
    entry: {
      ...mockDiaryEntry,
      mentions: [mockPerson],
    },
  },
};
```

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
const expensiveValue = useMemo(
  () => computeExpensive(data),
  [data]
);

// For stable callbacks
const handleClick = useCallback(
  () => doSomething(id),
  [id]
);
```
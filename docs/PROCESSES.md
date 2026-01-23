# Development Processes

## Getting Started

### Prerequisites
- Node.js 22.14.0+
- pnpm 10.11.0+
- PostgreSQL database
- Required API keys (see Environment Setup)

### Initial Setup
```bash
# Clone repository
git clone <repository-url>
cd note-neko

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values

# Set up database
pnpm prisma:migrate-dev
pnpm prisma:seed

# Start development server
pnpm dev
```

## Development Workflow

### Daily Development Process

1. **Start Development Environment**
```bash
# Terminal 1: Start Next.js dev server
pnpm dev

# Terminal 2: Start Storybook (if working on components)
pnpm storybook

# Terminal 3: Run tests in watch mode
pnpm test
```

2. **Before Committing**
```bash
# Format code
pnpm format

# Run linter
pnpm lint

# Check types
pnpm typecheck

# Run tests
pnpm test
```

3. **Commit Process**
```bash
# Stage changes
git add .

# Commit with conventional commit message
git commit -m "feat: add new feature"
# or
git commit -m "fix: resolve bug"
```

### Branch Strategy

#### Branch Types
- `main` - Production-ready code
- `feat/*` - New features
- `fix/*` - Bug fixes
- `chore/*` - Maintenance tasks
- `docs/*` - Documentation updates

#### Branch Workflow
```bash
# Create feature branch
git checkout -b feat/diary-export

# Work on feature
# ... make changes ...

# Push branch
git push -u origin feat/diary-export

# Create pull request
# Use GitHub/GitLab UI or gh CLI
```

## Code Development Process

### Adding a New Feature

#### 1. Plan the Feature
- Define requirements
- Design database schema changes
- Plan UI components
- Consider i18n needs

#### 2. Database Schema Updates
```bash
# Edit schema
vim prisma/schema.prisma

# Generate migration
pnpm prisma:migrate-dev --name add_feature_table

# Update types
pnpm prisma:generate
```

#### 3. Create Server Action
```typescript
// src/actions/feature.ts
'use server';

import { parseWithZod } from '@conform-to/zod';
import { requireAuth } from '#lib/auth';
import { featureSchema } from '#schema/feature';

export async function createFeature(formData: FormData) {
  await requireAuth();

  const submission = parseWithZod(formData, { schema: featureSchema });
  if (submission.status !== 'success') {
    return submission.reply();
  }

  // Implementation
  redirect('/feature');
}
```

#### 4. Create Data Access Layer Functions
```typescript
// src/lib/dal.ts
export async function getFeatures() {
  'use cache';
  cacheTag('features');

  const userId = await requireAuth();
  return db.feature.findMany({
    where: { userId }
  });
}
```

#### 5. Build UI Components
```typescript
// src/components/feature/FeatureForm.tsx
'use client';

export function FeatureForm() {
  const [lastResult, action] = useFormState(createFeature);
  // Component implementation
}
```

#### 6. Create Page Route
```typescript
// src/app/[locale]/(with-sidebar)/feature/page.tsx
export default async function FeaturePage() {
  const features = await getFeatures();
  return <FeatureList features={features} />;
}
```

#### 7. Add Translations
```json
// messages/en.json
{
  "feature": {
    "title": "Features",
    "create": "Create Feature"
  }
}
```

#### 8. Write Tests
```typescript
// src/components/feature/Feature.test.tsx
test('creates feature', async () => {
  // Test implementation
});
```

#### 9. Create Storybook Stories
```typescript
// src/components/feature/Feature.stories.tsx
export default {
  title: 'Feature/FeatureCard',
  component: FeatureCard,
};
```

### Adding a New API Endpoint

#### 1. Create Route Handler
```typescript
// src/app/api/feature/route.ts
import { NextRequest } from 'next/server';
import { requireAuth } from '#lib/auth';

export async function POST(request: NextRequest) {
  await requireAuth();

  const body = await request.json();
  // Implementation

  return Response.json({ success: true });
}
```

#### 2. Add Validation Schema
```typescript
// src/schema/api.ts
export const featureApiSchema = z.object({
  // Schema definition
});
```

#### 3. Document in API.md
Update `docs/API.md` with endpoint documentation.

## Testing Process

### Test Types

#### Unit Tests
```bash
# Run all unit tests
pnpm test:unit

# Run with coverage
pnpm coverage

# Run specific test file
pnpm test src/lib/auth.test.ts
```

#### Component Tests (Storybook)
```bash
# Start Storybook
pnpm storybook

# Build Storybook
pnpm build-storybook
```

### Writing Tests

#### Unit Test Template
```typescript
import { describe, it, expect, vi } from 'vitest';

describe('FeatureService', () => {
  it('should create feature', async () => {
    // Arrange
    const mockData = { /* ... */ };

    // Act
    const result = await createFeature(mockData);

    // Assert
    expect(result).toBeDefined();
  });
});
```

#### Storybook Story Template
```typescript
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Component> = {
  title: 'Category/Component',
  component: Component,
};

export default meta;

export const Default: StoryObj = {
  args: {
    // Default props
  },
};
```

## Database Management

### Migration Process

#### Development
```bash
# Create migration
pnpm prisma:migrate-dev --name migration_name

# Reset database
pnpm prisma:migrate-dev --reset

# Seed database
pnpm prisma:seed
```

#### Production
```bash
# Apply migrations
pnpm prisma:migrate-deploy

# Generate client
pnpm prisma:generate
```

### Database Backup
```bash
# Export data (example)
pg_dump DATABASE_URL > backup.sql

# Import data
psql DATABASE_URL < backup.sql
```

## CI/CD Workflows

### GitHub Actions

#### CI Workflow (`.github/workflows/on-push.yml`)
Runs on every push to any branch:
- Linting with Biome
- TypeScript type checking
- Unit tests with Vitest

#### Database Migration Workflow (`.github/workflows/migrate-prod.yml`)
Runs automatically when migration files are committed to `main`:
- Triggers on changes to `prisma/migrations/**`
- Runs `prisma migrate deploy` against production database
- Requires `DATABASE_URL` secret in the `production` GitHub environment

### Required GitHub Secrets
Configure these in your repository's Settings → Secrets and variables → Actions:

**Production environment:**
- `DATABASE_URL` - Production PostgreSQL connection string

## Deployment Process

### Pre-deployment Checklist
- [ ] All tests passing
- [ ] TypeScript compilation successful
- [ ] Linting passed
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] Documentation updated

### Deployment Steps

#### 1. Build Application
```bash
# Build for production
pnpm build

# Test production build
pnpm start
```

#### 2. Deploy to Vercel
```bash
# Using Vercel CLI
vercel

# Or push to main branch for auto-deploy
git push origin main
```

#### 3. Post-deployment
Database migrations are automatically applied via GitHub Actions when migration files are committed to the `main` branch. See `.github/workflows/migrate-prod.yml`.

```bash
# Manual migration (if needed)
pnpm prisma:migrate-deploy

# Verify deployment
curl https://your-app.vercel.app/api/health
```

## Code Quality Process

### String Literal Constants
- **ALWAYS extract constant-like string literals** (URLs, API endpoints, configuration values, error messages used multiple times)
- If used once in the same file, extraction is required for readability
- If used in multiple places, MUST be extracted to a separate constants file
- Examples of literals that should be extracted:
  - API URLs: `https://api.example.com/oauth/access_token`
  - Configuration values: `"authorization_code"`
  - Repeated error messages
  - Magic strings used as identifiers

```typescript
// ❌ Bad: Inline URLs and constants
const response = await fetch("https://api.example.com/oauth/access_token", {
  body: new URLSearchParams({
    grant_type: "authorization_code"
  })
});

// ✅ Good: Extract as constants
const INSTAGRAM_TOKEN_URL = "https://api.example.com/oauth/access_token";
const GRANT_TYPE_AUTH_CODE = "authorization_code";

const response = await fetch(INSTAGRAM_TOKEN_URL, {
  body: new URLSearchParams({
    grant_type: GRANT_TYPE_AUTH_CODE
  })
});
```

### Linting and Formatting

#### Biome Configuration
```json
// biome.json
{
  "linter": {
    "enabled": true,
    "rules": {
      // Custom rules
    }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "tab"
  }
}
```

#### Running Checks
```bash
# Format code
pnpm format

# Lint code
pnpm lint

# Fix linting issues
pnpm lint --write
```

### Type Checking
```bash
# Check types
pnpm typecheck

# Watch mode
tsc --watch
```

### Commit Standards

#### Conventional Commits
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting
- `refactor:` Code restructuring
- `test:` Tests
- `chore:` Maintenance

#### Example Commits
```bash
git commit -m "feat: add diary export functionality"
git commit -m "fix: resolve date picker issue on mobile"
git commit -m "docs: update API documentation"
git commit -m "refactor: simplify auth flow"
```

## Troubleshooting

### Common Issues

#### Database Connection
```bash
# Test connection
pnpm prisma:generate

# Reset database
pnpm prisma:migrate-dev --reset
```

#### Build Failures
```bash
# Clear caches
rm -rf .next node_modules
pnpm install
pnpm build
```

#### Type Errors
```bash
# Regenerate types
pnpm prisma:generate
pnpm typecheck
```

### Debug Tools

#### Server-side Debugging
```typescript
// Add debug logging
console.log('[DEBUG]', variable);

// Use debugger
debugger;
```

#### Client-side Debugging
```typescript
// React DevTools
// Install browser extension

// Console logging
console.log('Component state:', state);
```

## Performance Monitoring

### Development Metrics
```bash
# Next.js build analysis
ANALYZE=true pnpm build

# Bundle size check
npx @next/bundle-analyzer
```

### Production Monitoring
- Vercel Analytics for page metrics
- Sentry for error tracking
- Custom performance marks

## Security Process

### Security Checklist
- [ ] Input validation on all forms
- [ ] SQL injection prevention (Prisma)
- [ ] XSS protection (React escaping)
- [ ] CSRF protection (SameSite cookies)
- [ ] Rate limiting on APIs
- [ ] Secure headers configured
- [ ] Secrets in environment variables

### Dependency Management
```bash
# Check for vulnerabilities
pnpm audit

# Update dependencies
pnpm update

# Check outdated packages
pnpm outdated
```

## Release Process

### Version Management
```bash
# Bump version
npm version patch/minor/major

# Tag release
git tag -a v1.0.0 -m "Release version 1.0.0"
git push --tags
```

### Release Notes Template
```markdown
## Version X.Y.Z

### Features
- Feature description

### Bug Fixes
- Fix description

### Breaking Changes
- Change description

### Migration Guide
- Step-by-step instructions
```

## Documentation Process

### Documentation Requirements
- Update relevant docs for any changes
- Include code examples
- Add to component Storybook
- Update API documentation
- Keep README current

### Documentation Structure
```
docs/
├── ARCHITECTURE.md    # System design
├── DATABASE.md        # Schema docs
├── API.md            # API reference
├── COMPONENTS.md     # Component guide
└── PROCESSES.md      # This file
```

## Team Collaboration

### Code Review Process
1. Create pull request
2. Automated checks run
3. Peer review required
4. Address feedback
5. Merge when approved

### Communication
- Use pull request descriptions
- Comment code when complex
- Update documentation
- Share knowledge in team meetings
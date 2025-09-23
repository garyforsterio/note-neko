# Database Schema Documentation

## Overview

Note Neko uses PostgreSQL as its primary database with Prisma ORM for type-safe database access. The database is optimized for edge deployment using Prisma Accelerate.

## Entity Relationship Diagram

```
┌──────────────┐
│     User     │
└──────┬───────┘
       │ 1:many
       ├─────────────┬──────────────┬────────────────┐
       ▼             ▼              ▼                ▼
┌──────────┐  ┌──────────┐  ┌─────────────┐  ┌──────────────┐
│  Person  │  │DiaryEntry│  │RefreshToken │  │              │
└────┬─────┘  └────┬─────┘  └─────────────┘  │              │
     │             │                           │              │
     │ many:many   ├───────────────────────────              │
     │             ▼             1:many                       │
     │      ┌──────────────┐                                  │
     └─────►│ DiaryMention │◄─────────────────────────────────┘
            └──────────────┘
                   │
            ┌──────┴───────┐
            ▼              ▼
      ┌──────────┐  ┌──────────────┐
      │DiaryEntry│  │DiaryLocation │
      └──────────┘  └──────────────┘
```

## Tables

### User
Primary user account table storing authentication and profile information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | String | PK, CUID | Unique user identifier |
| email | String | Unique, Required | User's email address |
| passwordHash | String | Required | Bcrypt hashed password |
| resetToken | String? | Nullable | Password reset token |
| resetTokenExpiry | DateTime? | Nullable | Reset token expiration |
| createdAt | DateTime | Default: now() | Account creation timestamp |
| updatedAt | DateTime | Auto-update | Last modification timestamp |

**Relations:**
- Has many `Person` records
- Has many `DiaryEntry` records
- Has many `RefreshToken` records

### Person
Represents people tracked in the user's relationship management system.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | String | PK, CUID | Unique person identifier |
| name | String | Required | Person's full name |
| nickname | String? | Nullable | Optional nickname |
| birthday | DateTime? | Nullable | Person's birthday |
| howWeMet | String? | Nullable | Story of first meeting |
| interests | String[] | Array | List of person's interests |
| notes | String? | Nullable | General notes about person |
| userId | String | FK, Required | Owner user ID |
| createdAt | DateTime | Default: now() | Record creation timestamp |
| updatedAt | DateTime | Auto-update | Last modification timestamp |

**Indexes:**
- `userId` - For efficient user-based queries

**Relations:**
- Belongs to `User`
- Has many `DiaryMention` records

### DiaryEntry
Stores user's diary entries with support for rich content.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | String | PK, CUID | Unique entry identifier |
| content | String | Required | Diary entry content with tags |
| date | DateTime | Default: now() | Entry date (user-editable) |
| userId | String | FK, Required | Author user ID |
| createdAt | DateTime | Default: now() | Record creation timestamp |
| updatedAt | DateTime | Auto-update | Last modification timestamp |

**Indexes:**
- `userId` - For efficient user-based queries

**Relations:**
- Belongs to `User`
- Has many `DiaryMention` records
- Has many `DiaryLocation` records

**Content Format:**
- Supports markdown formatting
- Person references: `[person:personId]`
- Location references: `[location:placeId]`

### DiaryMention
Junction table linking diary entries to mentioned people.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | String | PK, CUID | Unique mention identifier |
| personId | String | FK, Required | Referenced person ID |
| diaryEntryId | String | FK, Required | Parent diary entry ID |
| createdAt | DateTime | Default: now() | Mention creation timestamp |

**Constraints:**
- Unique composite index on `[personId, diaryEntryId]`

**Relations:**
- Belongs to `Person`
- Belongs to `DiaryEntry`

### DiaryLocation
Stores location references within diary entries.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | String | PK, CUID | Unique location identifier |
| name | String | Required | Location display name |
| placeId | String | Required | Google Places ID |
| lat | Float | Required | Latitude coordinate |
| lng | Float | Required | Longitude coordinate |
| diaryEntryId | String | FK, Required | Parent diary entry ID |
| createdAt | DateTime | Default: now() | Location creation timestamp |
| updatedAt | DateTime | Auto-update | Last modification timestamp |

**Indexes:**
- `diaryEntryId` - For efficient diary-based queries

**Relations:**
- Belongs to `DiaryEntry`

### RefreshToken
Manages JWT refresh tokens for extended authentication sessions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | String | PK, CUID | Unique token identifier |
| token | String | Unique, Required | Refresh token value |
| userId | String | FK, Required | Owner user ID |
| expiresAt | DateTime | Required | Token expiration timestamp |
| createdAt | DateTime | Default: now() | Token creation timestamp |
| updatedAt | DateTime | Auto-update | Last modification timestamp |

**Indexes:**
- `token` - For fast token lookup
- `userId` - For user-based token management

**Relations:**
- Belongs to `User`

## Database Operations

### Common Query Patterns

#### Get User's People with Recent Interactions
```typescript
db.person.findMany({
  where: { userId },
  include: {
    mentions: {
      include: {
        diaryEntry: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5
    }
  }
})
```

#### Get Diary Entries with Full Relations
```typescript
db.diaryEntry.findMany({
  where: { userId },
  include: {
    mentions: {
      include: {
        person: true
      }
    },
    locations: true
  },
  orderBy: {
    date: 'desc'
  }
})
```

#### Find People by Mention Frequency
```typescript
db.person.findMany({
  where: { userId },
  include: {
    _count: {
      select: { mentions: true }
    }
  },
  orderBy: {
    mentions: {
      _count: 'desc'
    }
  }
})
```

## Migration Strategy

### Development Migrations
```bash
pnpm prisma:migrate-dev
```
- Creates new migration files
- Applies migrations to development database
- Regenerates Prisma Client

### Production Deployments
```bash
pnpm prisma:migrate-deploy
```
- Applies pending migrations
- No schema introspection
- Safe for production use

### Seeding
```bash
pnpm prisma:seed
```
- Populates database with test data
- Used for development and testing
- See `prisma/seed.ts` for seed data

## Performance Optimizations

### Indexes
Strategic indexes for common query patterns:
- User-based queries on all user-owned tables
- Token lookup for authentication
- Composite unique constraints for junction tables

### Prisma Accelerate
- Global database connection pooling
- Edge-optimized query execution
- Automatic query result caching
- Connection string format: `prisma://accelerate.prisma-data.net/...`

### Query Optimization Tips
1. Use `select` to fetch only needed fields
2. Limit relations depth to avoid N+1 queries
3. Use pagination for large result sets
4. Cache frequently accessed data in DAL

## Data Integrity

### Cascade Deletes
All foreign key relationships use `onDelete: Cascade`:
- Deleting a user removes all their data
- Deleting a person removes all their mentions
- Deleting a diary entry removes mentions and locations

### Validation Rules
- Email uniqueness enforced at database level
- CUID generation ensures globally unique IDs
- Timestamp fields auto-managed by Prisma

### Transaction Support
Complex operations use transactions:
```typescript
db.$transaction([
  db.diaryEntry.create({ ... }),
  db.diaryMention.createMany({ ... }),
  db.diaryLocation.createMany({ ... })
])
```

## Backup and Recovery

### Backup Strategy
- Automated daily backups (provider-dependent)
- Point-in-time recovery support
- Export functionality for user data

### Data Privacy
- User data isolation via application logic
- No cross-user data references
- Soft delete support (if needed) via status flags

## Future Considerations

### Potential Schema Extensions
- Tags/categories for diary entries
- Media attachments for entries
- Relationship types for people
- Activity tracking for people
- Reminder system for important dates

### Scalability Planning
- Partition by userId for large datasets
- Archive old diary entries
- Implement read replicas for analytics
- Consider time-series database for metrics
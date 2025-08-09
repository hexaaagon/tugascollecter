# @tugascollecter/types

Centralized TypeScript types for the TugasCollecter application. This package provides organized type definitions across different categories/domains.

## Installation

This package is private and used internally within the TugasCollecter monorepo.

## Categories

The types are organized into different categories for better organization and maintainability:

### Core Types (`@tugascollecter/types/core`)

Contains fundamental types used across the entire application:

```typescript
import {
  ThemeType,
  Priority,
  Status,
  UserPreferences,
} from "@tugascollecter/types/core";

// Base interfaces for all entities
import { BaseEntity, TimestampedEntity } from "@tugascollecter/types/core";
```

**Available types:**

- `ThemeType` - App theme options
- `Priority` - Task priority levels
- `Status` - Task status options
- `UserPreferences` - User settings interface
- `BaseEntity` - Base interface for all entities with id and timestamps
- `TimestampedEntity` - Interface for entities with creation/update timestamps
- `CacheItem<T>` - Generic cache item wrapper

### Storage Types (`@tugascollecter/types/storage`)

Types related to data persistence, storage, and caching:

```typescript
import {
  AttachmentData,
  STORAGE_KEYS,
  BackupData,
} from "@tugascollecter/types/storage";
import type { StorageAdapter } from "@tugascollecter/types/storage";
```

**Available types:**

- `AttachmentData` - File attachment interface
- `STORAGE_KEYS` - Constants for storage keys
- `StorageAdapter<T>` - Generic storage interface
- `BackupData` - App backup data structure
- `ImportOptions` - Data import configuration

### Homework Types (`@tugascollecter/types/homework`)

All homework/task-related type definitions:

```typescript
import {
  Homework,
  CreateHomeworkInput,
  HomeworkFilters,
} from "@tugascollecter/types/homework";
```

**Available types:**

- `Homework` - Main homework/task interface
- `HomeworkData` - Alias for `Homework` (backward compatibility)
- `CreateHomeworkInput` - Input type for creating new homework
- `UpdateHomeworkInput` - Input type for updating homework
- `HomeworkFilters` - Filtering options for homework queries

### Subject Types (`@tugascollecter/types/subject`)

Subject/course-related type definitions:

```typescript
import { Subject, CreateSubjectInput } from "@tugascollecter/types/subject";
```

**Available types:**

- `Subject` - Main subject interface
- `SubjectData` - Alias for `Subject` (backward compatibility)
- `CreateSubjectInput` - Input type for creating new subjects
- `UpdateSubjectInput` - Input type for updating subjects

### Utility Types (`@tugascollecter/types/utils`)

Helper and utility types:

```typescript
import {
  DayOfWeek,
  Optional,
  SortOptions,
  PaginatedResponse,
} from "@tugascollecter/types/utils";
```

**Available types:**

- `DayOfWeek` - Days of the week enum
- `Optional<T, K>` - Makes specific properties optional
- `RequiredFields<T, K>` - Makes specific properties required
- `DeepPartial<T>` - Deep partial type helper
- `DateRange` - Date range interface
- `SortOrder` & `SortOptions<T>` - Sorting configuration
- `PaginationParams` & `PaginatedResponse<T>` - Pagination types

## Usage Patterns

### Import Everything (Main Export)

```typescript
// Import all types from the main export
import {
  Homework,
  Subject,
  Priority,
  AttachmentData,
} from "@tugascollecter/types";
```

### Import by Category

```typescript
// Import only specific category types
import { ThemeType, UserPreferences } from "@tugascollecter/types/core";
import { AttachmentData, STORAGE_KEYS } from "@tugascollecter/types/storage";
import { Homework, CreateHomeworkInput } from "@tugascollecter/types/homework";
```

### Type-only Imports

```typescript
// For better tree-shaking and explicit type-only imports
import type { Homework } from "@tugascollecter/types/homework";
import type { Subject } from "@tugascollecter/types/subject";
```

## Backward Compatibility

This package maintains backward compatibility with existing imports by re-exporting legacy type names:

- `HomeworkData` → `Homework`
- `SubjectData` → `Subject`

## Best Practices

1. **Use category-specific imports** when you only need types from one domain
2. **Use type-only imports** when possible for better performance
3. **Extend base interfaces** (`BaseEntity`, `TimestampedEntity`) for consistency
4. **Use utility types** for common patterns like making fields optional/required

## Development

The types are organized in the `src/` directory by category, with individual export files at the root level to enable the category import pattern.

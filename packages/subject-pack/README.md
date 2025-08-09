# Subject Pack

A comprehensive subject template system for TugasCollecter that provides pre-defined school subjects for different countries and education levels.

- This package relies on AI. In the future, I'll rewrite it's content to match the current subjects.

## Overview

The Subject Pack is designed for users who are lazy to input their school subjects manually. It provides curated subject templates based on official curricula from different countries and education systems.

## Features

- 🌍 **Multi-country support**: Currently supports Global and Indonesia
- 🎓 **Education level specific**: Elementary, Junior High, Senior High, and University
- 📚 **Curriculum-based**: Based on official curriculum standards
- 🎨 **Pre-styled subjects**: Each subject comes with appropriate colors and metadata
- 🔍 **Search functionality**: Find subjects by category, education level, or keywords
- 📅 **Default schedules**: Suggested class schedules for each subject
- 🏷️ **Tagging system**: Subjects are tagged for better organization

## Supported Education Systems

### Global (International Standards)

- **Elementary** (Ages 6-11): Basic subjects like Mathematics, Science, Language Arts
- **Junior High School** (Ages 12-14): Algebra, Biology, Chemistry, Physics, etc.
- **Senior High School** (Ages 15-17): Advanced subjects with specializations
- **College** (Ages 18+): University-level courses across various disciplines

### Indonesia (Kurikulum 2013)

- **SD (Sekolah Dasar)**: Core Indonesian elementary subjects
- **SMP (Sekolah Menengah Pertama)**: Junior high with integrated science and social studies
- **SMA (Sekolah Menengah Atas)**: Senior high with specialization tracks (IPA, IPS, Bahasa)
- **Kuliah (Perguruan Tinggi)**: University courses with general education requirements

## Installation

```bash
# The package is already included in the TugasCollecter monorepo
# Import it in your app:
```

```typescript
import {
  getCountries,
  getSubjectPack,
  searchSubjects,
  getSubjectsForImport,
} from "@tugascollecter/subject-pack";
```

## Basic Usage

### Get Available Countries

```typescript
import { getCountries } from "@tugascollecter/subject-pack";

const countries = await getCountries();
console.log(countries);
// Returns array of CountryEducationSystem objects
```

### Get Subjects for Specific Education Level

```typescript
import { getSubjectPack } from "@tugascollecter/subject-pack";

// Get Indonesian elementary school subjects
const pack = await getSubjectPack("indonesia", 2025, "sd");
if (pack) {
  console.log(pack.subjects); // Array of SubjectTemplate objects
  console.log(pack.metadata.curriculum); // "Kurikulum 2013 - SD"
}
```

### Import Subjects to App

```typescript
import { getSubjectsForImport } from "@tugascollecter/subject-pack";

// Get subjects in format ready for app consumption
const subjects = await getSubjectsForImport("indonesia", 2025, "smp");
// Returns CreateSubjectInput[] - ready to be saved to storage

// Use with your storage manager
subjects.forEach(async (subject) => {
  await StorageManager.createSubject(subject);
});
```

### Search Subjects

```typescript
import { searchSubjects } from "@tugascollecter/subject-pack";

// Search for mathematics subjects
const mathSubjects = await searchSubjects({
  searchTerm: "mathematics",
  category: "mathematics",
  isCore: true,
});

// Search by country and education level
const indonesianScience = await searchSubjects({
  country: "indonesia",
  educationLevel: "sma",
  category: "science",
});
```

## Subject Template Structure

Each subject template contains:

```typescript
interface SubjectTemplate {
  id: string; // Unique identifier
  name: string; // Subject name
  color: string; // Hex color for UI
  description?: string; // Subject description
  category?: string; // Subject category
  isCore: boolean; // Whether it's a core/mandatory subject
  prerequisites?: string[]; // Required prerequisite subjects
  educationLevels: string[]; // Applicable education levels
  localizedName?: Record<string, string>; // Translations
  tags?: string[]; // Search tags
  defaultSchedule?: {
    // Suggested schedule
    day: string[]; // Days of week
    duration?: number; // Class duration in minutes
    frequency?: "daily" | "weekly" | "biweekly";
  };
}
```

## Categories

Subjects are organized into these categories:

- **mathematics**: Math, algebra, calculus, statistics
- **science**: Physics, chemistry, biology, natural sciences
- **language**: Native language, foreign languages, literature
- **social**: History, geography, economics, sociology
- **arts**: Art, music, theater, creative subjects
- **physical**: Physical education, sports, health
- **technology**: Computer science, programming, IT
- **religious**: Religious education (varies by country)

## Education Level Mapping

### Global → Indonesia

- Elementary → SD (Sekolah Dasar)
- Junior High → SMP (Sekolah Menengah Pertama)
- Senior High → SMA (Sekolah Menengah Atas)
- College → Kuliah (Perguruan Tinggi)

## Advanced Usage

### Custom Subject Manager

```typescript
import { SubjectPackManager } from "@tugascollecter/subject-pack";

// Get all available packs
const allPacks = await SubjectPackManager.getAllPacks();

// Clear cache (useful for development)
SubjectPackManager.clearCache();

// Get education levels for a country
const levels = await SubjectPackManager.getEducationLevels("ID");
```

### Filter and Process Subjects

```typescript
// Get only core subjects for Indonesian SMP
const pack = await getSubjectPack("indonesia", 2025, "smp");
const coreSubjects = pack?.subjects.filter((s) => s.isCore) || [];

// Get subjects by schedule (daily subjects)
const dailySubjects =
  pack?.subjects.filter((s) => s.defaultSchedule?.frequency === "daily") || [];

// Get subjects with prerequisites (advanced subjects)
const advancedSubjects =
  pack?.subjects.filter((s) => s.prerequisites && s.prerequisites.length > 0) ||
  [];
```

## Contributing New Subject Packs

To add support for new countries or education levels:

1. Create a new folder structure under `subjects/[country]/[year]/[education-level]/`
2. Implement the subject pack following the existing pattern
3. Add the country to the education system registry
4. Update imports in the respective index files

Example structure:

```
subjects/
  malaysia/
    2025/
      Primary/
        index.ts
      Secondary/
        index.ts
```

## Examples

See `examples.ts` for comprehensive usage examples including:

- Getting all countries and education levels
- Searching subjects by various criteria
- Comparing subjects across education levels
- Getting pack statistics and metadata

## API Reference

### Functions

- `getCountries()`: Get all supported countries
- `getEducationLevels(countryCode)`: Get education levels for a country
- `getSubjectPack(country, year, level)`: Get specific subject pack
- `searchSubjects(query)`: Search subjects with filters
- `getSubjectsForImport(country, year, level)`: Get subjects ready for app import

### Classes

- `SubjectPackManager`: Main class for managing subject packs

### Types

- `SubjectTemplate`: Individual subject definition
- `SubjectPack`: Collection of subjects for an education level
- `CountryEducationSystem`: Country-specific education system definition
- `SubjectPackQuery`: Search query parameters

## License

This package is part of the TugasCollecter project and follows the same license.

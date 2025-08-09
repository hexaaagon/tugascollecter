# Language Pack for Tugas Collecter

This package provides internationalization support for the Tugas Collecter app.

## Structure

```
packages/language-pack/
├── index.ts          # Main export file with translation functions
├── types.ts          # TypeScript interface definitions
└── locales/
    ├── en/
    │   └── index.ts  # English translations (complete)
    └── id/
        └── index.ts  # Indonesian translations (TODO: needs manual translation)
```

## Usage

```typescript
import { t, setLanguage } from "@tugascollecter/language-pack";

// Set language
setLanguage("id"); // Indonesian
setLanguage("en"); // English

// Use translations
const title = t("newHomework"); // "New Homework" or "Tugas Baru"
const greeting = t("greeting.morning"); // "Good Morning" or "Selamat Pagi"
```

## Adding New Languages

1. Create a new directory in `locales/` (e.g., `locales/fr/`)
2. Create an `index.ts` file with the translation object
3. Update the `Language` type in `types.ts`
4. Add the new language to the `translations` object in `index.ts`

## Translation Keys

The translation keys are organized into logical groups:

- General (cancel, save, edit, delete, etc.)
- Navigation (home, tasks, calendar, settings, etc.)
- Home Screen (greetings, task counts, etc.)
- Settings Screen (all settings options and descriptions)
- Forms (homework form fields and labels)
- Alerts and Messages (confirmation dialogs, toasts, etc.)

Please maintain consistency in terminology throughout the translations.

## Installation

```bash
bun install
```

This project was created using `bun init` in bun v1.2.19. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.

// Storage and data persistence types
import type { HomeworkData, SubjectData } from "..";
import type { UserPreferences, ThemeType, CacheItem } from "./core";
import type { Homework, AttachmentData } from "./homework";
import type { Subject } from "./subject";

// Re-export for backward compatibility
export type { UserPreferences, ThemeType, CacheItem, AttachmentData };

// Storage keys constants
export const STORAGE_KEYS = {
  PREFERENCES: "@tugascollecter_preferences",
  THEME: "@tugascollecter_theme_preference",
  HOMEWORK: "@tugascollecter_homework",
  SUBJECTS: "@tugascollecter_subjects",
  FIRST_LAUNCH: "@tugascollecter_first_launch",

  CACHE_PREFIX: "@tugascollecter_cache_",

  APP_FOLDER: "TugasCollecter",
  ATTACHMENTS_FOLDER: "attachments",
  EXPORTS_FOLDER: "exports",
  TEMP_FOLDER: "temp",
  CACHE_FOLDER: "cache",
} as const;

export const DEFAULT_PREFERENCES: UserPreferences = {
  notifications: false,
  autoSync: false,
  soundEffects: false,
  hapticFeedback: false,
} as const;

export type StorageKey = keyof typeof STORAGE_KEYS;

// Database/Storage interfaces
export interface StorageAdapter<T = any> {
  get(key: string): Promise<T | null>;
  set(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
  getAllKeys(): Promise<string[]>;
}

// Backup/Restore types
export interface BackupData {
  version: string;
  timestamp: string;
  homeworks: Homework[];
  subjects: Subject[];
  userPreferences: UserPreferences;
  attachments: AttachmentData[];
}

export interface ImportOptions {
  overwrite?: boolean;
  mergeStrategy?: "replace" | "append" | "skip";
}

export interface ExportData {
  version: string;
  exportedAt: string;
  homework: HomeworkData[];
  subjects: SubjectData[];
  preferences: UserPreferences;
  theme: ThemeType;
}

export class StorageError extends Error {
  constructor(
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = "StorageError";
  }
}

export class ExternalStorageError extends Error {
  constructor(
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = "ExternalStorageError";
  }
}

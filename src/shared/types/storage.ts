import { Homework } from "./homework";
import { Subject } from "./subject";

export interface UserPreferences {
  notifications: boolean;
  autoSync: boolean;
  soundEffects: boolean;
  hapticFeedback: boolean;
}

export type ThemeType = "light" | "dark" | "system";
export type HomeworkData = Homework;
export type SubjectData = Subject;

export interface AttachmentData {
  id: string;
  name: string;
  type: "image" | "document" | "audio" | "video" | "other";
  uri: string;
  size: number; // in bytes
  mimeType?: string;
  uploadedAt: string;
}

export interface CacheItem<T = any> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

export interface ExportData {
  version: string;
  exportedAt: string;
  homework: HomeworkData[];
  subjects: SubjectData[];
  preferences: UserPreferences;
  theme: ThemeType;
}

// Storage Keys
export const STORAGE_KEYS = {
  PREFERENCES: "@tugascollecter_preferences",
  THEME: "@tugascollecter_theme_preference",
  HOMEWORK: "@tugascollecter_homework",
  SUBJECTS: "@tugascollecter_subjects",

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
};

export class StorageError extends Error {
  constructor(
    message: string,
    public code?: string,
  ) {
    super(message);
    this.name = "StorageError";
  }
}

export class CacheError extends Error {
  constructor(
    message: string,
    public code?: string,
  ) {
    super(message);
    this.name = "CacheError";
  }
}

export class ExternalStorageError extends Error {
  constructor(
    message: string,
    public code?: string,
  ) {
    super(message);
    this.name = "ExternalStorageError";
  }
}

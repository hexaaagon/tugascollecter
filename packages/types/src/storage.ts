// Storage and data persistence types
import type { UserPreferences, ThemeType, CacheItem } from "./core";
import type { Homework, AttachmentData } from "./homework";
import type { Subject } from "./subject";

// Re-export for backward compatibility
export type { UserPreferences, ThemeType, CacheItem, AttachmentData };

// Storage keys constants
export const STORAGE_KEYS = {
  HOMEWORKS: "homeworks",
  SUBJECTS: "subjects",
  USER_PREFERENCES: "userPreferences",
  THEME: "theme",
  LANGUAGE: "language",
  CACHE: "cache",
  ATTACHMENTS: "attachments",
  LAST_SYNC: "lastSync",
  NOTIFICATION_PERMISSION: "notificationPermission",
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

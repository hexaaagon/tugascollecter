// Core application types that are used across the entire app

export type ThemeType = "light" | "dark" | "system";

export type Priority = "low" | "medium" | "high";

export type Status = "pending" | "in-progress" | "completed" | "overdue";

export interface UserPreferences {
  notifications: boolean;
  autoSync: boolean;
  soundEffects: boolean;
  hapticFeedback: boolean;
}

export interface CacheItem<T = any> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

// Common base interface for entities with timestamps
export interface TimestampedEntity {
  createdAt?: string; // ISO 8601 format
  updatedAt?: string; // ISO 8601 format
}

// Common base interface for identifiable entities
export interface BaseEntity extends TimestampedEntity {
  id: string;
}

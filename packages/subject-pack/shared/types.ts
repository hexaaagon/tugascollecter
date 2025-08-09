import type { CreateSubjectInput } from "@tugascollecter/types";

// Education levels for different countries
export interface EducationLevel {
  id: string;
  name: string;
  localizedName?: Record<string, string>; // For different language support
  description?: string;
  ageRange?: {
    min: number;
    max: number;
  };
  duration?: number; // in years
  order: number; // for sorting
}

// Country-specific education system
export interface CountryEducationSystem {
  countryCode: string; // ISO 3166-1 alpha-2 code (e.g., 'ID', 'US', 'GB')
  countryName: string;
  localizedName?: Record<string, string>;
  educationLevels: EducationLevel[];
}

// Subject template with education level context
export interface SubjectTemplate extends Omit<CreateSubjectInput, "day"> {
  id: string;
  category?: string; // e.g., 'science', 'mathematics', 'language', 'social', 'arts', 'physical'
  isCore: boolean; // core subjects are mandatory
  prerequisites?: string[]; // ids of prerequisite subjects
  educationLevels: string[]; // which education levels this subject applies to
  localizedName?: Record<string, string>; // for different languages
  tags?: string[]; // additional metadata
  defaultSchedule?: {
    day: string[]; // days of week
    duration?: number; // in minutes
    frequency?: "daily" | "weekly" | "biweekly";
  };
}

// Subject pack for a specific country, year, and education level
export interface SubjectPack {
  country: string;
  year: number;
  educationLevel: string;
  subjects: SubjectTemplate[];
  metadata: {
    version: string;
    lastUpdated: string;
    curriculum?: string; // curriculum name/version
    source?: string; // data source
    contributors?: string[];
  };
}

// Main subject pack registry
export interface SubjectPackRegistry {
  countries: CountryEducationSystem[];
  packs: Record<string, SubjectPack>; // key: `${country}-${year}-${educationLevel}`
}

// Utility types for searching and filtering
export interface SubjectPackQuery {
  country?: string;
  year?: number;
  educationLevel?: string;
  category?: string;
  isCore?: boolean;
  searchTerm?: string;
}

export interface SubjectPackSearchResult {
  pack: SubjectPack;
  subjects: SubjectTemplate[];
  totalResults: number;
}

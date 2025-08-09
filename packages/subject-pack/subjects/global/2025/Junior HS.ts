import type { SubjectPack, SubjectTemplate } from "../../../shared/types";

const subjects: SubjectTemplate[] = [
  // Core Mathematics & Science
  {
    id: "algebra",
    name: "Algebra",
    color: "#3b82f6",
    description: "Introduction to algebraic concepts and equations",
    category: "mathematics",
    isCore: true,
    educationLevels: ["junior-hs"],
    localizedName: {
      en: "Algebra",
      id: "Aljabar",
    },
    tags: ["equations", "variables", "functions", "graphing"],
    defaultSchedule: {
      day: ["monday", "wednesday", "friday"],
      duration: 50,
      frequency: "weekly",
    },
  },
  {
    id: "geometry",
    name: "Geometry",
    color: "#1d4ed8",
    description: "Study of shapes, angles, and spatial relationships",
    category: "mathematics",
    isCore: true,
    educationLevels: ["junior-hs"],
    localizedName: {
      en: "Geometry",
      id: "Geometri",
    },
    tags: ["shapes", "angles", "proofs", "measurement"],
    defaultSchedule: {
      day: ["tuesday", "thursday"],
      duration: 50,
      frequency: "weekly",
    },
  },
  {
    id: "biology",
    name: "Biology",
    color: "#059669",
    description: "Study of living organisms and life processes",
    category: "science",
    isCore: true,
    educationLevels: ["junior-hs"],
    localizedName: {
      en: "Biology",
      id: "Biologi",
    },
    tags: ["life", "organisms", "cells", "ecosystems"],
    defaultSchedule: {
      day: ["monday", "thursday"],
      duration: 50,
      frequency: "weekly",
    },
  },
  {
    id: "chemistry",
    name: "Chemistry",
    color: "#7c3aed",
    description: "Introduction to chemical elements and reactions",
    category: "science",
    isCore: true,
    educationLevels: ["junior-hs"],
    localizedName: {
      en: "Chemistry",
      id: "Kimia",
    },
    tags: ["elements", "reactions", "compounds", "lab"],
    defaultSchedule: {
      day: ["tuesday", "friday"],
      duration: 50,
      frequency: "weekly",
    },
  },
  {
    id: "physics",
    name: "Physics",
    color: "#dc2626",
    description: "Basic principles of motion, force, and energy",
    category: "science",
    isCore: true,
    educationLevels: ["junior-hs"],
    localizedName: {
      en: "Physics",
      id: "Fisika",
    },
    tags: ["motion", "force", "energy", "mechanics"],
    defaultSchedule: {
      day: ["wednesday", "friday"],
      duration: 50,
      frequency: "weekly",
    },
  },

  // Language Arts
  {
    id: "english",
    name: "English",
    color: "#10b981",
    description: "Advanced reading, writing, and literature",
    category: "language",
    isCore: true,
    educationLevels: ["junior-hs"],
    localizedName: {
      en: "English",
      id: "Bahasa Inggris",
    },
    tags: ["literature", "grammar", "writing", "communication"],
    defaultSchedule: {
      day: ["monday", "tuesday", "wednesday", "thursday"],
      duration: 50,
      frequency: "weekly",
    },
  },

  // Social Studies
  {
    id: "world-history",
    name: "World History",
    color: "#f59e0b",
    description: "Study of major historical events and civilizations",
    category: "social",
    isCore: true,
    educationLevels: ["junior-hs"],
    localizedName: {
      en: "World History",
      id: "Sejarah Dunia",
    },
    tags: ["civilizations", "events", "cultures", "timeline"],
    defaultSchedule: {
      day: ["tuesday", "thursday"],
      duration: 50,
      frequency: "weekly",
    },
  },
  {
    id: "geography",
    name: "Geography",
    color: "#0d9488",
    description: "Study of Earth's features, climate, and human geography",
    category: "social",
    isCore: true,
    educationLevels: ["junior-hs"],
    localizedName: {
      en: "Geography",
      id: "Geografi",
    },
    tags: ["maps", "climate", "culture", "environment"],
    defaultSchedule: {
      day: ["monday", "wednesday"],
      duration: 50,
      frequency: "weekly",
    },
  },

  // Arts & Electives
  {
    id: "art",
    name: "Art",
    color: "#ec4899",
    description: "Creative expression and art history",
    category: "arts",
    isCore: false,
    educationLevels: ["junior-hs"],
    localizedName: {
      en: "Art",
      id: "Seni Rupa",
    },
    tags: ["creativity", "history", "techniques", "media"],
    defaultSchedule: {
      day: ["friday"],
      duration: 50,
      frequency: "weekly",
    },
  },
  {
    id: "music",
    name: "Music",
    color: "#84cc16",
    description: "Music theory, instruments, and performance",
    category: "arts",
    isCore: false,
    educationLevels: ["junior-hs"],
    localizedName: {
      en: "Music",
      id: "Musik",
    },
    tags: ["theory", "instruments", "performance", "composition"],
    defaultSchedule: {
      day: ["wednesday"],
      duration: 50,
      frequency: "weekly",
    },
  },
  {
    id: "physical-education",
    name: "Physical Education",
    color: "#06b6d4",
    description: "Sports, fitness, and health education",
    category: "physical",
    isCore: false,
    educationLevels: ["junior-hs"],
    localizedName: {
      en: "Physical Education",
      id: "Pendidikan Jasmani",
    },
    tags: ["sports", "fitness", "health", "teamwork"],
    defaultSchedule: {
      day: ["monday", "friday"],
      duration: 50,
      frequency: "weekly",
    },
  },
  {
    id: "technology",
    name: "Technology",
    color: "#6366f1",
    description: "Computer skills and digital citizenship",
    category: "technology",
    isCore: false,
    educationLevels: ["junior-hs"],
    localizedName: {
      en: "Technology",
      id: "Teknologi",
    },
    tags: ["computers", "digital", "programming", "internet"],
    defaultSchedule: {
      day: ["thursday"],
      duration: 50,
      frequency: "weekly",
    },
  },
];

export async function getPack(): Promise<SubjectPack> {
  return {
    country: "global",
    year: 2025,
    educationLevel: "junior-hs",
    subjects,
    metadata: {
      version: "1.0.0",
      lastUpdated: "2025-01-09",
      curriculum: "Global Junior High School Standards",
      source: "International Secondary Education Guidelines",
      contributors: ["TugasCollecter Team"],
    },
  };
}

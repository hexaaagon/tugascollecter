import type { SubjectPack, SubjectTemplate } from "../../../shared/types";

const subjects: SubjectTemplate[] = [
  // Core Subjects
  {
    id: "mathematics",
    name: "Mathematics",
    color: "#3b82f6",
    description: "Basic arithmetic, geometry, and problem-solving",
    category: "mathematics",
    isCore: true,
    educationLevels: ["elementary"],
    localizedName: {
      en: "Mathematics",
      id: "Matematika",
    },
    tags: ["numbers", "arithmetic", "geometry", "basic-math"],
    defaultSchedule: {
      day: ["monday", "tuesday", "wednesday", "thursday", "friday"],
      duration: 45,
      frequency: "daily",
    },
  },
  {
    id: "language-arts",
    name: "Language Arts",
    color: "#10b981",
    description: "Reading, writing, grammar, and communication skills",
    category: "language",
    isCore: true,
    educationLevels: ["elementary"],
    localizedName: {
      en: "Language Arts",
      id: "Bahasa",
    },
    tags: ["reading", "writing", "grammar", "communication"],
    defaultSchedule: {
      day: ["monday", "tuesday", "wednesday", "thursday", "friday"],
      duration: 45,
      frequency: "daily",
    },
  },
  {
    id: "science",
    name: "Science",
    color: "#8b5cf6",
    description: "Basic natural science concepts and experiments",
    category: "science",
    isCore: true,
    educationLevels: ["elementary"],
    localizedName: {
      en: "Science",
      id: "Sains",
    },
    tags: ["nature", "experiments", "discovery", "basic-science"],
    defaultSchedule: {
      day: ["tuesday", "thursday"],
      duration: 45,
      frequency: "weekly",
    },
  },
  {
    id: "social-studies",
    name: "Social Studies",
    color: "#f59e0b",
    description: "History, geography, and community understanding",
    category: "social",
    isCore: true,
    educationLevels: ["elementary"],
    localizedName: {
      en: "Social Studies",
      id: "Ilmu Pengetahuan Sosial",
    },
    tags: ["history", "geography", "community", "culture"],
    defaultSchedule: {
      day: ["monday", "wednesday"],
      duration: 45,
      frequency: "weekly",
    },
  },

  // Additional Subjects
  {
    id: "art",
    name: "Art",
    color: "#ec4899",
    description: "Creative expression through drawing, painting, and crafts",
    category: "arts",
    isCore: false,
    educationLevels: ["elementary"],
    localizedName: {
      en: "Art",
      id: "Seni Rupa",
    },
    tags: ["creativity", "drawing", "painting", "crafts"],
    defaultSchedule: {
      day: ["friday"],
      duration: 45,
      frequency: "weekly",
    },
  },
  {
    id: "physical-education",
    name: "Physical Education",
    color: "#06b6d4",
    description: "Sports, games, and physical fitness activities",
    category: "physical",
    isCore: false,
    educationLevels: ["elementary"],
    localizedName: {
      en: "Physical Education",
      id: "Pendidikan Jasmani",
    },
    tags: ["sports", "fitness", "games", "health"],
    defaultSchedule: {
      day: ["wednesday"],
      duration: 60,
      frequency: "weekly",
    },
  },
  {
    id: "music",
    name: "Music",
    color: "#84cc16",
    description: "Introduction to musical instruments, rhythm, and songs",
    category: "arts",
    isCore: false,
    educationLevels: ["elementary"],
    localizedName: {
      en: "Music",
      id: "Musik",
    },
    tags: ["instruments", "rhythm", "songs", "melody"],
    defaultSchedule: {
      day: ["thursday"],
      duration: 45,
      frequency: "weekly",
    },
  },
  {
    id: "computer-basics",
    name: "Computer Basics",
    color: "#6366f1",
    description: "Introduction to computers and basic digital literacy",
    category: "technology",
    isCore: false,
    educationLevels: ["elementary"],
    localizedName: {
      en: "Computer Basics",
      id: "Dasar Komputer",
    },
    tags: ["technology", "digital", "computer", "basics"],
    defaultSchedule: {
      day: ["friday"],
      duration: 45,
      frequency: "weekly",
    },
  },
];

export async function getPack(): Promise<SubjectPack> {
  return {
    country: "global",
    year: 2025,
    educationLevel: "elementary",
    subjects,
    metadata: {
      version: "1.0.0",
      lastUpdated: "2025-01-09",
      curriculum: "Global Elementary Standards",
      source: "International Elementary Education Guidelines",
      contributors: ["TugasCollecter Team"],
    },
  };
}

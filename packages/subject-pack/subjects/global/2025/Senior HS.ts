import type { SubjectPack, SubjectTemplate } from "../../../shared/types";

const subjects: SubjectTemplate[] = [
  // Advanced Mathematics
  {
    id: "advanced-algebra",
    name: "Advanced Algebra",
    color: "#1e40af",
    description: "Complex equations, polynomials, and functions",
    category: "mathematics",
    isCore: true,
    educationLevels: ["senior-hs"],
    localizedName: {
      en: "Advanced Algebra",
      id: "Aljabar Lanjutan",
    },
    prerequisites: ["algebra"],
    tags: ["polynomials", "functions", "complex-equations", "graphing"],
    defaultSchedule: {
      day: ["monday", "wednesday", "friday"],
      duration: 55,
      frequency: "weekly",
    },
  },
  {
    id: "calculus",
    name: "Calculus",
    color: "#3730a3",
    description: "Differential and integral calculus",
    category: "mathematics",
    isCore: false,
    educationLevels: ["senior-hs"],
    localizedName: {
      en: "Calculus",
      id: "Kalkulus",
    },
    prerequisites: ["advanced-algebra"],
    tags: ["derivatives", "integrals", "limits", "applications"],
    defaultSchedule: {
      day: ["tuesday", "thursday"],
      duration: 55,
      frequency: "weekly",
    },
  },
  {
    id: "statistics",
    name: "Statistics",
    color: "#0f766e",
    description: "Data analysis, probability, and statistical methods",
    category: "mathematics",
    isCore: false,
    educationLevels: ["senior-hs"],
    localizedName: {
      en: "Statistics",
      id: "Statistik",
    },
    tags: ["data", "probability", "analysis", "research"],
    defaultSchedule: {
      day: ["friday"],
      duration: 55,
      frequency: "weekly",
    },
  },

  // Advanced Sciences
  {
    id: "advanced-biology",
    name: "Advanced Biology",
    color: "#166534",
    description: "Molecular biology, genetics, and advanced life sciences",
    category: "science",
    isCore: true,
    educationLevels: ["senior-hs"],
    localizedName: {
      en: "Advanced Biology",
      id: "Biologi Lanjutan",
    },
    prerequisites: ["biology"],
    tags: ["genetics", "molecular", "ecology", "evolution"],
    defaultSchedule: {
      day: ["monday", "thursday"],
      duration: 55,
      frequency: "weekly",
    },
  },
  {
    id: "advanced-chemistry",
    name: "Advanced Chemistry",
    color: "#581c87",
    description: "Organic chemistry, chemical bonding, and lab techniques",
    category: "science",
    isCore: true,
    educationLevels: ["senior-hs"],
    localizedName: {
      en: "Advanced Chemistry",
      id: "Kimia Lanjutan",
    },
    prerequisites: ["chemistry"],
    tags: ["organic", "bonding", "lab", "reactions"],
    defaultSchedule: {
      day: ["tuesday", "friday"],
      duration: 55,
      frequency: "weekly",
    },
  },
  {
    id: "advanced-physics",
    name: "Advanced Physics",
    color: "#991b1b",
    description: "Electricity, magnetism, waves, and modern physics",
    category: "science",
    isCore: true,
    educationLevels: ["senior-hs"],
    localizedName: {
      en: "Advanced Physics",
      id: "Fisika Lanjutan",
    },
    prerequisites: ["physics"],
    tags: ["electricity", "magnetism", "waves", "quantum"],
    defaultSchedule: {
      day: ["wednesday", "thursday"],
      duration: 55,
      frequency: "weekly",
    },
  },

  // Language & Literature
  {
    id: "english-literature",
    name: "English Literature",
    color: "#047857",
    description: "Classic and modern literature analysis",
    category: "language",
    isCore: true,
    educationLevels: ["senior-hs"],
    localizedName: {
      en: "English Literature",
      id: "Sastra Inggris",
    },
    prerequisites: ["english"],
    tags: ["literature", "analysis", "writing", "criticism"],
    defaultSchedule: {
      day: ["monday", "wednesday"],
      duration: 55,
      frequency: "weekly",
    },
  },
  {
    id: "composition",
    name: "Composition",
    color: "#059669",
    description: "Advanced writing skills and rhetoric",
    category: "language",
    isCore: true,
    educationLevels: ["senior-hs"],
    localizedName: {
      en: "Composition",
      id: "Komposisi",
    },
    tags: ["writing", "rhetoric", "essays", "research"],
    defaultSchedule: {
      day: ["tuesday", "thursday"],
      duration: 55,
      frequency: "weekly",
    },
  },

  // Social Sciences
  {
    id: "world-cultures",
    name: "World Cultures",
    color: "#d97706",
    description: "Comparative study of world cultures and societies",
    category: "social",
    isCore: true,
    educationLevels: ["senior-hs"],
    localizedName: {
      en: "World Cultures",
      id: "Budaya Dunia",
    },
    prerequisites: ["world-history"],
    tags: ["cultures", "societies", "anthropology", "comparative"],
    defaultSchedule: {
      day: ["monday", "friday"],
      duration: 55,
      frequency: "weekly",
    },
  },
  {
    id: "economics",
    name: "Economics",
    color: "#92400e",
    description: "Basic economic principles and market systems",
    category: "social",
    isCore: false,
    educationLevels: ["senior-hs"],
    localizedName: {
      en: "Economics",
      id: "Ekonomi",
    },
    tags: ["markets", "finance", "trade", "policy"],
    defaultSchedule: {
      day: ["wednesday"],
      duration: 55,
      frequency: "weekly",
    },
  },
  {
    id: "psychology",
    name: "Psychology",
    color: "#7c2d12",
    description: "Introduction to human behavior and mental processes",
    category: "social",
    isCore: false,
    educationLevels: ["senior-hs"],
    localizedName: {
      en: "Psychology",
      id: "Psikologi",
    },
    tags: ["behavior", "mental", "cognition", "development"],
    defaultSchedule: {
      day: ["thursday"],
      duration: 55,
      frequency: "weekly",
    },
  },

  // Arts & Electives
  {
    id: "advanced-art",
    name: "Advanced Art",
    color: "#be185d",
    description: "Portfolio development and advanced techniques",
    category: "arts",
    isCore: false,
    educationLevels: ["senior-hs"],
    localizedName: {
      en: "Advanced Art",
      id: "Seni Rupa Lanjutan",
    },
    prerequisites: ["art"],
    tags: ["portfolio", "techniques", "media", "critique"],
    defaultSchedule: {
      day: ["friday"],
      duration: 90,
      frequency: "weekly",
    },
  },
  {
    id: "computer-science",
    name: "Computer Science",
    color: "#4338ca",
    description: "Programming, algorithms, and computer systems",
    category: "technology",
    isCore: false,
    educationLevels: ["senior-hs"],
    localizedName: {
      en: "Computer Science",
      id: "Ilmu Komputer",
    },
    prerequisites: ["technology"],
    tags: ["programming", "algorithms", "data-structures", "systems"],
    defaultSchedule: {
      day: ["tuesday", "thursday"],
      duration: 55,
      frequency: "weekly",
    },
  },
  {
    id: "foreign-language",
    name: "Foreign Language",
    color: "#16a34a",
    description: "Study of a second foreign language",
    category: "language",
    isCore: false,
    educationLevels: ["senior-hs"],
    localizedName: {
      en: "Foreign Language",
      id: "Bahasa Asing",
    },
    tags: ["communication", "culture", "fluency", "grammar"],
    defaultSchedule: {
      day: ["monday", "wednesday", "friday"],
      duration: 55,
      frequency: "weekly",
    },
  },
];

export async function getPack(): Promise<SubjectPack> {
  return {
    country: "global",
    year: 2025,
    educationLevel: "senior-hs",
    subjects,
    metadata: {
      version: "1.0.0",
      lastUpdated: "2025-01-09",
      curriculum: "Global Senior High School Standards",
      source: "International Secondary Education Guidelines",
      contributors: ["TugasCollecter Team"],
    },
  };
}

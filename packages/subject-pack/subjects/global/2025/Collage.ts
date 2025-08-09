import type { SubjectPack, SubjectTemplate } from "../../../shared/types";

const subjects: SubjectTemplate[] = [
  // Core Academic Subjects (vary by major/program)
  {
    id: "college-mathematics",
    name: "College Mathematics",
    color: "#1e3a8a",
    description: "Advanced mathematics including calculus and linear algebra",
    category: "mathematics",
    isCore: true,
    educationLevels: ["college"],
    localizedName: {
      en: "College Mathematics",
      id: "Matematika Perguruan Tinggi",
    },
    tags: ["calculus", "linear-algebra", "discrete-math", "advanced"],
    defaultSchedule: {
      day: ["monday", "wednesday", "friday"],
      duration: 75,
      frequency: "weekly",
    },
  },
  {
    id: "academic-writing",
    name: "Academic Writing",
    color: "#047857",
    description: "Research, citation, and scholarly communication",
    category: "language",
    isCore: true,
    educationLevels: ["college"],
    localizedName: {
      en: "Academic Writing",
      id: "Penulisan Akademik",
    },
    tags: ["research", "citation", "essays", "scholarly"],
    defaultSchedule: {
      day: ["tuesday", "thursday"],
      duration: 75,
      frequency: "weekly",
    },
  },
  {
    id: "critical-thinking",
    name: "Critical Thinking",
    color: "#7c2d12",
    description: "Logic, reasoning, and analytical skills",
    category: "social",
    isCore: true,
    educationLevels: ["college"],
    localizedName: {
      en: "Critical Thinking",
      id: "Pemikiran Kritis",
    },
    tags: ["logic", "reasoning", "analysis", "philosophy"],
    defaultSchedule: {
      day: ["wednesday"],
      duration: 75,
      frequency: "weekly",
    },
  },

  // STEM Subjects
  {
    id: "computer-programming",
    name: "Computer Programming",
    color: "#3730a3",
    description: "Software development and programming languages",
    category: "technology",
    isCore: false,
    educationLevels: ["college"],
    localizedName: {
      en: "Computer Programming",
      id: "Pemrograman Komputer",
    },
    tags: ["coding", "software", "algorithms", "languages"],
    defaultSchedule: {
      day: ["monday", "wednesday"],
      duration: 90,
      frequency: "weekly",
    },
  },
  {
    id: "data-structures",
    name: "Data Structures",
    color: "#4338ca",
    description: "Algorithms and data organization methods",
    category: "technology",
    isCore: false,
    educationLevels: ["college"],
    localizedName: {
      en: "Data Structures",
      id: "Struktur Data",
    },
    prerequisites: ["computer-programming"],
    tags: ["algorithms", "efficiency", "organization", "problem-solving"],
    defaultSchedule: {
      day: ["tuesday", "friday"],
      duration: 75,
      frequency: "weekly",
    },
  },
  {
    id: "organic-chemistry",
    name: "Organic Chemistry",
    color: "#6d28d9",
    description: "Study of carbon-based compounds and reactions",
    category: "science",
    isCore: false,
    educationLevels: ["college"],
    localizedName: {
      en: "Organic Chemistry",
      id: "Kimia Organik",
    },
    tags: ["organic", "reactions", "synthesis", "lab"],
    defaultSchedule: {
      day: ["monday", "thursday"],
      duration: 75,
      frequency: "weekly",
    },
  },
  {
    id: "molecular-biology",
    name: "Molecular Biology",
    color: "#166534",
    description: "Study of biological processes at the molecular level",
    category: "science",
    isCore: false,
    educationLevels: ["college"],
    localizedName: {
      en: "Molecular Biology",
      id: "Biologi Molekuler",
    },
    tags: ["molecular", "genetics", "proteins", "DNA"],
    defaultSchedule: {
      day: ["tuesday", "thursday"],
      duration: 90,
      frequency: "weekly",
    },
  },

  // Business & Economics
  {
    id: "microeconomics",
    name: "Microeconomics",
    color: "#92400e",
    description: "Individual and firm economic decision-making",
    category: "social",
    isCore: false,
    educationLevels: ["college"],
    localizedName: {
      en: "Microeconomics",
      id: "Mikroekonomi",
    },
    tags: ["markets", "supply-demand", "competition", "decision-making"],
    defaultSchedule: {
      day: ["monday", "wednesday"],
      duration: 75,
      frequency: "weekly",
    },
  },
  {
    id: "macroeconomics",
    name: "Macroeconomics",
    color: "#d97706",
    description: "National and global economic systems",
    category: "social",
    isCore: false,
    educationLevels: ["college"],
    localizedName: {
      en: "Macroeconomics",
      id: "Makroekonomi",
    },
    prerequisites: ["microeconomics"],
    tags: ["national", "global", "policy", "systems"],
    defaultSchedule: {
      day: ["tuesday", "friday"],
      duration: 75,
      frequency: "weekly",
    },
  },
  {
    id: "business-management",
    name: "Business Management",
    color: "#059669",
    description: "Organizational behavior and management principles",
    category: "social",
    isCore: false,
    educationLevels: ["college"],
    localizedName: {
      en: "Business Management",
      id: "Manajemen Bisnis",
    },
    tags: ["leadership", "organization", "strategy", "operations"],
    defaultSchedule: {
      day: ["thursday"],
      duration: 75,
      frequency: "weekly",
    },
  },

  // Liberal Arts & Humanities
  {
    id: "philosophy",
    name: "Philosophy",
    color: "#7c2d12",
    description: "Study of fundamental questions about existence and knowledge",
    category: "social",
    isCore: false,
    educationLevels: ["college"],
    localizedName: {
      en: "Philosophy",
      id: "Filsafat",
    },
    tags: ["ethics", "logic", "metaphysics", "epistemology"],
    defaultSchedule: {
      day: ["wednesday"],
      duration: 75,
      frequency: "weekly",
    },
  },
  {
    id: "world-literature",
    name: "World Literature",
    color: "#0f766e",
    description: "Literature from diverse global traditions",
    category: "language",
    isCore: false,
    educationLevels: ["college"],
    localizedName: {
      en: "World Literature",
      id: "Sastra Dunia",
    },
    tags: ["literature", "culture", "analysis", "global"],
    defaultSchedule: {
      day: ["monday", "friday"],
      duration: 75,
      frequency: "weekly",
    },
  },
  {
    id: "art-history",
    name: "Art History",
    color: "#be185d",
    description: "Historical development of visual arts",
    category: "arts",
    isCore: false,
    educationLevels: ["college"],
    localizedName: {
      en: "Art History",
      id: "Sejarah Seni",
    },
    tags: ["history", "visual", "culture", "movements"],
    defaultSchedule: {
      day: ["thursday"],
      duration: 75,
      frequency: "weekly",
    },
  },

  // Research & Methods
  {
    id: "research-methods",
    name: "Research Methods",
    color: "#374151",
    description: "Quantitative and qualitative research techniques",
    category: "social",
    isCore: false,
    educationLevels: ["college"],
    localizedName: {
      en: "Research Methods",
      id: "Metode Penelitian",
    },
    tags: ["research", "methods", "analysis", "statistics"],
    defaultSchedule: {
      day: ["friday"],
      duration: 75,
      frequency: "weekly",
    },
  },
  {
    id: "statistics",
    name: "Statistics",
    color: "#0f766e",
    description: "Statistical analysis and interpretation",
    category: "mathematics",
    isCore: false,
    educationLevels: ["college"],
    localizedName: {
      en: "Statistics",
      id: "Statistik",
    },
    tags: ["analysis", "probability", "inference", "data"],
    defaultSchedule: {
      day: ["tuesday", "thursday"],
      duration: 75,
      frequency: "weekly",
    },
  },
];

export async function getPack(): Promise<SubjectPack> {
  return {
    country: "global",
    year: 2025,
    educationLevel: "college",
    subjects,
    metadata: {
      version: "1.0.0",
      lastUpdated: "2025-01-09",
      curriculum: "Global College Standards",
      source: "International Higher Education Guidelines",
      contributors: ["TugasCollecter Team"],
    },
  };
}

import type { SubjectPack, SubjectTemplate } from "../../../shared/types";

const subjects: SubjectTemplate[] = [
  // Mata Pelajaran Wajib (Core Subjects)
  {
    id: "matematika",
    name: "Matematika",
    color: "#3b82f6",
    description:
      "Pembelajaran dasar matematika termasuk penjumlahan, pengurangan, perkalian, dan pembagian",
    category: "mathematics",
    isCore: true,
    educationLevels: ["sd"],
    localizedName: {
      en: "Mathematics",
      id: "Matematika",
    },
    tags: ["hitung", "operasi-dasar", "geometri", "pengukuran"],
    defaultSchedule: {
      day: ["monday", "tuesday", "wednesday", "thursday", "friday"],
      duration: 35,
      frequency: "daily",
    },
  },
  {
    id: "bahasa-indonesia",
    name: "Bahasa Indonesia",
    color: "#dc2626",
    description:
      "Pembelajaran membaca, menulis, dan berkomunikasi dalam bahasa Indonesia",
    category: "language",
    isCore: true,
    educationLevels: ["sd"],
    localizedName: {
      en: "Indonesian Language",
      id: "Bahasa Indonesia",
    },
    tags: ["membaca", "menulis", "tata-bahasa", "sastra"],
    defaultSchedule: {
      day: ["monday", "tuesday", "wednesday", "thursday", "friday"],
      duration: 35,
      frequency: "daily",
    },
  },
  {
    id: "ipa",
    name: "IPA (Ilmu Pengetahuan Alam)",
    color: "#059669",
    description: "Pengenalan sains dasar, alam, dan lingkungan sekitar",
    category: "science",
    isCore: true,
    educationLevels: ["sd"],
    localizedName: {
      en: "Natural Sciences",
      id: "Ilmu Pengetahuan Alam",
    },
    tags: ["alam", "lingkungan", "eksperimen", "observasi"],
    defaultSchedule: {
      day: ["tuesday", "thursday"],
      duration: 35,
      frequency: "weekly",
    },
  },
  {
    id: "ips",
    name: "IPS (Ilmu Pengetahuan Sosial)",
    color: "#f59e0b",
    description:
      "Pembelajaran tentang masyarakat, sejarah, dan geografi Indonesia",
    category: "social",
    isCore: true,
    educationLevels: ["sd"],
    localizedName: {
      en: "Social Sciences",
      id: "Ilmu Pengetahuan Sosial",
    },
    tags: ["sejarah", "geografi", "masyarakat", "budaya"],
    defaultSchedule: {
      day: ["monday", "wednesday"],
      duration: 35,
      frequency: "weekly",
    },
  },
  {
    id: "ppkn",
    name: "PPKn (Pendidikan Pancasila dan Kewarganegaraan)",
    color: "#7c2d12",
    description:
      "Pendidikan karakter, moral, dan kewarganegaraan berdasarkan Pancasila",
    category: "social",
    isCore: true,
    educationLevels: ["sd"],
    localizedName: {
      en: "Civic Education",
      id: "Pendidikan Pancasila dan Kewarganegaraan",
    },
    tags: ["pancasila", "karakter", "moral", "kewarganegaraan"],
    defaultSchedule: {
      day: ["friday"],
      duration: 35,
      frequency: "weekly",
    },
  },

  // Mata Pelajaran Tambahan
  {
    id: "bahasa-inggris",
    name: "Bahasa Inggris",
    color: "#10b981",
    description: "Pengenalan dasar bahasa Inggris untuk komunikasi sederhana",
    category: "language",
    isCore: false,
    educationLevels: ["sd"],
    localizedName: {
      en: "English",
      id: "Bahasa Inggris",
    },
    tags: ["vocabulary", "conversation", "grammar", "pronunciation"],
    defaultSchedule: {
      day: ["wednesday", "friday"],
      duration: 35,
      frequency: "weekly",
    },
  },
  {
    id: "pendidikan-agama",
    name: "Pendidikan Agama",
    color: "#6366f1",
    description: "Pendidikan agama sesuai keyakinan masing-masing siswa",
    category: "religious",
    isCore: true,
    educationLevels: ["sd"],
    localizedName: {
      en: "Religious Education",
      id: "Pendidikan Agama",
    },
    tags: ["agama", "moral", "spiritual", "akhlak"],
    defaultSchedule: {
      day: ["thursday"],
      duration: 35,
      frequency: "weekly",
    },
  },
  {
    id: "seni-budaya",
    name: "Seni Budaya",
    color: "#ec4899",
    description: "Seni musik, tari, rupa, dan budaya Indonesia",
    category: "arts",
    isCore: false,
    educationLevels: ["sd"],
    localizedName: {
      en: "Arts and Culture",
      id: "Seni Budaya",
    },
    tags: ["musik", "tari", "lukis", "budaya"],
    defaultSchedule: {
      day: ["friday"],
      duration: 35,
      frequency: "weekly",
    },
  },
  {
    id: "penjas",
    name: "PENJAS (Pendidikan Jasmani)",
    color: "#06b6d4",
    description: "Olahraga dan kesehatan jasmani",
    category: "physical",
    isCore: false,
    educationLevels: ["sd"],
    localizedName: {
      en: "Physical Education",
      id: "Pendidikan Jasmani",
    },
    tags: ["olahraga", "kesehatan", "gerak", "permainan"],
    defaultSchedule: {
      day: ["wednesday"],
      duration: 70,
      frequency: "weekly",
    },
  },
  {
    id: "bahasa-daerah",
    name: "Bahasa Daerah",
    color: "#84cc16",
    description: "Bahasa dan budaya daerah setempat",
    category: "language",
    isCore: false,
    educationLevels: ["sd"],
    localizedName: {
      en: "Local Language",
      id: "Bahasa Daerah",
    },
    tags: ["daerah", "budaya-lokal", "tradisi", "komunikasi"],
    defaultSchedule: {
      day: ["monday"],
      duration: 35,
      frequency: "weekly",
    },
  },
];

export async function getPack(): Promise<SubjectPack> {
  return {
    country: "indonesia",
    year: 2025,
    educationLevel: "sd",
    subjects,
    metadata: {
      version: "1.0.0",
      lastUpdated: "2025-01-09",
      curriculum: "Kurikulum 2013 - SD",
      source: "Kementerian Pendidikan dan Kebudayaan RI",
      contributors: ["TugasCollecter Team", "Tim Kurikulum Indonesia"],
    },
  };
}

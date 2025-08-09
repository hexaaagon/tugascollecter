import type { SubjectPack, SubjectTemplate } from "../../../shared/types";

const subjects: SubjectTemplate[] = [
  // Mata Pelajaran Wajib Kelompok A (Wajib)
  {
    id: "pendidikan-agama-akhlak-mulia",
    name: "Pendidikan Agama dan Budi Pekerti",
    color: "#6366f1",
    description: "Pendidikan agama dan pembentukan karakter mulia",
    category: "religious",
    isCore: true,
    educationLevels: ["smp"],
    localizedName: {
      en: "Religious and Character Education",
      id: "Pendidikan Agama dan Budi Pekerti",
    },
    tags: ["agama", "karakter", "akhlak", "spiritual"],
    defaultSchedule: {
      day: ["monday", "thursday"],
      duration: 40,
      frequency: "weekly",
    },
  },
  {
    id: "ppkn-smp",
    name: "PPKn (Pendidikan Pancasila dan Kewarganegaraan)",
    color: "#dc2626",
    description: "Pendidikan kewarganegaraan berdasarkan nilai-nilai Pancasila",
    category: "social",
    isCore: true,
    educationLevels: ["smp"],
    localizedName: {
      en: "Civic Education",
      id: "Pendidikan Pancasila dan Kewarganegaraan",
    },
    tags: ["pancasila", "kewarganegaraan", "hukum", "demokrasi"],
    defaultSchedule: {
      day: ["tuesday"],
      duration: 80,
      frequency: "weekly",
    },
  },
  {
    id: "bahasa-indonesia-smp",
    name: "Bahasa Indonesia",
    color: "#dc2626",
    description: "Pembelajaran bahasa dan sastra Indonesia tingkat menengah",
    category: "language",
    isCore: true,
    educationLevels: ["smp"],
    localizedName: {
      en: "Indonesian Language",
      id: "Bahasa Indonesia",
    },
    tags: ["sastra", "tata-bahasa", "menulis", "membaca"],
    defaultSchedule: {
      day: ["monday", "tuesday", "wednesday", "friday"],
      duration: 40,
      frequency: "weekly",
    },
  },
  {
    id: "matematika-smp",
    name: "Matematika",
    color: "#3b82f6",
    description: "Aljabar, geometri, dan statistika tingkat SMP",
    category: "mathematics",
    isCore: true,
    educationLevels: ["smp"],
    localizedName: {
      en: "Mathematics",
      id: "Matematika",
    },
    tags: ["aljabar", "geometri", "statistika", "trigonometri"],
    defaultSchedule: {
      day: ["monday", "tuesday", "thursday", "friday"],
      duration: 40,
      frequency: "weekly",
    },
  },
  {
    id: "sejarah-indonesia",
    name: "Sejarah Indonesia",
    color: "#92400e",
    description: "Sejarah perjuangan dan perkembangan bangsa Indonesia",
    category: "social",
    isCore: true,
    educationLevels: ["smp"],
    localizedName: {
      en: "Indonesian History",
      id: "Sejarah Indonesia",
    },
    tags: ["kemerdekaan", "perjuangan", "kerajaan", "kolonial"],
    defaultSchedule: {
      day: ["wednesday"],
      duration: 80,
      frequency: "weekly",
    },
  },
  {
    id: "bahasa-inggris-smp",
    name: "Bahasa Inggris",
    color: "#10b981",
    description: "Bahasa Inggris untuk komunikasi dasar dan menengah",
    category: "language",
    isCore: true,
    educationLevels: ["smp"],
    localizedName: {
      en: "English",
      id: "Bahasa Inggris",
    },
    tags: ["grammar", "conversation", "writing", "reading"],
    defaultSchedule: {
      day: ["monday", "wednesday", "friday"],
      duration: 40,
      frequency: "weekly",
    },
  },

  // Mata Pelajaran Wajib Kelompok B (IPA dan IPS)
  {
    id: "ipa-smp",
    name: "IPA (Ilmu Pengetahuan Alam)",
    color: "#059669",
    description: "Fisika, kimia, dan biologi terpadu",
    category: "science",
    isCore: true,
    educationLevels: ["smp"],
    localizedName: {
      en: "Natural Sciences",
      id: "Ilmu Pengetahuan Alam",
    },
    tags: ["fisika", "kimia", "biologi", "eksperimen"],
    defaultSchedule: {
      day: ["tuesday", "thursday", "friday"],
      duration: 40,
      frequency: "weekly",
    },
  },
  {
    id: "ips-smp",
    name: "IPS (Ilmu Pengetahuan Sosial)",
    color: "#f59e0b",
    description: "Geografi, ekonomi, sosiologi, dan sejarah terpadu",
    category: "social",
    isCore: true,
    educationLevels: ["smp"],
    localizedName: {
      en: "Social Sciences",
      id: "Ilmu Pengetahuan Sosial",
    },
    tags: ["geografi", "ekonomi", "sosiologi", "antropologi"],
    defaultSchedule: {
      day: ["monday", "thursday"],
      duration: 40,
      frequency: "weekly",
    },
  },

  // Mata Pelajaran Wajib Kelompok C (Seni dan Keterampilan)
  {
    id: "seni-budaya-smp",
    name: "Seni Budaya",
    color: "#ec4899",
    description: "Seni rupa, musik, tari, dan teater",
    category: "arts",
    isCore: false,
    educationLevels: ["smp"],
    localizedName: {
      en: "Arts and Culture",
      id: "Seni Budaya",
    },
    tags: ["seni-rupa", "musik", "tari", "teater"],
    defaultSchedule: {
      day: ["wednesday", "friday"],
      duration: 40,
      frequency: "weekly",
    },
  },
  {
    id: "penjas-smp",
    name: "PENJAS (Pendidikan Jasmani, Olahraga, dan Kesehatan)",
    color: "#06b6d4",
    description: "Olahraga, kesehatan jasmani, dan rohani",
    category: "physical",
    isCore: false,
    educationLevels: ["smp"],
    localizedName: {
      en: "Physical Education, Sports and Health",
      id: "Pendidikan Jasmani, Olahraga, dan Kesehatan",
    },
    tags: ["olahraga", "kesehatan", "atletik", "permainan"],
    defaultSchedule: {
      day: ["tuesday", "thursday"],
      duration: 40,
      frequency: "weekly",
    },
  },
  {
    id: "prakarya-kewirausahaan",
    name: "Prakarya dan Kewirausahaan",
    color: "#7c3aed",
    description: "Kerajinan, teknologi, budidaya, dan pengolahan",
    category: "technology",
    isCore: false,
    educationLevels: ["smp"],
    localizedName: {
      en: "Crafts and Entrepreneurship",
      id: "Prakarya dan Kewirausahaan",
    },
    tags: ["kerajinan", "teknologi", "budidaya", "wirausaha"],
    defaultSchedule: {
      day: ["friday"],
      duration: 80,
      frequency: "weekly",
    },
  },

  // Muatan Lokal
  {
    id: "bahasa-daerah-smp",
    name: "Bahasa Daerah",
    color: "#84cc16",
    description: "Bahasa dan budaya daerah setempat",
    category: "language",
    isCore: false,
    educationLevels: ["smp"],
    localizedName: {
      en: "Local Language",
      id: "Bahasa Daerah",
    },
    tags: ["bahasa-lokal", "budaya-daerah", "tradisi", "kearifan-lokal"],
    defaultSchedule: {
      day: ["wednesday"],
      duration: 40,
      frequency: "weekly",
    },
  },
];

export async function getPack(): Promise<SubjectPack> {
  return {
    country: "indonesia",
    year: 2025,
    educationLevel: "smp",
    subjects,
    metadata: {
      version: "1.0.0",
      lastUpdated: "2025-01-09",
      curriculum: "Kurikulum 2013 - SMP",
      source: "Kementerian Pendidikan dan Kebudayaan RI",
      contributors: ["TugasCollecter Team", "Tim Kurikulum Indonesia"],
    },
  };
}

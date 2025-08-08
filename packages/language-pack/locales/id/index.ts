import type { LanguageStrings } from "../../types";

export const indonesianStrings: LanguageStrings = {
  // App
  appName: "Tugas Collecter",

  // General
  cancel: "Batal",
  save: "Simpan",
  edit: "Edit",
  delete: "Hapus",
  search: "Cari",
  loading: "Memuat",
  error: "Error",
  success: "Sukses",

  // Navigation
  home: "Home",
  tasks: "Tugas",
  calendar: "Kalender",
  statistics: "Statistik",
  settings: "Peraturan",

  // Home Screen
  greeting: {
    morning: "Selamat Pagi",
    afternoon: "Selamat Siang",
    evening: "Selamat Malam",
  },
  todaysHomework: "Tugas kamu hari ini",
  upcomingTasks: "Tugas Mendatang",
  completionRate: "Rasio Penyelesaian Tugas",
  addFirstTask: "Tambahkan Tugas Pertama kamu",
  searchHomework: "Cari tugas kamu",
  totalTasks: "Semua Tugas",
  urgentTasks: "Tugas Penting",
  overallProgress: "Proses Keseluruhan",
  viewAll: "Lihat Semua",

  // Dynamic strings with placeholders
  youHaveTasksRemaining: `Kamu punya {{count}} tugas yang belum selesai. ${["Semangat!", "Ayo selesaikan!", "Jangan lupa istirahat!"][Math.floor(Math.random() * 3)]}`,
  readyToStartOrganizing: "Ayo mulai atur tugas kamu!",
  dueTodayText: "Deadline hari ini",
  dueTomorrowText: "Deadline besok",
  daysLeftText: "{{days}} hari lagi",
  noDueDateText: "Tidak ada deadline",
  loadingText: "Sedang Memuat...",
  dueLabel: "Deadline:",

  // Tasks Screen
  newHomework: "Buat Tugas",
  editHomework: "Edit Tugas",
  homeworkTitle: "Judul",
  homeworkDescription: "Deskripsi",
  subject: "Mata Pelajaran",
  dueDate: "Tanggal Deadline",
  priority: "Prioritas",
  selectDueDate: "Pilih tanggal deadline kamu",
  enterTitle: "Tuliskan judul tugas kamu",
  enterDescription: "Tuliskan deskripsi tugas kamu (Opsional)",
  selectSubject: "Pilih mata pelajaran kamu",

  // Priority levels
  priorityLevels: {
    low: "Rendah",
    medium: "Sedang",
    high: "Tinggi",
  },

  // Status levels
  statusLevels: {
    pending: "Belum Dikerjakan",
    inProgress: "Sedang Dikerjakan",
    completed: "Selesai",
    overdue: "Lewat Deadline",
  },

  // Settings Screen
  account: "Akun",
  signIn: "Sign In",
  signInDescription:
    "Sign in agar data kamu tersinkronisasi di semua perangkat",
  cloudSync: "Cloud Sync",
  cloudSyncDescription: "Sinkronisasi tugas dan preferensi kamu",
  homeworkManagement: "Manajemen Tugas",
  manageSubjects: "Kelola Mata Pelajaran",
  manageSubjectsDescription: "Tambahkan, edit, atau hapus mata pelajaran",
  clearAllData: "Hapus Semua Data",
  clearAllDataDescription:
    "Hapus semua tugas dan mata pelajaran secara permanen",
  preferences: "Preferensi",
  notifications: "Notifikasi",
  notificationsDescription: "Dapatkan pengingat dan update tugas",
  theme: "Tema",
  autoSync: "Auto Sinkronisasi",
  autoSyncDescription: "Sinkronisasi otomatis saat terhubung ke WiFi",
  soundEffects: "Efek Suara",
  soundEffectsDescription: "Mainkan suara saat berinteraksi",
  hapticFeedback: "Haptic Feedback",
  hapticFeedbackDescription: "Rasakan getaran saat berinteraksi",
  support: "Support",
  privacyPolicy: "Privacy Policy",
  privacyPolicyDescription: "Pelajari bagaimana kami melindungi data kamu",
  appInfo: "Informasi Aplikasi",
  about: "Tentang",
  aboutDescription: "Version 1.0.0",
  helpAndSupport: "Help & Support",
  helpAndSupportDescription: "Cari bantuan dan dukungan untuk aplikasi",
  rateApp: "Rate App",
  rateAppDescription: "Bantu kami dengan memberikan rating di app store",
  sendFeedback: "Kirim Feedback",
  sendFeedbackDescription: "Bagikan pendapat dan saran kamu",
  termsOfService: "Terms of Service",
  termsOfServiceDescription: "Syarat dan Ketentuan kami",

  // Language
  language: "Bahasa",
  languageDescription: "Ganti bahasa aplikasi",

  // Drawer
  turnOnCloudChanges: "Aktifkan Perubahan Cloud",
  syncTasksAcrossDevices: "Sinkronisasi tugas di semua perangkat",
  cloudSyncEnabled: "Sinkronisasi cloud diaktifkan",

  // Theme options
  themeOptions: {
    system: "sistem",
    light: "terang",
    dark: "gelap",
    followSystem: "Ikuti tema sistem",
    darkTheme: "Tema Gelap",
    lightTheme: "Tema Terang",
  },

  // Subject Manager
  subjects: "Mata Pelajaran",
  addSubject: "Tambahkan Mata Pelajaran",
  editSubject: "Edit Mata Pelajaran",
  subjectName: "Nama Mata Pelajaran",
  subjectColor: "Warna Mata Pelajaran",
  enterSubjectName: "Masukkan nama mata pelajaran",
  selected: "Dipilih",

  // Homework Detail
  attachments: "Lampiran Foto/Dokumen",
  notes: "Catatan",
  createdOn: "Dibuat pada",
  lastModified: "Terakhir Diubah",
  markAsCompleted: "Tandai sebagai Selesai",
  markAsInProgress: "Tandai sebagai Sedang Dikerjakan",

  // Alerts and Messages
  alerts: {
    clearAllData: {
      title: "Hapus Semua Data",
      message:
        "Ini akan menghapus semua tugas dan mata pelajaran kamu secara permanen. Tindakan ini tidak dapat dibatalkan.",
      confirm: "Hapus Semua Data",
    },
    importData: {
      title: "Import Data",
      message: "Pilih file cadangan untuk mengimpor data kamu",
      selectFile: "Pilih File yang kamu mau",
    },
    rateApp: {
      title: "Rate App",
      message:
        "Apakah kamu ingin memberikan rating untuk Tugas Collecter di Google Play Store?",
      notNow: "Tidak untuk Sekarang",
      rate: "Rate App",
    },
    aboutApp: {
      title: "About Tugas Collecter",
    },
  },

  // Toast Messages
  toasts: {
    featureComingSoon: {
      title: "Fitur akan segera hadir",
      description: "Import data akan tersedia di pembaruan mendatang",
    },
    thankYou: {
      title: "Terima Kasih!",
      description: "Feedback kamu membantu kami meningkatkan aplikasi",
    },
    privacyPolicy: {
      title: "Privacy Policy",
      description: "Membuka halaman privacy policy...",
    },
    feedback: {
      title: "Feedback",
      description: "Membuka formulir feedback...",
    },
    termsOfService: {
      title: "Terms of Service",
      description: "Membuka halaman terms of service...",
    },
  },
};

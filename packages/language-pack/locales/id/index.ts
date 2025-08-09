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
  addFirstTask: "Tambahkan Tugas Pertama kamu",
  searchHomework: "Cari tugas kamu",
  totalTasks: "Semua Tugas",
  urgentTasks: "Tugas Penting",
  viewAll: "Lihat Semua",

  // Dynamic strings with placeholders
  youHaveTasksRemaining: "Kamu punya {{count}} tugas yang belum selesai",
  readyToStartOrganizing: "Ayo mulai atur tugas kamu!",
  dueTodayText: "Deadline hari ini",
  dueTomorrowText: "Deadline besok",
  daysLeftText: "{{days}} hari lagi",
  daysAfterDueText: "{{days}} hari yang lalu",
  noDueDateText: "Tidak ada deadline",
  loadingText: "Sedang Memuat...",
  dueLabel: "Deadline:",

  // Task Detail Dialog
  taskDetails: "Detail Tugas",
  description: "Deskripsi",
  tags: "Tags",
  quickActions: "Quick Actions",
  startTask: "Kerjakan Tugas",
  markCompleted: "Tandai Selesai",
  markPending: "Tandai Belum Dikerjakan",
  attachments: "Lampiran Foto/Dokumen",
  loadingAttachments: "Memuat lampiran...",
  priority: "Prioritas",
  priorityWithLevel: "Prioritas {{level}}",

  // Tasks Screen - Additional strings
  tasksCount: "{{count}} dari {{total}} PR",
  filterByStatus: "Filter berdasarkan Status",
  sortBy: "Urutkan Berdasarkan",
  noTasksFound: "Tidak ada PR ditemukan",
  createYourFirstTask: "Buat PR Pertama kamu",
  addTask: "Tambahkan Tugas",
  loadingTasks: "Sedang memuat PR Kamu...",
  completedTasks: "{{count}} Tugas Selesai",
  fetchingHomeworkAssignments: "Mengambil informasi tugas PR kamu",
  loadingHomeworkData: "Sedang memuat informasi PR kamu...",
  loadingSubjects: "Sedang memuat informasi Pelajaran kamu...",
  organizingTasks: "Mengelompokkan Tugas kamu...",
  performanceTip:
    "Tugas dengan Lampiran Foto/Dokumen akan memuat lebih lama agar performa aplikasi tetap optimal.",

  // Common Actions
  startWorking: "Mulai Kerjakan",
  viewDetails: "Lihat Detail",

  // Sort Options
  sortOptions: {
    dueDate: "Deadline",
    priority: "Prioritas",
    subject: "Mata Pelajaran",
    status: "Status",
  },

  // Filter Options
  filterOptions: {
    all: "All",
    pending: "Belum Dikerjakan",
    inProgress: "Sedang Dikerjakan",
    completed: "Selesai",
    overdue: "Lewat Deadline",
  },

  // Homework Form
  newHomework: "Buat Tugas",
  editHomework: "Edit Tugas",
  homeworkTitle: "Judul",
  homeworkDescription: "Deskripsi",
  subject: "Mata Pelajaran",
  dueDate: "Tanggal Deadline",
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
  notes: "Catatan",
  createdOn: "Dibuat pada",
  lastModified: "Terakhir Diubah",
  markAsCompleted: "Tandai sebagai Sudah Selesai",
  markAsInProgress: "Tandai sebagai Sedang Dikerjakan",

  // Alert Messages
  alerts: {
    deleteTask: {
      title: "Hapus Tugas",
      message: "Apakah kamu yakin ingin menghapus tugas ini?",
      confirm: "Hapus",
    },
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

  // Statistics Screen
  loadingStatistics: "Sedang Memuat Kemampuan kamu...",
  yourHomeworkPerformanceOverview: "Ringkasan Kemampuan PR kamu",
  successRate: "Tingkat Keberhasilan",
  active: "aktif",
  overallProgress: "Progress Keseluruhan",
  completionRate: "Tingkat Penyelesaian",
  completed: "Selesai",
  inProgress: "Sedang Dikerjakan",
  pending: "Pending",
  overdue: "Lewat Deadline",
  priorityDistribution: "Distribusi Prioritas",
  highPriority: "Prioritas Tinggi",
  mediumPriority: "Prioritas Sedang",
  lowPriority: "Prioritas Rendah",
  subjectPerformance: "Kinerja Mata Pelajaran",
  weeklyActivity: "Aktivitas Mingguan",
  completeSomeHomework:
    "Kerjakan beberapa PR untuk melihat aktivitas mingguan kamu",
  yourWeeklyActivityPattern: "Pola Aktivitas Mingguan kamu",
  recentAchievements: "Pencapaian Terbaru",

  // Calendar Screen
  assignmentSchedulingAndSync: "Penjadwalan & Sinkronisasi Tugas",
  comingSoon: "Dalam Tahap Pengembangan",
  calendarSyncDescription:
    "Sinkronisasi Kalender akan tersedia di pembaruan mendatang",
  calendarSync: "Sinkronisasi Kalender",
  automaticallySyncHomeworkDeadlines:
    "Sinkronisasi deadline tugas secara otomatis",
  smartReminders: "Pengingat Cerdas",
  getNotifiedBeforeDueDates: "Dapatkan notifikasi sebelum deadline",
  timeBlocking: "Time Blocking",
  scheduleDedicatedStudyTime: "Jadwalkan waktu belajar khusus",
  availableNow: "Fitur yang Tersedia Sekarang",
  whileWePreparCalendarIntegration:
    "Sambil kami mempersiapkan integrasi kalender, kamu bisa:",
  viewUpcomingDeadlinesInTasks: "Lihat deadline mendatang di halaman Tugas",
  trackProgressInStatistics: "Lacak progress di halaman Statistik",
  organizeAssignmentsByPriority: "Atur tugas berdasarkan prioritas",
};

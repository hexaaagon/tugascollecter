import type { LanguageStrings } from "../../types";

export const englishStrings: LanguageStrings = {
  // App
  appName: "Tugas Collecter",

  // General
  cancel: "Cancel",
  save: "Save",
  edit: "Edit",
  delete: "Delete",
  search: "Search",
  loading: "Loading",
  error: "Error",
  success: "Success",

  // Navigation
  home: "Home",
  tasks: "Tasks",
  calendar: "Calendar",
  statistics: "Statistics",
  settings: "Settings",

  // Home Screen
  greeting: {
    morning: "Good Morning",
    afternoon: "Good Afternoon",
    evening: "Good Evening",
  },
  todaysHomework: "Today's Homework",
  upcomingTasks: "Upcoming Tasks",
  completionRate: "Completion Rate",
  addFirstTask: "Add Your First Task",
  searchHomework: "Search your homework",
  totalTasks: "Total Tasks",
  urgentTasks: "Urgent Tasks",
  overallProgress: "Overall Progress",
  viewAll: "View All",

  // Dynamic strings with placeholders
  youHaveTasksRemaining: "You have {{count}} tasks remaining",
  readyToStartOrganizing: "Ready to start organizing your homework!",
  dueTodayText: "Due today",
  dueTomorrowText: "Due tomorrow",
  daysLeftText: "{{days}} days left",
  noDueDateText: "No due date",
  loadingText: "Loading...",
  dueLabel: "Due:",

  // Tasks Screen
  newHomework: "New Homework",
  editHomework: "Edit Homework",
  homeworkTitle: "Title",
  homeworkDescription: "Description",
  subject: "Subject",
  dueDate: "Due Date",
  priority: "Priority",
  selectDueDate: "Select due date",
  enterTitle: "Enter homework title",
  enterDescription: "Enter homework description (optional)",
  selectSubject: "Select subject",

  // Priority levels
  priorityLevels: {
    low: "Low",
    medium: "Medium",
    high: "High",
  },

  // Status levels
  statusLevels: {
    pending: "Pending",
    inProgress: "In Progress",
    completed: "Completed",
    overdue: "Overdue",
  },

  // Settings Screen
  account: "Account",
  signIn: "Sign In",
  signInDescription: "Sign in to sync your data across devices",
  cloudSync: "Cloud Sync",
  cloudSyncDescription: "Sync your tasks and preferences",
  homeworkManagement: "Homework Management",
  manageSubjects: "Manage Subjects",
  manageSubjectsDescription: "Add, edit, or remove subjects",
  clearAllData: "Clear All Data",
  clearAllDataDescription: "Permanently delete all homework and subjects",
  preferences: "Preferences",
  notifications: "Notifications",
  notificationsDescription: "Receive task reminders and updates",
  theme: "Theme",
  autoSync: "Auto Sync",
  autoSyncDescription: "Automatically sync when connected to WiFi",
  soundEffects: "Sound Effects",
  soundEffectsDescription: "Play sounds for interactions",
  hapticFeedback: "Haptic Feedback",
  hapticFeedbackDescription: "Feel vibrations for touch interactions",
  support: "Support",
  privacyPolicy: "Privacy Policy",
  privacyPolicyDescription: "Learn how we protect your data",
  appInfo: "App Info",
  about: "About",
  aboutDescription: "Version 1.0.0",
  helpAndSupport: "Help & Support",
  helpAndSupportDescription: "Get help and support for the app",
  rateApp: "Rate App",
  rateAppDescription: "Help us improve by rating the app",
  sendFeedback: "Send Feedback",
  sendFeedbackDescription: "Share your thoughts and suggestions",
  termsOfService: "Terms of Service",
  termsOfServiceDescription: "Review our terms and conditions",

  // Language
  language: "Language",
  languageDescription: "Change the app language",

  // Drawer
  turnOnCloudChanges: "Turn on Cloud Changes",
  syncTasksAcrossDevices: "Sync tasks across devices",
  cloudSyncEnabled: "Cloud sync enabled",

  // Theme options
  themeOptions: {
    system: "system",
    light: "light",
    dark: "dark",
    followSystem: "Follow system",
    darkTheme: "Dark theme",
    lightTheme: "Light theme",
  },

  // Subject Manager
  subjects: "Subjects",
  addSubject: "Add Subject",
  editSubject: "Edit Subject",
  subjectName: "Subject Name",
  subjectColor: "Subject Color",
  enterSubjectName: "Enter subject name",
  selected: "Selected",

  // Homework Detail
  attachments: "Attachments",
  notes: "Notes",
  createdOn: "Created on",
  lastModified: "Last modified",
  markAsCompleted: "Mark as Completed",
  markAsInProgress: "Mark as In Progress",

  // Alerts and Messages
  alerts: {
    clearAllData: {
      title: "Clear All Data",
      message:
        "This will permanently delete all your homework and subjects. This action cannot be undone.",
      confirm: "Clear All Data",
    },
    importData: {
      title: "Import Data",
      message: "Select a backup file to import your data",
      selectFile: "Select File",
    },
    rateApp: {
      title: "Rate App",
      message: "Would you like to rate Tugas Collecter on the app store?",
      notNow: "Not Now",
      rate: "Rate App",
    },
    aboutApp: {
      title: "About Tugas Collecter",
    },
  },

  // Toast Messages
  toasts: {
    featureComingSoon: {
      title: "Feature Coming Soon",
      description: "Data import will be available in a future update",
    },
    thankYou: {
      title: "Thank You!",
      description: "Your feedback helps us improve the app",
    },
    privacyPolicy: {
      title: "Privacy Policy",
      description: "Opening privacy policy...",
    },
    feedback: {
      title: "Feedback",
      description: "Opening feedback form...",
    },
    termsOfService: {
      title: "Terms of Service",
      description: "Opening terms of service...",
    },
  },
};

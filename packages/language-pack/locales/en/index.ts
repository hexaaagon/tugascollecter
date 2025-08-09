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
  addFirstTask: "Add Your First Task",
  searchHomework: "Search your homework",
  totalTasks: "Total Tasks",
  urgentTasks: "Urgent Tasks",
  viewAll: "View All",

  // Dynamic strings with placeholders
  youHaveTasksRemaining: "You have {{count}} tasks remaining",
  readyToStartOrganizing: "Ready to start organizing your homework!",
  dueTodayText: "Due today",
  dueTomorrowText: "Due tomorrow",
  daysLeftText: "{{days}} days left",
  daysAfterDueText: "{{days}} days ago",
  noDueDateText: "No due date",
  loadingText: "Loading...",
  dueLabel: "Due:",

  // Task Detail Dialog
  taskDetails: "Task Details",
  description: "Description",
  tags: "Tags",
  quickActions: "Quick Actions",
  startTask: "Start Task",
  markCompleted: "Mark Completed",
  markPending: "Mark Pending",
  attachments: "Attachments",
  loadingAttachments: "Loading attachments...",
  priority: "Priority",
  priorityWithLevel: "{{level}} Priority",

  // Tasks Screen - Additional strings
  tasksCount: "{{count}} of {{total}} tasks",
  filterByStatus: "Filter by Status",
  sortBy: "Sort by",
  noTasksFound: "No tasks found",
  createYourFirstTask: "Create your first task",
  addTask: "Add Task",
  loadingTasks: "Loading tasks...",
  completedTasks: "{{count}} Completed Tasks",
  fetchingHomeworkAssignments: "Fetching homework assignments",
  loadingHomeworkData: "Loading homework data...",
  loadingSubjects: "Loading subjects...",
  organizingTasks: "Organizing tasks...",
  performanceTip: "Performance tip",

  // Common Actions
  startWorking: "Start Working",
  viewDetails: "View Details",

  // Sort Options
  sortOptions: {
    dueDate: "Due Date",
    priority: "Priority",
    subject: "Subject",
    status: "Status",
  },

  // Filter Options
  filterOptions: {
    all: "All",
    pending: "Pending",
    inProgress: "In Progress",
    completed: "Completed",
    overdue: "Overdue",
  },

  // Homework Form
  newHomework: "New Homework",
  editHomework: "Edit Homework",
  homeworkTitle: "Title",
  homeworkDescription: "Description",
  subject: "Subject",
  dueDate: "Due Date",
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
  notes: "Notes",
  createdOn: "Created on",
  lastModified: "Last modified",
  markAsCompleted: "Mark as Completed",
  markAsInProgress: "Mark as In Progress",

  // Alert Messages
  alerts: {
    deleteTask: {
      title: "Delete Task",
      message: "Are you sure you want to delete this task?",
      confirm: "Delete",
    },
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

  // Statistics Screen
  loadingStatistics: "Loading statistics...",
  yourHomeworkPerformanceOverview: "Your homework performance overview",
  successRate: "Success Rate",
  active: "active",
  overallProgress: "Overall Progress",
  completionRate: "Completion Rate",
  completed: "Completed",
  inProgress: "In Progress",
  pending: "Pending",
  overdue: "Overdue",
  priorityDistribution: "Priority Distribution",
  highPriority: "High Priority",
  mediumPriority: "Medium Priority",
  lowPriority: "Low Priority",
  subjectPerformance: "Subject Performance",
  weeklyActivity: "Weekly Activity",
  completeSomeHomework: "Complete some homework to see your weekly activity",
  yourWeeklyActivityPattern: "Your weekly activity pattern",
  recentAchievements: "Recent Achievements",

  // Calendar Screen
  assignmentSchedulingAndSync: "Assignment Scheduling & Sync",
  comingSoon: "Coming Soon",
  calendarSyncDescription: "Calendar sync will be available in a future update",
  calendarSync: "Calendar Sync",
  automaticallySyncHomeworkDeadlines: "Automatically sync homework deadlines",
  smartReminders: "Smart Reminders",
  getNotifiedBeforeDueDates: "Get notified before due dates",
  timeBlocking: "Time Blocking",
  scheduleDedicatedStudyTime: "Schedule dedicated study time",
  availableNow: "Available Now",
  whileWePreparCalendarIntegration: "While we prepare calendar integration:",
  viewUpcomingDeadlinesInTasks: "View upcoming deadlines in Tasks",
  trackProgressInStatistics: "Track progress in Statistics",
  organizeAssignmentsByPriority: "Organize assignments by priority",
};

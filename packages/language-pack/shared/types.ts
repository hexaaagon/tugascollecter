export type Language = "en" | "id";

export interface LanguageStrings {
  // App
  appName: string;

  // General
  cancel: string;
  save: string;
  edit: string;
  delete: string;
  search: string;
  loading: string;
  error: string;
  success: string;
  close: string;

  // Error messages
  pleaseEnterSubjectName: string;
  subjectNameAlreadyExists: string;
  failedToAddSubject: string;
  failedToDeleteSubject: string;
  failedToUpdateSubject: string;
  failedToLoadSubjectTemplates: string;
  failedToImportSubjects: string;
  deleteSubject: string;
  deleteSubjectConfirmation: string;
  noSubjects: string;
  addFirstSubject: string;
  noSubjectsAvailableForCombination: string;

  // UI elements
  chooseColor: string;
  selectedColor: string;
  select: string;
  done: string;
  saving: string;

  // Additional Subject Manager keys
  addCustomSubject: string;
  color: string;
  adding: string;
  existingSubjects: string;
  country: string;
  educationLevel: string;
  availableSubjects: string;
  importingEllipsis: string;
  importAllCountSubjects: string; // "Import All {count} Subjects"

  // Navigation
  home: string;
  tasks: string;
  calendar: string;
  statistics: string;
  settings: string;

  // Home Screen
  greeting: {
    morning: string;
    afternoon: string;
    evening: string;
  };
  todaysHomework: string;
  upcomingTasks: string;
  addFirstTask: string;
  searchHomework: string;
  totalTasks: string;
  urgentTasks: string;
  viewAll: string;

  // Dynamic strings with placeholders
  youHaveTasksRemaining: string; // "You have {{count}} tasks remaining"
  readyToStartOrganizing: string;
  dueToday: string; // "Due today"
  dueTomorrow: string; // "Due tomorrow"
  daysLeft: string; // "{{days}} days left"
  daysAfterDue: string; // "{{days}} days ago"
  noDueDate: string; // "No due date"
  dottedLoading: string;
  dueLabel: string; // "Due:"

  // Task Detail Dialog
  taskDetails: string;
  description: string;
  tags: string;
  quickActions: string;
  startTask: string;
  markCompleted: string;
  markPending: string;
  attachments: string;
  loadingAttachments: string;
  priority: string;
  priorityWithLevel: string; // "{{level}} Priority"

  // Tasks Screen - Additional strings
  tasksCount: string; // "{{count}} of {{total}} tasks"
  filterByStatus: string;
  sortBy: string;
  noTasksFound: string;
  createYourFirstTask: string;
  addTask: string;
  loadingTasks: string;
  completedTasks: string;
  fetchingHomeworkAssignments: string;
  loadingHomeworkData: string;
  loadingSubjects: string;
  organizingTasks: string;
  performanceTip: string;

  // Search functionality
  searchTasks: string;
  tasksFound: string; // "{{count}} tasks found"
  searchPlaceholder: string;
  tryAdjustingSearchTerms: string;

  // Common Actions
  startWorking: string;
  viewDetails: string;

  // Sort Options
  sortOptions: {
    dueDate: string;
    priority: string;
    subject: string;
    status: string;
  };

  // Filter Options
  filterOptions: {
    all: string;
    pending: string;
    inProgress: string;
    completed: string;
    overdue: string;
  };

  // Settings Screen
  account: string;
  signIn: string;
  signInDescription: string;
  cloudSync: string;
  cloudSyncDescription: string;
  homeworkManagement: string;
  manageSubjects: string;
  manageSubjectsDescription: string;
  clearAllData: string;
  clearAllDataDescription: string;
  preferences: string;
  notifications: string;
  notificationsDescription: string;
  theme: string;
  autoSync: string;
  autoSyncDescription: string;
  soundEffects: string;
  soundEffectsDescription: string;
  hapticFeedback: string;
  hapticFeedbackDescription: string;
  support: string;
  privacyPolicy: string;
  privacyPolicyDescription: string;
  appInfo: string;
  about: string;
  aboutDescription: string;
  helpAndSupport: string;
  helpAndSupportDescription: string;
  rateApp: string;
  rateAppDescription: string;
  sendFeedback: string;
  sendFeedbackDescription: string;
  termsOfService: string;
  termsOfServiceDescription: string;

  // Language
  language: string;
  languageDescription: string;

  // Drawer
  turnOnCloudChanges: string;
  syncTasksAcrossDevices: string;
  cloudSyncEnabled: string;

  // Theme options
  themeOptions: {
    system: string;
    light: string;
    dark: string;
    followSystem: string;
    darkTheme: string;
    lightTheme: string;
  };

  // Subject Manager
  subjects: string;
  addSubject: string;
  editSubject: string;
  subjectName: string;
  enterSubjectName: string;
  subjectColor: string;
  selected: string;

  // Homework Form
  editHomework: string;
  newHomework: string;
  homeworkTitle: string;
  enterTitle: string;
  homeworkDescription: string;
  enterDescription: string;
  subject: string;
  dueDate: string;
  selectDueDate: string;
  noSubjectsAvailableCreateFirst: string;
  pleaseEnterTitle: string;
  pleaseCreateSubjectFirst: string;
  failedToSaveHomework: string;
  priorityLevels: {
    low: string;
    medium: string;
    high: string;
  };
  // Status levels
  statusLevels: {
    pending: string;
    inProgress: string;
    completed: string;
    overdue: string;
  };
  notes: string;
  createdOn: string;
  lastModified: string;
  markAsCompleted: string;
  markAsInProgress: string;

  // Alert Messages
  alerts: {
    deleteTask: {
      title: string;
      message: string;
      confirm: string;
    };
    clearAllData: {
      title: string;
      message: string;
      confirm: string;
    };
    importData: {
      title: string;
      message: string;
      selectFile: string;
    };
    rateApp: {
      title: string;
      message: string;
      notNow: string;
      rate: string;
    };
    aboutApp: {
      title: string;
    };
  };

  // Toast Messages
  toasts: {
    featureComingSoon: {
      title: string;
      description: string;
    };
    thankYou: {
      title: string;
      description: string;
    };
    privacyPolicy: {
      title: string;
      description: string;
    };
    feedback: {
      title: string;
      description: string;
    };
    termsOfService: {
      title: string;
      description: string;
    };
  };

  // Notification Messages
  notificationMessages: {
    homeworkReminder: string;
    dueInTime: string; // "{{title}}" is due in {{time}}
    dueTodayTitle: string;
    dueTodayMessage: string; // "{{title}}" is due today! Don't forget
  };

  // Notification Permission Dialog
  notificationPermission: {
    title: string;
    description: string;
    allowButton: string;
    laterButton: string;
  };

  // Statistics Screen
  loadingStatistics: string;
  yourHomeworkPerformanceOverview: string;
  successRate: string;
  active: string;
  overallProgress: string;
  completionRate: string;
  completed: string;
  inProgress: string;
  pending: string;
  overdue: string;
  priorityDistribution: string;
  highPriority: string;
  mediumPriority: string;
  lowPriority: string;
  subjectPerformance: string;
  weeklyActivity: string;
  completeSomeHomework: string;
  yourWeeklyActivityPattern: string;
  recentAchievements: string;

  // Calendar Screen
  assignmentSchedulingAndSync: string;
  comingSoon: string;
  calendarSyncDescription: string;
  calendarSync: string;
  automaticallySyncHomeworkDeadlines: string;
  smartReminders: string;
  getNotifiedBeforeDueDates: string;
  timeBlocking: string;
  scheduleDedicatedStudyTime: string;
  availableNow: string;
  whileWePreparCalendarIntegration: string;
  viewUpcomingDeadlinesInTasks: string;
  trackProgressInStatistics: string;
  organizeAssignmentsByPriority: string;

  // Subject Manager & Import (additional keys for import functionality)
  importSubjectTemplates: string;
  importSubjectTemplatesDescription: string;
  selectCountry: string;
  selectEducationLevel: string;
  importAll: string;
  importAllSubjects: string; // "Import All {{count}} Subjects"
  importing: string;
  importSuccessful: string;
  importSuccessfulMessage: string; // "Successfully imported {{count}} subjects"
  duplicateSubjects: string;
  duplicateSubjectsMessage: string; // "The following subjects already exist: {{names}}. Do you want to skip duplicates and import the rest?"
  importOthers: string;
  noSubjectsAvailable: string;
  noSubjectsAvailableMessage: string;
  noSubjectTemplatesFound: string;
  loadingAvailableSubjects: string;
  educationLevelsAvailable: string; // "{{count}} education levels available"
  agesAndDuration: string; // "Ages {{minAge}}-{{maxAge}} • {{duration}} years"
  previewSubjects: string; // "Preview: {{count}} Subjects Available"
  previewSubjectsAvailable: string; // "Preview: {{count}} Subjects Available"
}

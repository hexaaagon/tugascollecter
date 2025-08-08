export type Language = "en" | "id";

export interface LanguageStrings {
  // General
  cancel: string;
  save: string;
  edit: string;
  delete: string;
  search: string;
  loading: string;
  error: string;
  success: string;

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
  completionRate: string;
  addFirstTask: string;
  searchHomework: string;
  totalTasks: string;
  urgentTasks: string;
  overallProgress: string;
  viewAll: string;

  // Tasks Screen
  newHomework: string;
  editHomework: string;
  homeworkTitle: string;
  homeworkDescription: string;
  subject: string;
  dueDate: string;
  priority: string;
  selectDueDate: string;
  enterTitle: string;
  enterDescription: string;
  selectSubject: string;

  // Priority levels
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
  rateApp: string;
  rateAppDescription: string;
  sendFeedback: string;
  sendFeedbackDescription: string;
  termsOfService: string;
  termsOfServiceDescription: string;

  // Language
  language: string;
  languageDescription: string;

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
  subjectColor: string;
  enterSubjectName: string;
  selected: string;

  // Homework Detail
  attachments: string;
  notes: string;
  createdOn: string;
  lastModified: string;
  markAsCompleted: string;
  markAsInProgress: string;

  // Alerts and Messages
  alerts: {
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
}

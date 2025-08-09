export * from "../../shared/types/storage";

export { UserDataStorage } from "./userdata";
export { ExternalStorage } from "./external";
export { CacheStorage } from "./cache";

// Legacy exports for backward compatibility
export { UserDataStorage as storage } from "./userdata";

import { UserDataStorage } from "./userdata";
import { ExternalStorage } from "./external";
import { CacheStorage } from "./cache";
import {
  UserPreferences,
  ThemeType,
  HomeworkData,
  SubjectData,
  AttachmentData,
  ExportData,
  DEFAULT_PREFERENCES,
} from "../../shared/types/storage";

// Import notification service
let notificationService: any = null;

// Dynamic import to avoid circular dependencies
const getNotificationService = async () => {
  if (!notificationService) {
    const { notificationService: ns } = await import("../notifications");
    notificationService = ns;
  }
  return notificationService;
};

export class StorageManager {
  static async initialize(): Promise<void> {
    try {
      await Promise.all([
        ExternalStorage.initializeDirectories(),
        CacheStorage.cleanupExpiredItems(),
      ]);

      // Initialize notification service
      const ns = await getNotificationService();
      await ns.initialize();
    } catch (error) {
      console.error("Error initializing storage systems:", error);
    }
  }

  static async getPreferences(): Promise<UserPreferences> {
    return await UserDataStorage.getPreferences();
  }

  static async setPreferences(preferences: UserPreferences): Promise<void> {
    await UserDataStorage.setPreferences(preferences);

    // Reschedule notifications if preference changed
    try {
      const ns = await getNotificationService();
      await ns.rescheduleAllHomeworkNotifications();
    } catch (error) {
      console.error(
        "Error updating notifications after preference change:",
        error,
      );
    }
  }

  static async getTheme(): Promise<ThemeType> {
    return await UserDataStorage.getThemePreference();
  }

  static async setTheme(theme: ThemeType): Promise<void> {
    await UserDataStorage.setThemePreference(theme);
  }

  static async getHomework(): Promise<HomeworkData[]> {
    return await UserDataStorage.getHomework();
  }

  static async saveHomework(homework: HomeworkData[]): Promise<void> {
    await UserDataStorage.setHomework(homework);

    // Reschedule all notifications
    try {
      const ns = await getNotificationService();
      await ns.rescheduleAllHomeworkNotifications();
    } catch (error) {
      console.error("Error updating notifications after homework save:", error);
    }
  }

  static async addHomework(homework: HomeworkData): Promise<void> {
    await UserDataStorage.addHomework(homework);

    // Schedule notifications for this homework if notifications are enabled and homework is pending
    try {
      const preferences = await this.getPreferences();
      if (preferences.notifications && homework.status === "pending") {
        const ns = await getNotificationService();
        await ns.scheduleHomeworkReminders(homework);
      }
    } catch (error) {
      console.error("Error scheduling notifications for new homework:", error);
    }
  }

  static async updateHomework(
    id: string,
    updates: Partial<HomeworkData>,
  ): Promise<void> {
    // Get current homework data before update
    const allHomework = await UserDataStorage.getHomework();
    const currentHomework = allHomework.find((hw) => hw.id === id);

    await UserDataStorage.updateHomework(id, updates);

    // Handle notification updates
    try {
      const ns = await getNotificationService();
      const preferences = await this.getPreferences();

      if (!preferences.notifications) {
        return; // Notifications are disabled
      }

      // If status changed to completed, cancel all notifications for this homework
      if (updates.status === "completed") {
        await ns.cancelHomeworkNotifications(id);
        return;
      }

      // If due date changed or status changed (and not completed), reschedule notifications
      if (
        updates.dueDate !== undefined ||
        (updates.status !== undefined && updates.status === "pending")
      ) {
        // Cancel existing notifications for this homework
        await ns.cancelHomeworkNotifications(id);

        // Get updated homework data
        const updatedHomework = await UserDataStorage.getHomework();
        const homework = updatedHomework.find((hw) => hw.id === id);

        // Reschedule if homework is pending
        if (homework && homework.status === "pending") {
          await ns.scheduleHomeworkReminders(homework);
        }
      }
    } catch (error) {
      console.error(
        "Error updating notifications after homework update:",
        error,
      );
    }
  }

  static async deleteHomework(id: string): Promise<void> {
    await UserDataStorage.deleteHomework(id);

    // Cancel notifications for this specific homework
    try {
      const ns = await getNotificationService();
      await ns.cancelHomeworkNotifications(id);
    } catch (error) {
      console.error(
        "Error canceling notifications after homework deletion:",
        error,
      );
    }
  }

  static async getSubjects(): Promise<SubjectData[]> {
    return await UserDataStorage.getSubjects();
  }

  static async saveSubjects(subjects: SubjectData[]): Promise<void> {
    await UserDataStorage.setSubjects(subjects);
  }

  static async saveAttachment(
    sourceUri: string,
    homeworkId: string,
    filename: string,
  ): Promise<AttachmentData> {
    return await ExternalStorage.saveAttachment(
      sourceUri,
      homeworkId,
      filename,
    );
  }

  static async deleteAttachment(attachmentId: string): Promise<void> {
    await ExternalStorage.deleteAttachment(attachmentId);
  }

  static async pickDocument(): Promise<AttachmentData | null> {
    return await ExternalStorage.pickDocument();
  }

  static async pickImage(): Promise<AttachmentData | null> {
    return await ExternalStorage.pickImage();
  }

  static async takePhoto(): Promise<AttachmentData | null> {
    return await ExternalStorage.takePhoto();
  }

  static async getAttachmentUri(attachmentId: string): Promise<string | null> {
    return await ExternalStorage.getAttachmentUri(attachmentId);
  }

  static async shareAttachment(attachmentId: string): Promise<void> {
    await ExternalStorage.shareAttachment(attachmentId);
  }

  static async openWithExternalApp(attachmentId: string): Promise<void> {
    await ExternalStorage.openWithExternalApp(attachmentId);
  }

  static async exportData(): Promise<string> {
    const data = await UserDataStorage.exportUserData();
    return await ExternalStorage.exportData(data as ExportData);
  }

  static async importData(): Promise<boolean> {
    const data = await ExternalStorage.importData();
    if (data) {
      await UserDataStorage.importUserData(data);
      return true;
    }
    return false;
  }

  static async cacheData<T>(
    key: string,
    data: T,
    duration?: number,
  ): Promise<void> {
    await CacheStorage.set(key, data, duration);
  }

  static async getCachedData<T>(key: string): Promise<T | null> {
    return await CacheStorage.get<T>(key);
  }

  static async clearCache(): Promise<void> {
    await CacheStorage.clear();
    await CacheStorage.clearFileCache();
  }

  static async getStorageStats(): Promise<{
    userData: {
      homeworkCount: number;
      subjectsCount: number;
    };
    files: {
      totalSize: number;
      attachmentsSize: number;
      exportsSize: number;
    };
    cache: {
      itemCount: number;
      totalSize: number;
      fileCacheSize: number;
    };
  }> {
    try {
      const [homework, subjects, fileStats, cacheStats, fileCacheSize] =
        await Promise.all([
          UserDataStorage.getHomework(),
          UserDataStorage.getSubjects(),
          ExternalStorage.getStorageInfo(),
          CacheStorage.getStats(),
          CacheStorage.getFileCacheSize(),
        ]);

      return {
        userData: {
          homeworkCount: homework.length,
          subjectsCount: subjects.length,
        },
        files: fileStats,
        cache: {
          ...cacheStats,
          fileCacheSize,
        },
      };
    } catch (error) {
      console.error("Error getting storage stats:", error);
      return {
        userData: { homeworkCount: 0, subjectsCount: 0 },
        files: { totalSize: 0, attachmentsSize: 0, exportsSize: 0 },
        cache: { itemCount: 0, totalSize: 0, fileCacheSize: 0 },
      };
    }
  }

  static async resetAllData(): Promise<void> {
    await Promise.all([
      UserDataStorage.clearAllUserData(),
      ExternalStorage.clearAllFiles(),
      CacheStorage.clear(),
      CacheStorage.clearFileCache(),
    ]);
  }

  static async cleanup(): Promise<{
    expiredCacheItems: number;
    tempFilesCleared: boolean;
  }> {
    try {
      const [expiredItems] = await Promise.all([
        CacheStorage.cleanupExpiredItems(),
        ExternalStorage.cleanupTempFiles(),
        CacheStorage.limitCacheSize(),
      ]);

      return {
        expiredCacheItems: expiredItems,
        tempFilesCleared: true,
      };
    } catch (error) {
      console.error("Error during cleanup:", error);
      return {
        expiredCacheItems: 0,
        tempFilesCleared: false,
      };
    }
  }

  static async createBackup(): Promise<string> {
    return await this.exportData();
  }

  static async restoreFromBackup(): Promise<boolean> {
    return await this.importData();
  }
}

export default StorageManager;

import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { StorageManager } from "./storage";
import { HomeworkData } from "@/shared/types/storage";
import { t } from "@tugascollecter/language-pack";

// Configure how notifications are handled when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export class NotificationService {
  private static _instance: NotificationService | null = null;
  private _isInitialized = false;
  private _hasPermission = false;

  // Define reminder intervals in milliseconds
  private readonly REMINDER_INTERVALS = [
    { days: 14, label: "14 days" },
    { days: 7, label: "7 days" },
    { days: 5, label: "5 days" },
    { days: 3, label: "3 days" },
    { days: 2, label: "2 days" },
    { days: 1, label: "1 day" },
    { hours: 18, label: "18 hours" },
    { hours: 12, label: "12 hours" },
    { hours: 6, label: "6 hours" },
    { hours: 3, label: "3 hours" },
    { hours: 2, label: "2 hours" },
    { hours: 1, label: "1 hour" },
  ];

  static getInstance(): NotificationService {
    if (!NotificationService._instance) {
      NotificationService._instance = new NotificationService();
    }
    return NotificationService._instance;
  }

  private constructor() {}

  async initialize(): Promise<boolean> {
    if (this._isInitialized) {
      return this._hasPermission;
    }

    try {
      // Only check current permissions, don't request yet
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();

      this._hasPermission = existingStatus === "granted";
      this._isInitialized = true;

      // If we already have permission, set up the notification channel
      if (this._hasPermission && Platform.OS === "android") {
        await this.setupAndroidNotificationChannel();
      }

      return this._hasPermission;
    } catch (error) {
      console.error("Error initializing notification service:", error);
      this._isInitialized = true;
      this._hasPermission = false;
      return false;
    }
  }

  async requestPermissions(): Promise<boolean> {
    if (!this._isInitialized) {
      await this.initialize();
    }

    if (this._hasPermission) {
      return true; // Already have permission
    }

    try {
      // Now request permissions
      const { status } = await Notifications.requestPermissionsAsync();
      this._hasPermission = status === "granted";

      if (this._hasPermission && Platform.OS === "android") {
        await this.setupAndroidNotificationChannel();
      }

      return this._hasPermission;
    } catch (error) {
      console.error("Error requesting notification permissions:", error);
      return false;
    }
  }

  private async setupAndroidNotificationChannel(): Promise<void> {
    try {
      await Notifications.setNotificationChannelAsync("homework-reminders", {
        name: "Homework Reminders",
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#3b82f6",
        description: "Notifications for homework due dates and reminders",
      });
    } catch (error) {
      console.error("Error setting up Android notification channel:", error);
    }
  }

  hasPermission(): boolean {
    return this._hasPermission;
  }

  async scheduleHomeworkReminders(homework: HomeworkData): Promise<string[]> {
    if (!this._hasPermission || !homework.dueDate) {
      return [];
    }

    // Don't schedule notifications for completed tasks
    if (homework.status === "completed") {
      return [];
    }

    try {
      // First, cancel any existing notifications for this homework
      await this.cancelHomeworkNotifications(homework.id);

      const dueDate = new Date(homework.dueDate);
      const now = new Date();
      const notificationIds: string[] = [];

      // Don't schedule if due date has already passed
      if (dueDate <= now) {
        return [];
      }

      // Calculate time until due date
      const millisecondsUntilDue = dueDate.getTime() - now.getTime();
      const daysUntilDue = millisecondsUntilDue / (1000 * 60 * 60 * 24);
      const hoursUntilDue = millisecondsUntilDue / (1000 * 60 * 60);

      console.log(
        `Homework "${homework.title}" is due in ${daysUntilDue.toFixed(2)} days (${hoursUntilDue.toFixed(2)} hours)`,
      );

      // Check if due today and schedule special "due today" notification
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const dueDateOnly = new Date(dueDate);
      dueDateOnly.setHours(0, 0, 0, 0);

      if (dueDateOnly.getTime() === today.getTime()) {
        // Schedule "due today" notification for 8 AM if not already passed
        const dueTodayTime = new Date(dueDate);
        dueTodayTime.setHours(8, 0, 0, 0);

        if (dueTodayTime > now) {
          console.log(
            `Scheduling "due today" notification for ${dueTodayTime.toLocaleString()}`,
          );
          const dueTodayId = await this.scheduleSpecialDueTodayNotification(
            homework,
            dueTodayTime,
          );
          if (dueTodayId) {
            notificationIds.push(dueTodayId);
          }
        }
      }

      // Schedule notifications for each reminder interval
      for (const interval of this.REMINDER_INTERVALS) {
        let shouldSchedule = false;
        const reminderTime = new Date(dueDate);

        if (interval.days) {
          // Only schedule day-based reminders if we have enough days
          if (daysUntilDue > interval.days) {
            reminderTime.setDate(reminderTime.getDate() - interval.days);
            reminderTime.setHours(9, 0, 0, 0); // Set to 9 AM
            shouldSchedule = true;
          }
        } else if (interval.hours) {
          // Only schedule hour-based reminders if we have enough hours
          if (hoursUntilDue > interval.hours) {
            reminderTime.setTime(
              reminderTime.getTime() - interval.hours * 60 * 60 * 1000,
            );
            shouldSchedule = true;
          }
        }

        // Double-check that reminder time is in the future
        if (shouldSchedule && reminderTime > now) {
          console.log(
            `Scheduling ${interval.label} reminder for ${reminderTime.toLocaleString()}`,
          );
          const notificationId = await this.scheduleHomeworkReminder(
            homework,
            reminderTime,
            interval.label,
          );
          if (notificationId) {
            notificationIds.push(notificationId);
          }
        } else {
          console.log(
            `Skipping ${interval.label} reminder - not enough time or already passed`,
          );
        }
      }

      console.log(
        `Scheduled ${notificationIds.length} notifications for "${homework.title}"`,
      );

      return notificationIds;
    } catch (error) {
      console.error("Error scheduling homework reminders:", error);
      return [];
    }
  }

  async scheduleSpecialDueTodayNotification(
    homework: HomeworkData,
    notificationTime: Date,
  ): Promise<string | null> {
    if (!this._hasPermission || !homework.dueDate) {
      return null;
    }

    try {
      const now = new Date();

      // Don't schedule if the notification time has already passed
      if (notificationTime <= now) {
        console.log("Not scheduling due today notification - time has passed");
        return null;
      }

      // Don't schedule for completed tasks
      if (homework.status === "completed") {
        return null;
      }

      const secondsFromNow = Math.max(
        300, // Minimum 5 minutes from now to avoid immediate firing
        Math.floor((notificationTime.getTime() - now.getTime()) / 1000),
      );

      // Get localized strings for "due today" notification
      const title = t("notificationMessages.dueTodayTitle");
      const body = t("notificationMessages.dueTodayMessage", {
        title: homework.title,
      });

      console.log(
        `Scheduling "due today" notification in ${secondsFromNow} seconds at ${new Date(Date.now() + secondsFromNow * 1000).toLocaleString()}: ${body}`,
      );

      const trigger: Notifications.TimeIntervalTriggerInput = {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: secondsFromNow,
      };

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: title,
          body: body,
          data: {
            homeworkId: homework.id,
            type: "homework_due_today",
            scheduledFor: notificationTime.toISOString(),
          },
        },
        trigger: trigger,
      });

      console.log(
        `Successfully created "due today" notification with ID: ${notificationId}`,
      );

      return notificationId;
    } catch (error) {
      console.error("Error scheduling due today notification:", error);
      return null;
    }
  }

  async scheduleHomeworkReminder(
    homework: HomeworkData,
    reminderTime: Date,
    timeLabel: string,
  ): Promise<string | null> {
    if (!this._hasPermission || !homework.dueDate) {
      return null;
    }

    try {
      const dueDate = new Date(homework.dueDate);
      const now = new Date();

      // Don't schedule if the reminder time has already passed
      if (reminderTime <= now) {
        console.log(
          `Not scheduling reminder for ${timeLabel} - time has passed`,
        );
        return null;
      }

      // Don't schedule for completed or in-progress tasks
      if (homework.status === "completed") {
        return null;
      }

      const secondsFromNow = Math.max(
        300, // Minimum 5 minutes from now to avoid immediate firing
        Math.floor((reminderTime.getTime() - now.getTime()) / 1000),
      );

      // Get localized notification strings
      const title = t("notificationMessages.homeworkReminder");
      const body = t("notificationMessages.dueInTime", {
        title: homework.title,
        time: timeLabel,
      });

      console.log(
        `Scheduling notification in ${secondsFromNow} seconds (${Math.floor(secondsFromNow / 60)} minutes) at ${new Date(Date.now() + secondsFromNow * 1000).toLocaleString()}: ${body}`,
      );

      // Use the correct TIME_INTERVAL trigger format as per Expo docs
      const trigger: Notifications.TimeIntervalTriggerInput = {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: secondsFromNow,
      };

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: title,
          body: body,
          data: {
            homeworkId: homework.id,
            type: "homework_reminder",
            timeLabel,
            scheduledFor: reminderTime.toISOString(),
          },
        },
        trigger: trigger,
      });

      console.log(
        `Successfully created notification with ID: ${notificationId}`,
      );

      return notificationId;
    } catch (error) {
      console.error("Error scheduling homework reminder:", error);
      return null;
    }
  }

  async scheduleHomeworkDueNotification(
    homework: HomeworkData,
  ): Promise<string[]> {
    // This method is now replaced by scheduleHomeworkReminders
    // Keep it for backward compatibility but delegate to the new method
    return await this.scheduleHomeworkReminders(homework);
  }

  async cancelNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      console.error("Error canceling notification:", error);
    }
  }

  async cancelHomeworkNotifications(homeworkId: string): Promise<void> {
    try {
      // Get all scheduled notifications
      const scheduledNotifications =
        await Notifications.getAllScheduledNotificationsAsync();

      // Find notifications for this specific homework
      const homeworkNotifications = scheduledNotifications.filter(
        (notification) => notification.content.data?.homeworkId === homeworkId,
      );

      // Cancel each notification for this homework
      for (const notification of homeworkNotifications) {
        await this.cancelNotification(notification.identifier);
      }
    } catch (error) {
      console.error("Error canceling homework notifications:", error);
    }
  }

  async cancelAllNotifications(): Promise<void> {
    try {
      console.log("Canceling all scheduled notifications...");
      await Notifications.cancelAllScheduledNotificationsAsync();

      // Also dismiss all delivered notifications to clean up notification tray
      await Notifications.dismissAllNotificationsAsync();

      console.log("All notifications canceled successfully");
    } catch (error) {
      console.error("Error canceling all notifications:", error);
    }
  }

  async forceCleanupAllNotifications(): Promise<void> {
    try {
      console.log("Force cleanup: Canceling all notifications...");

      // Cancel all scheduled notifications
      await this.cancelAllNotifications();

      // Get all scheduled notifications to verify cleanup
      const remaining = await Notifications.getAllScheduledNotificationsAsync();
      console.log(`After cleanup: ${remaining.length} notifications remaining`);

      if (remaining.length > 0) {
        console.log(
          "Remaining notifications:",
          remaining.map((n) => ({
            id: n.identifier,
            title: n.content.title,
            body: n.content.body,
            trigger: n.trigger,
          })),
        );

        // Force cancel each one individually if batch cancel didn't work
        for (const notification of remaining) {
          await this.cancelNotification(notification.identifier);
        }
        console.log("Force canceled remaining individual notifications");
      }
    } catch (error) {
      console.error("Error in force cleanup:", error);
    }
  }

  async logScheduledNotifications(): Promise<void> {
    try {
      const scheduled = await Notifications.getAllScheduledNotificationsAsync();
      console.log(`Currently scheduled notifications: ${scheduled.length}`);

      if (scheduled.length > 0) {
        scheduled.forEach((notification, index) => {
          console.log(`Notification ${index + 1}:`, {
            id: notification.identifier,
            title: notification.content.title,
            body: notification.content.body,
            trigger: notification.trigger,
            data: notification.content.data,
          });
        });
      }
    } catch (error) {
      console.error("Error logging scheduled notifications:", error);
    }
  }

  async rescheduleAllHomeworkNotifications(): Promise<void> {
    if (!this._hasPermission) {
      return;
    }

    try {
      console.log("Starting to reschedule all homework notifications...");

      // Cancel all existing notifications first to prevent spam
      await this.cancelAllNotifications();

      // Small delay to ensure cancellation is processed
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Get current preferences
      const preferences = await StorageManager.getPreferences();
      if (!preferences.notifications) {
        console.log("Notifications are disabled in preferences");
        return; // Notifications are disabled
      }

      // Get all pending homework (exclude completed and in-progress per requirements)
      const allHomework = await StorageManager.getHomework();
      const pendingHomework = allHomework.filter(
        (hw) => hw.status === "pending",
      );

      console.log(`Found ${pendingHomework.length} pending homework items`);

      // Schedule multiple reminders for each homework
      let totalScheduled = 0;
      for (const homework of pendingHomework) {
        const scheduledIds = await this.scheduleHomeworkReminders(homework);
        totalScheduled += scheduledIds.length;

        // Small delay between each homework to prevent overwhelming the system
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      console.log(
        `Successfully rescheduled ${totalScheduled} total notifications`,
      );

      // Log all scheduled notifications for debugging
      await this.logScheduledNotifications();
    } catch (error) {
      console.error("Error rescheduling notifications:", error);
    }
  }

  private getRelativeTimeString(dueDate: Date): string {
    const now = new Date();
    const diffTime = dueDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "today";
    } else if (diffDays === 1) {
      return "tomorrow";
    } else if (diffDays > 1) {
      return `in ${diffDays} days`;
    } else {
      return `${Math.abs(diffDays)} days ago`;
    }
  }

  // Listen for notification responses (when user taps notification)
  static addNotificationResponseListener(
    callback: (response: Notifications.NotificationResponse) => void,
  ): Notifications.Subscription {
    return Notifications.addNotificationResponseReceivedListener(callback);
  }

  // Listen for notifications received while app is in foreground
  static addNotificationReceivedListener(
    callback: (notification: Notifications.Notification) => void,
  ): Notifications.Subscription {
    return Notifications.addNotificationReceivedListener(callback);
  }
}

// Export singleton instance
export const notificationService = NotificationService.getInstance();

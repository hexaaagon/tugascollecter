import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  UserPreferences,
  ThemeType,
  HomeworkData,
  SubjectData,
  STORAGE_KEYS,
  DEFAULT_PREFERENCES,
  StorageError,
} from "../../shared/types/storage";

export class UserDataStorage {
  static async getPreferences(): Promise<UserPreferences> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.PREFERENCES);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...DEFAULT_PREFERENCES, ...parsed };
      }
      return DEFAULT_PREFERENCES;
    } catch (error) {
      console.error("Error loading preferences:", error);
      throw new StorageError(
        "Failed to load preferences",
        "PREFERENCES_LOAD_ERROR",
      );
    }
  }

  static async setPreferences(preferences: UserPreferences): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.PREFERENCES,
        JSON.stringify(preferences),
      );
    } catch (error) {
      console.error("Error saving preferences:", error);
      throw new StorageError(
        "Failed to save preferences",
        "PREFERENCES_SAVE_ERROR",
      );
    }
  }

  static async getThemePreference(): Promise<ThemeType> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.THEME);
      if (
        stored &&
        (stored === "light" || stored === "dark" || stored === "system")
      ) {
        return stored as ThemeType;
      }
      return "system";
    } catch (error) {
      console.error("Error loading theme preference:", error);
      throw new StorageError(
        "Failed to load theme preference",
        "THEME_LOAD_ERROR",
      );
    }
  }

  static async setThemePreference(theme: ThemeType): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch (error) {
      console.error("Error saving theme preference:", error);
      throw new StorageError(
        "Failed to save theme preference",
        "THEME_SAVE_ERROR",
      );
    }
  }

  static async getHomework(): Promise<HomeworkData[]> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.HOMEWORK);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error loading homework:", error);
      throw new StorageError("Failed to load homework", "HOMEWORK_LOAD_ERROR");
    }
  }

  static async setHomework(homework: HomeworkData[]): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.HOMEWORK,
        JSON.stringify(homework),
      );
    } catch (error) {
      console.error("Error saving homework:", error);
      throw new StorageError("Failed to save homework", "HOMEWORK_SAVE_ERROR");
    }
  }

  static async addHomework(homework: HomeworkData): Promise<void> {
    try {
      const existingHomework = await this.getHomework();
      const updatedHomework = [...existingHomework, homework];
      await this.setHomework(updatedHomework);
    } catch (error) {
      console.error("Error adding homework:", error);
      throw new StorageError("Failed to add homework", "HOMEWORK_ADD_ERROR");
    }
  }

  static async updateHomework(
    id: string,
    updates: Partial<HomeworkData>,
  ): Promise<void> {
    try {
      const existingHomework = await this.getHomework();
      const updatedHomework = existingHomework.map((hw) =>
        hw.id === id
          ? { ...hw, ...updates, updatedAt: new Date().toISOString() }
          : hw,
      );
      await this.setHomework(updatedHomework);
    } catch (error) {
      console.error("Error updating homework:", error);
      throw new StorageError(
        "Failed to update homework",
        "HOMEWORK_UPDATE_ERROR",
      );
    }
  }

  static async deleteHomework(id: string): Promise<void> {
    try {
      const existingHomework = await this.getHomework();
      const filteredHomework = existingHomework.filter((hw) => hw.id !== id);
      await this.setHomework(filteredHomework);
    } catch (error) {
      console.error("Error deleting homework:", error);
      throw new StorageError(
        "Failed to delete homework",
        "HOMEWORK_DELETE_ERROR",
      );
    }
  }

  static async getSubjects(): Promise<SubjectData[]> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.SUBJECTS);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error loading subjects:", error);
      throw new StorageError("Failed to load subjects", "SUBJECTS_LOAD_ERROR");
    }
  }

  static async setSubjects(subjects: SubjectData[]): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.SUBJECTS,
        JSON.stringify(subjects),
      );
    } catch (error) {
      console.error("Error saving subjects:", error);
      throw new StorageError("Failed to save subjects", "SUBJECTS_SAVE_ERROR");
    }
  }

  static async addSubject(subject: SubjectData): Promise<void> {
    try {
      const existingSubjects = await this.getSubjects();
      const updatedSubjects = [...existingSubjects, subject];
      await this.setSubjects(updatedSubjects);
    } catch (error) {
      console.error("Error adding subject:", error);
      throw new StorageError("Failed to add subject", "SUBJECT_ADD_ERROR");
    }
  }

  static async updateSubject(
    id: string,
    updates: Partial<SubjectData>,
  ): Promise<void> {
    try {
      const existingSubjects = await this.getSubjects();
      const updatedSubjects = existingSubjects.map((subject) =>
        subject.id === id ? { ...subject, ...updates } : subject,
      );
      await this.setSubjects(updatedSubjects);
    } catch (error) {
      console.error("Error updating subject:", error);
      throw new StorageError(
        "Failed to update subject",
        "SUBJECT_UPDATE_ERROR",
      );
    }
  }

  static async deleteSubject(id: string): Promise<void> {
    try {
      const existingSubjects = await this.getSubjects();
      const filteredSubjects = existingSubjects.filter(
        (subject) => subject.id !== id,
      );
      await this.setSubjects(filteredSubjects);
    } catch (error) {
      console.error("Error deleting subject:", error);
      throw new StorageError(
        "Failed to delete subject",
        "SUBJECT_DELETE_ERROR",
      );
    }
  }

  static async clearAllUserData(): Promise<void> {
    try {
      const keys = [
        STORAGE_KEYS.PREFERENCES,
        STORAGE_KEYS.THEME,
        STORAGE_KEYS.HOMEWORK,
        STORAGE_KEYS.SUBJECTS,
      ];
      await AsyncStorage.multiRemove(keys);
    } catch (error) {
      console.error("Error clearing user data:", error);
      throw new StorageError("Failed to clear user data", "CLEAR_DATA_ERROR");
    }
  }

  static async exportUserData() {
    try {
      const [preferences, theme, homework, subjects] = await Promise.all([
        this.getPreferences(),
        this.getThemePreference(),
        this.getHomework(),
        this.getSubjects(),
      ]);

      return {
        version: "1.0.0",
        exportedAt: new Date().toISOString(),
        preferences,
        theme,
        homework,
        subjects,
      };
    } catch (error) {
      console.error("Error exporting user data:", error);
      throw new StorageError("Failed to export user data", "EXPORT_ERROR");
    }
  }

  static async importUserData(data: any): Promise<void> {
    try {
      if (data.preferences) await this.setPreferences(data.preferences);
      if (data.theme) await this.setThemePreference(data.theme);
      if (data.homework) await this.setHomework(data.homework);
      if (data.subjects) await this.setSubjects(data.subjects);
    } catch (error) {
      console.error("Error importing user data:", error);
      throw new StorageError("Failed to import user data", "IMPORT_ERROR");
    }
  }
}

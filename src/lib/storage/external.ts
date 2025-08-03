import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import * as Sharing from "expo-sharing";
import {
  AttachmentData,
  ExportData,
  STORAGE_KEYS,
  ExternalStorageError,
} from "../../shared/types/storage";

export class ExternalStorage {
  private static get baseDir(): string {
    return `${FileSystem.documentDirectory}${STORAGE_KEYS.APP_FOLDER}/`;
  }

  private static get attachmentsDir(): string {
    return `${this.baseDir}${STORAGE_KEYS.ATTACHMENTS_FOLDER}/`;
  }

  private static get exportsDir(): string {
    return `${this.baseDir}${STORAGE_KEYS.EXPORTS_FOLDER}/`;
  }

  private static get tempDir(): string {
    return `${this.baseDir}${STORAGE_KEYS.TEMP_FOLDER}/`;
  }

  static async initializeDirectories(): Promise<void> {
    try {
      const directories = [
        this.baseDir,
        this.attachmentsDir,
        this.exportsDir,
        this.tempDir,
      ];

      for (const dir of directories) {
        const dirInfo = await FileSystem.getInfoAsync(dir);
        if (!dirInfo.exists) {
          await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
        }
      }
    } catch (error) {
      console.error("Error initializing directories:", error);
      throw new ExternalStorageError(
        "Failed to initialize directories",
        "INIT_ERROR",
      );
    }
  }

  static async saveAttachment(
    sourceUri: string,
    homeworkId: string,
    filename: string,
  ): Promise<AttachmentData> {
    try {
      await this.initializeDirectories();

      const fileInfo = await FileSystem.getInfoAsync(sourceUri);
      if (!fileInfo.exists) {
        throw new ExternalStorageError(
          "Source file does not exist",
          "FILE_NOT_FOUND",
        );
      }

      const attachmentId = `${homeworkId}_${Date.now()}`;
      const extension = filename.split(".").pop() || "";
      const newFilename = `${attachmentId}.${extension}`;
      const destinationUri = `${this.attachmentsDir}${newFilename}`;

      await FileSystem.copyAsync({
        from: sourceUri,
        to: destinationUri,
      });

      const savedFileInfo = await FileSystem.getInfoAsync(destinationUri);

      const attachment: AttachmentData = {
        id: attachmentId,
        name: filename,
        type: this.getFileType(extension),
        uri: destinationUri,
        size:
          savedFileInfo.exists && "size" in savedFileInfo
            ? savedFileInfo.size
            : 0,
        mimeType: this.getMimeType(extension),
        uploadedAt: new Date().toISOString(),
      };

      return attachment;
    } catch (error) {
      console.error("Error saving attachment:", error);
      throw new ExternalStorageError(
        "Failed to save attachment",
        "SAVE_ATTACHMENT_ERROR",
      );
    }
  }

  static async deleteAttachment(attachmentId: string): Promise<void> {
    try {
      const files = await FileSystem.readDirectoryAsync(this.attachmentsDir);
      const targetFile = files.find((file) => file.startsWith(attachmentId));

      if (targetFile) {
        const filePath = `${this.attachmentsDir}${targetFile}`;
        await FileSystem.deleteAsync(filePath);
      }
    } catch (error) {
      console.error("Error deleting attachment:", error);
      throw new ExternalStorageError(
        "Failed to delete attachment",
        "DELETE_ATTACHMENT_ERROR",
      );
    }
  }

  static async getAttachmentUri(attachmentId: string): Promise<string | null> {
    try {
      const files = await FileSystem.readDirectoryAsync(this.attachmentsDir);
      const targetFile = files.find((file) => file.startsWith(attachmentId));

      return targetFile ? `${this.attachmentsDir}${targetFile}` : null;
    } catch (error) {
      console.error("Error getting attachment URI:", error);
      return null;
    }
  }

  static async exportData(data: ExportData): Promise<string> {
    try {
      await this.initializeDirectories();

      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const filename = `tugascollecter_backup_${timestamp}.json`;
      const filePath = `${this.exportsDir}${filename}`;

      await FileSystem.writeAsStringAsync(
        filePath,
        JSON.stringify(data, null, 2),
      );

      return filePath;
    } catch (error) {
      console.error("Error exporting data:", error);
      throw new ExternalStorageError("Failed to export data", "EXPORT_ERROR");
    }
  }

  static async importData(): Promise<ExportData | null> {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/json",
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return null;
      }

      const content = await FileSystem.readAsStringAsync(result.assets[0].uri);
      const data = JSON.parse(content);

      // Basic validation
      if (!data.version || !data.exportedAt) {
        throw new ExternalStorageError(
          "Invalid backup file format",
          "INVALID_FORMAT",
        );
      }

      return data as ExportData;
    } catch (error) {
      console.error("Error importing data:", error);
      throw new ExternalStorageError("Failed to import data", "IMPORT_ERROR");
    }
  }

  static async shareExportFile(filePath: string): Promise<void> {
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        throw new ExternalStorageError(
          "Sharing is not available",
          "SHARING_UNAVAILABLE",
        );
      }

      await Sharing.shareAsync(filePath, {
        mimeType: "application/json",
        dialogTitle: "Share Backup File",
      });
    } catch (error) {
      console.error("Error sharing file:", error);
      throw new ExternalStorageError("Failed to share file", "SHARE_ERROR");
    }
  }

  static async pickDocument(): Promise<AttachmentData | null> {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return null;
      }

      const asset = result.assets[0];
      const extension = asset.name.split(".").pop() || "";

      const attachment: AttachmentData = {
        id: `temp_${Date.now()}`,
        name: asset.name,
        type: this.getFileType(extension),
        uri: asset.uri,
        size: asset.size || 0,
        mimeType: asset.mimeType || this.getMimeType(extension),
        uploadedAt: new Date().toISOString(),
      };

      return attachment;
    } catch (error) {
      console.error("Error picking document:", error);
      throw new ExternalStorageError(
        "Failed to pick document",
        "PICK_DOCUMENT_ERROR",
      );
    }
  }

  static async getStorageInfo(): Promise<{
    totalSize: number;
    attachmentsSize: number;
    exportsSize: number;
  }> {
    try {
      await this.initializeDirectories();

      const [attachmentsSize, exportsSize] = await Promise.all([
        this.getDirectorySize(this.attachmentsDir),
        this.getDirectorySize(this.exportsDir),
      ]);

      return {
        totalSize: attachmentsSize + exportsSize,
        attachmentsSize,
        exportsSize,
      };
    } catch (error) {
      console.error("Error getting storage info:", error);
      return { totalSize: 0, attachmentsSize: 0, exportsSize: 0 };
    }
  }

  static async cleanupTempFiles(): Promise<void> {
    try {
      const tempDirInfo = await FileSystem.getInfoAsync(this.tempDir);
      if (tempDirInfo.exists) {
        await FileSystem.deleteAsync(this.tempDir);
        await FileSystem.makeDirectoryAsync(this.tempDir, {
          intermediates: true,
        });
      }
    } catch (error) {
      console.error("Error cleaning up temp files:", error);
    }
  }

  static async clearAllFiles(): Promise<void> {
    try {
      const baseDirInfo = await FileSystem.getInfoAsync(this.baseDir);
      if (baseDirInfo.exists) {
        await FileSystem.deleteAsync(this.baseDir);
      }
    } catch (error) {
      console.error("Error clearing all files:", error);
      throw new ExternalStorageError(
        "Failed to clear all files",
        "CLEAR_FILES_ERROR",
      );
    }
  }

  private static async getDirectorySize(dirPath: string): Promise<number> {
    try {
      const files = await FileSystem.readDirectoryAsync(dirPath);
      let totalSize = 0;

      for (const file of files) {
        const filePath = `${dirPath}${file}`;
        const fileInfo = await FileSystem.getInfoAsync(filePath);
        if (fileInfo.exists && "size" in fileInfo) {
          totalSize += fileInfo.size;
        }
      }

      return totalSize;
    } catch (error) {
      return 0;
    }
  }

  private static getFileType(extension: string): AttachmentData["type"] {
    const imageExts = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
    const documentExts = ["pdf", "doc", "docx", "txt", "rtf", "odt"];
    const audioExts = ["mp3", "wav", "aac", "m4a", "ogg"];
    const videoExts = ["mp4", "avi", "mov", "mkv", "webm"];

    const ext = extension.toLowerCase();

    if (imageExts.includes(ext)) return "image";
    if (documentExts.includes(ext)) return "document";
    if (audioExts.includes(ext)) return "audio";
    if (videoExts.includes(ext)) return "video";

    return "other";
  }

  private static getMimeType(extension: string): string {
    const mimeTypes: Record<string, string> = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      bmp: "image/bmp",
      webp: "image/webp",

      pdf: "application/pdf",
      doc: "application/msword",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      txt: "text/plain",
      rtf: "application/rtf",

      mp3: "audio/mpeg",
      wav: "audio/wav",
      aac: "audio/aac",
      m4a: "audio/mp4",

      mp4: "video/mp4",
      avi: "video/x-msvideo",
      mov: "video/quicktime",
      mkv: "video/x-matroska",
    };

    return mimeTypes[extension.toLowerCase()] || "application/octet-stream";
  }
}

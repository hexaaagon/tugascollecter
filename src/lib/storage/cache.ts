import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import {
  CacheItem,
  STORAGE_KEYS,
  CacheError,
} from "../../shared/types/storage";

export class CacheStorage {
  private static readonly DEFAULT_CACHE_DURATION = 1000 * 60 * 60; // 1 hour
  private static readonly MAX_CACHE_SIZE = 50;

  private static get cacheDir(): string {
    return `${FileSystem.cacheDirectory}${STORAGE_KEYS.APP_FOLDER}/`;
  }

  static async set<T>(
    key: string,
    data: T,
    duration: number = this.DEFAULT_CACHE_DURATION,
  ): Promise<void> {
    try {
      const cacheKey = `${STORAGE_KEYS.CACHE_PREFIX}${key}`;
      const cacheItem: CacheItem<T> = {
        data,
        timestamp: Date.now(),
        expiresAt: Date.now() + duration,
      };

      await AsyncStorage.setItem(cacheKey, JSON.stringify(cacheItem));

      await this.cleanupExpiredItems();
    } catch (error) {
      console.error("Error setting cache item:", error);
      throw new CacheError("Failed to set cache item", "CACHE_SET_ERROR");
    }
  }

  static async get<T>(key: string): Promise<T | null> {
    try {
      const cacheKey = `${STORAGE_KEYS.CACHE_PREFIX}${key}`;
      const stored = await AsyncStorage.getItem(cacheKey);

      if (!stored) {
        return null;
      }

      const cacheItem: CacheItem<T> = JSON.parse(stored);

      if (Date.now() > cacheItem.expiresAt) {
        await AsyncStorage.removeItem(cacheKey);
        return null;
      }

      return cacheItem.data;
    } catch (error) {
      console.error("Error getting cache item:", error);
      return null;
    }
  }

  static async has(key: string): Promise<boolean> {
    try {
      const data = await this.get(key);
      return data !== null;
    } catch (error) {
      return false;
    }
  }

  static async remove(key: string): Promise<void> {
    try {
      const cacheKey = `${STORAGE_KEYS.CACHE_PREFIX}${key}`;
      await AsyncStorage.removeItem(cacheKey);
    } catch (error) {
      console.error("Error removing cache item:", error);
      throw new CacheError("Failed to remove cache item", "CACHE_REMOVE_ERROR");
    }
  }

  static async clear(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter((key) =>
        key.startsWith(STORAGE_KEYS.CACHE_PREFIX),
      );

      if (cacheKeys.length > 0) {
        await AsyncStorage.multiRemove(cacheKeys);
      }
    } catch (error) {
      console.error("Error clearing cache:", error);
      throw new CacheError("Failed to clear cache", "CACHE_CLEAR_ERROR");
    }
  }

  static async setFile(
    key: string,
    fileUri: string,
    duration: number = this.DEFAULT_CACHE_DURATION,
  ): Promise<string> {
    try {
      await this.initializeCacheDirectory();

      const extension = fileUri.split(".").pop() || "";
      const cachedFileName = `${key}_${Date.now()}.${extension}`;
      const cachedFilePath = `${this.cacheDir}${cachedFileName}`;

      await FileSystem.copyAsync({
        from: fileUri,
        to: cachedFilePath,
      });

      const metadata = {
        originalUri: fileUri,
        cachedPath: cachedFilePath,
        cachedAt: Date.now(),
        expiresAt: Date.now() + duration,
      };

      await this.set(`file_${key}`, metadata, duration);

      return cachedFilePath;
    } catch (error) {
      console.error("Error caching file:", error);
      throw new CacheError("Failed to cache file", "FILE_CACHE_ERROR");
    }
  }

  static async getFile(key: string): Promise<string | null> {
    try {
      const metadata = await this.get<{
        originalUri: string;
        cachedPath: string;
        cachedAt: number;
        expiresAt: number;
      }>(`file_${key}`);

      if (!metadata) {
        return null;
      }

      const fileInfo = await FileSystem.getInfoAsync(metadata.cachedPath);
      if (!fileInfo.exists) {
        await this.remove(`file_${key}`);
        return null;
      }

      return metadata.cachedPath;
    } catch (error) {
      console.error("Error getting cached file:", error);
      return null;
    }
  }

  static async removeFile(key: string): Promise<void> {
    try {
      const metadata = await this.get<{
        cachedPath: string;
      }>(`file_${key}`);

      if (metadata) {
        const fileInfo = await FileSystem.getInfoAsync(metadata.cachedPath);
        if (fileInfo.exists) {
          await FileSystem.deleteAsync(metadata.cachedPath);
        }

        await this.remove(`file_${key}`);
      }
    } catch (error) {
      console.error("Error removing cached file:", error);
      throw new CacheError(
        "Failed to remove cached file",
        "FILE_CACHE_REMOVE_ERROR",
      );
    }
  }

  static async getStats(): Promise<{
    itemCount: number;
    totalSize: number;
    oldestItem: number | null;
    newestItem: number | null;
  }> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter((key) =>
        key.startsWith(STORAGE_KEYS.CACHE_PREFIX),
      );

      let totalSize = 0;
      let oldestItem: number | null = null;
      let newestItem: number | null = null;

      for (const key of cacheKeys) {
        const stored = await AsyncStorage.getItem(key);
        if (stored) {
          const item: CacheItem = JSON.parse(stored);
          totalSize += stored.length;

          if (!oldestItem || item.timestamp < oldestItem) {
            oldestItem = item.timestamp;
          }

          if (!newestItem || item.timestamp > newestItem) {
            newestItem = item.timestamp;
          }
        }
      }

      return {
        itemCount: cacheKeys.length,
        totalSize,
        oldestItem,
        newestItem,
      };
    } catch (error) {
      console.error("Error getting cache stats:", error);
      return { itemCount: 0, totalSize: 0, oldestItem: null, newestItem: null };
    }
  }

  static async getFileCacheSize(): Promise<number> {
    try {
      const cacheInfo = await FileSystem.getInfoAsync(this.cacheDir);
      if (!cacheInfo.exists) {
        return 0;
      }

      const files = await FileSystem.readDirectoryAsync(this.cacheDir);
      let totalSize = 0;

      for (const file of files) {
        const filePath = `${this.cacheDir}${file}`;
        const fileInfo = await FileSystem.getInfoAsync(filePath);
        if (fileInfo.exists && "size" in fileInfo) {
          totalSize += fileInfo.size;
        }
      }

      return totalSize;
    } catch (error) {
      console.error("Error getting file cache size:", error);
      return 0;
    }
  }

  static async cleanupExpiredItems(): Promise<number> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter((key) =>
        key.startsWith(STORAGE_KEYS.CACHE_PREFIX),
      );
      const expiredKeys: string[] = [];

      for (const key of cacheKeys) {
        const stored = await AsyncStorage.getItem(key);
        if (stored) {
          const item: CacheItem = JSON.parse(stored);
          if (Date.now() > item.expiresAt) {
            expiredKeys.push(key);

            if (key.includes("file_")) {
              const metadata = item.data as any;
              if (metadata?.cachedPath) {
                try {
                  await FileSystem.deleteAsync(metadata.cachedPath);
                } catch (fileError) {
                  console.warn("Error deleting cached file:", fileError);
                }
              }
            }
          }
        }
      }

      if (expiredKeys.length > 0) {
        await AsyncStorage.multiRemove(expiredKeys);
      }

      return expiredKeys.length;
    } catch (error) {
      console.error("Error cleaning up expired cache items:", error);
      return 0;
    }
  }

  static async limitCacheSize(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter((key) =>
        key.startsWith(STORAGE_KEYS.CACHE_PREFIX),
      );

      if (cacheKeys.length <= this.MAX_CACHE_SIZE) {
        return;
      }

      const cacheItems: Array<{ key: string; timestamp: number }> = [];

      for (const key of cacheKeys) {
        const stored = await AsyncStorage.getItem(key);
        if (stored) {
          const item: CacheItem = JSON.parse(stored);
          cacheItems.push({ key, timestamp: item.timestamp });
        }
      }

      cacheItems.sort((a, b) => a.timestamp - b.timestamp);

      const itemsToRemove = cacheItems.slice(
        0,
        cacheItems.length - this.MAX_CACHE_SIZE,
      );
      const keysToRemove = itemsToRemove.map((item) => item.key);

      if (keysToRemove.length > 0) {
        await AsyncStorage.multiRemove(keysToRemove);
      }
    } catch (error) {
      console.error("Error limiting cache size:", error);
    }
  }

  static async clearFileCache(): Promise<void> {
    try {
      const cacheInfo = await FileSystem.getInfoAsync(this.cacheDir);
      if (cacheInfo.exists) {
        await FileSystem.deleteAsync(this.cacheDir);
      }
    } catch (error) {
      console.error("Error clearing file cache:", error);
      throw new CacheError(
        "Failed to clear file cache",
        "FILE_CACHE_CLEAR_ERROR",
      );
    }
  }

  private static async initializeCacheDirectory(): Promise<void> {
    try {
      const cacheInfo = await FileSystem.getInfoAsync(this.cacheDir);
      if (!cacheInfo.exists) {
        await FileSystem.makeDirectoryAsync(this.cacheDir, {
          intermediates: true,
        });
      }
    } catch (error) {
      console.error("Error initializing cache directory:", error);
      throw new CacheError(
        "Failed to initialize cache directory",
        "CACHE_INIT_ERROR",
      );
    }
  }

  static async remember<T>(
    key: string,
    callback: () => Promise<T>,
    duration?: number,
  ): Promise<T> {
    try {
      const cached = await this.get<T>(key);
      if (cached !== null) {
        return cached;
      }

      const result = await callback();
      await this.set(key, result, duration);

      return result;
    } catch (error) {
      console.error("Error in cache remember:", error);
      return await callback();
    }
  }
}

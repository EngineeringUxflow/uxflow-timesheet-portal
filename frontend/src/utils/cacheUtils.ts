// Cache management utilities
export class CacheManager {
  private static readonly CACHE_VERSION = Date.now().toString();
  private static readonly CACHE_PREFIX = 'uxflow_v';

  // Generate cache-busted key
  static getCacheKey(key: string): string {
    return `${this.CACHE_PREFIX}${this.CACHE_VERSION}_${key}`;
  }

  // Set item with version control
  static setItem(key: string, value: any): void {
    try {
      const cacheKey = this.getCacheKey(key);
      const data = {
        value,
        timestamp: Date.now(),
        version: this.CACHE_VERSION
      };
      localStorage.setItem(cacheKey, JSON.stringify(data));
      
      // Clean old versions
      this.cleanOldVersions(key);
    } catch (error) {
      console.warn('Cache set failed:', error);
    }
  }

  // Get item with version validation
  static getItem(key: string): any {
    try {
      const cacheKey = this.getCacheKey(key);
      const stored = localStorage.getItem(cacheKey);
      
      if (!stored) return null;
      
      const data = JSON.parse(stored);
      
      // Check if version matches
      if (data.version !== this.CACHE_VERSION) {
        this.removeItem(key);
        return null;
      }
      
      return data.value;
    } catch (error) {
      console.warn('Cache get failed:', error);
      return null;
    }
  }

  // Remove specific item
  static removeItem(key: string): void {
    try {
      const cacheKey = this.getCacheKey(key);
      localStorage.removeItem(cacheKey);
    } catch (error) {
      console.warn('Cache remove failed:', error);
    }
  }

  // Clean old cache versions
  static cleanOldVersions(key: string): void {
    try {
      const keys = Object.keys(localStorage);
      const pattern = new RegExp(`^${this.CACHE_PREFIX}\\d+_${key}$`);
      
      keys.forEach(storageKey => {
        if (pattern.test(storageKey) && !storageKey.includes(this.CACHE_VERSION)) {
          localStorage.removeItem(storageKey);
        }
      });
    } catch (error) {
      console.warn('Cache cleanup failed:', error);
    }
  }

  // Clear all cache
  static clearAll(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.CACHE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Cache clear all failed:', error);
    }
  }

  // Force refresh by updating version
  static forceRefresh(): void {
    this.clearAll();
    window.location.reload();
  }
}
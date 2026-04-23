const { CACHE } = require('../config/constants');

/**
 * Simple in-memory cache service
 * For production, use Redis
 */
class CacheService {
  constructor() {
    this.cache = new Map();
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0
    };
  }
  
  /**
   * Generate cache key
   */
  generateKey(prefix, params) {
    const key = `${prefix}:${JSON.stringify(params)}`;
    return key;
  }
  
  /**
   * Get value from cache
   */
  get(key) {
    const item = this.cache.get(key);
    
    if (!item) {
      this.stats.misses++;
      return null;
    }
    
    // Check if expired
    if (item.expiresAt && item.expiresAt < Date.now()) {
      this.cache.delete(key);
      this.stats.misses++;
      return null;
    }
    
    this.stats.hits++;
    return item.value;
  }
  
  /**
   * Set value in cache
   */
  set(key, value, ttl = CACHE.TTL) {
    const expiresAt = ttl ? Date.now() + (ttl * 1000) : null;
    
    this.cache.set(key, {
      value,
      expiresAt,
      createdAt: Date.now()
    });
    
    this.stats.sets++;
    
    // Cleanup if cache gets too large
    if (this.cache.size > 10000) {
      this.cleanup();
    }
  }
  
  /**
   * Delete from cache
   */
  delete(key) {
    return this.cache.delete(key);
  }
  
  /**
   * Clear entire cache
   */
  clear() {
    this.cache.clear();
    this.stats = { hits: 0, misses: 0, sets: 0 };
  }
  
  /**
   * Get or set cache (read-through pattern)
   */
  async getOrSet(key, fetchFn, ttl = CACHE.TTL) {
    const cached = this.get(key);
    
    if (cached !== null) {
      return cached;
    }
    
    const value = await fetchFn();
    this.set(key, value, ttl);
    
    return value;
  }
  
  /**
   * Cleanup expired entries
   */
  cleanup() {
    const now = Date.now();
    let deletedCount = 0;
    
    for (const [key, item] of this.cache.entries()) {
      if (item.expiresAt && item.expiresAt < now) {
        this.cache.delete(key);
        deletedCount++;
      }
    }
    
    return deletedCount;
  }
  
  /**
   * Get cache stats
   */
  getStats() {
    const hitRate = this.stats.hits + this.stats.misses > 0
      ? ((this.stats.hits / (this.stats.hits + this.stats.misses)) * 100).toFixed(1)
      : 0;
    
    return {
      ...this.stats,
      size: this.cache.size,
      hitRate: `${hitRate}%`
    };
  }
  
  /**
   * Invalidate by prefix
   */
  invalidateByPrefix(prefix) {
    let deletedCount = 0;
    
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
        deletedCount++;
      }
    }
    
    return deletedCount;
  }
}

// Create singleton instance
const cacheService = new CacheService();

// Run cleanup every 5 minutes
setInterval(() => {
  const deleted = cacheService.cleanup();
  if (deleted > 0) {
    console.log(`🧹 Cache cleanup: removed ${deleted} expired entries`);
  }
}, 5 * 60 * 1000);

module.exports = cacheService;
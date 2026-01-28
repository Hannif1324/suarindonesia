/**
 * IndexedDB Service
 * Handles all database operations for the application
 */

import { APP_CONFIG, DB_STORES } from '../utils/constants.js';
import { logger } from '../debugs/logger.js';

class DatabaseService {
    constructor() {
        this.db = null;
        this.dbName = APP_CONFIG.DB_NAME;
        this.dbVersion = APP_CONFIG.DB_VERSION;
    }

    /**
     * Initialize the database
     */
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = () => {
                logger.error('Database failed to open', request.error);
                reject(request.error);
            };

            request.onsuccess = () => {
                this.db = request.result;
                logger.info('Database opened successfully');
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                logger.info('Database upgrade needed');

                // Create object stores if they don't exist
                if (!db.objectStoreNames.contains(DB_STORES.PAGES)) {
                    const pagesStore = db.createObjectStore(DB_STORES.PAGES, {
                        keyPath: 'url'
                    });
                    pagesStore.createIndex('slug', 'slug', { unique: false });
                    logger.debug('Created pages store');
                }

                if (!db.objectStoreNames.contains(DB_STORES.ARTICLES)) {
                    const articlesStore = db.createObjectStore(DB_STORES.ARTICLES, {
                        keyPath: 'slug'
                    });
                    articlesStore.createIndex('date', 'date', { unique: false });
                    articlesStore.createIndex('categories', 'categories', {
                        unique: false,
                        multiEntry: true
                    });
                    logger.debug('Created articles store');
                }

                if (!db.objectStoreNames.contains(DB_STORES.ASSETS)) {
                    const assetsStore = db.createObjectStore(DB_STORES.ASSETS, {
                        keyPath: 'url'
                    });
                    assetsStore.createIndex('type', 'type', { unique: false });
                    logger.debug('Created assets store');
                }

                if (!db.objectStoreNames.contains(DB_STORES.METADATA)) {
                    db.createObjectStore(DB_STORES.METADATA, {
                        keyPath: 'key'
                    });
                    logger.debug('Created metadata store');
                }
            };
        });
    }

    /**
     * Add data to a store
     */
    async add(storeName, data) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.add(data);

            request.onsuccess = () => {
                logger.debug(`Added data to ${storeName}`, data);
                resolve(request.result);
            };

            request.onerror = () => {
                logger.error(`Failed to add data to ${storeName}`, request.error);
                reject(request.error);
            };
        });
    }

    /**
     * Put (add or update) data in a store
     */
    async put(storeName, data) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.put(data);

            request.onsuccess = () => {
                logger.debug(`Put data to ${storeName}`, data);
                resolve(request.result);
            };

            request.onerror = () => {
                logger.error(`Failed to put data to ${storeName}`, request.error);
                reject(request.error);
            };
        });
    }

    /**
     * Get data from a store by key
     */
    async get(storeName, key) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.get(key);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                logger.error(`Failed to get data from ${storeName}`, request.error);
                reject(request.error);
            };
        });
    }

    /**
     * Get all data from a store
     */
    async getAll(storeName) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.getAll();

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                logger.error(`Failed to get all data from ${storeName}`, request.error);
                reject(request.error);
            };
        });
    }

    /**
     * Delete data from a store
     */
    async delete(storeName, key) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.delete(key);

            request.onsuccess = () => {
                logger.debug(`Deleted data from ${storeName}`, key);
                resolve();
            };

            request.onerror = () => {
                logger.error(`Failed to delete data from ${storeName}`, request.error);
                reject(request.error);
            };
        });
    }

    /**
     * Clear all data from a store
     */
    async clear(storeName) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.clear();

            request.onsuccess = () => {
                logger.info(`Cleared all data from ${storeName}`);
                resolve();
            };

            request.onerror = () => {
                logger.error(`Failed to clear ${storeName}`, request.error);
                reject(request.error);
            };
        });
    }

    /**
     * Query data using an index
     */
    async queryByIndex(storeName, indexName, value) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const index = store.index(indexName);
            const request = index.getAll(value);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                logger.error(`Failed to query ${storeName} by index ${indexName}`, request.error);
                reject(request.error);
            };
        });
    }

    /**
     * Count records in a store
     */
    async count(storeName) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.count();

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                logger.error(`Failed to count records in ${storeName}`, request.error);
                reject(request.error);
            };
        });
    }
}

// Export singleton instance
export const db = new DatabaseService();

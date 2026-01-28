/**
 * Debug Logger Utility
 * Provides structured logging with different levels
 */

const LOG_LEVELS = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3
};

class Logger {
    constructor(level = LOG_LEVELS.INFO) {
        this.level = level;
        this.enabled = true;
    }

    setLevel(level) {
        this.level = level;
    }

    enable() {
        this.enabled = true;
    }

    disable() {
        this.enabled = false;
    }

    debug(...args) {
        if (this.enabled && this.level <= LOG_LEVELS.DEBUG) {
            console.log('[DEBUG]', new Date().toISOString(), ...args);
        }
    }

    info(...args) {
        if (this.enabled && this.level <= LOG_LEVELS.INFO) {
            console.info('[INFO]', new Date().toISOString(), ...args);
        }
    }

    warn(...args) {
        if (this.enabled && this.level <= LOG_LEVELS.WARN) {
            console.warn('[WARN]', new Date().toISOString(), ...args);
        }
    }

    error(...args) {
        if (this.enabled && this.level <= LOG_LEVELS.ERROR) {
            console.error('[ERROR]', new Date().toISOString(), ...args);
        }
    }

    group(label) {
        if (this.enabled) {
            console.group(label);
        }
    }

    groupEnd() {
        if (this.enabled) {
            console.groupEnd();
        }
    }
}

// Export singleton instance
export const logger = new Logger(LOG_LEVELS.DEBUG);
export { LOG_LEVELS };

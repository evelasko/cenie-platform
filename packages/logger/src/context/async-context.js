"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextKeys = exports.logContext = void 0;
const async_hooks_1 = require("async_hooks");
/**
 * Context storage for request-scoped data
 */
class LogContextStore {
    storage = new async_hooks_1.AsyncLocalStorage();
    /**
     * Run a function with the given context
     */
    run(context, callback) {
        const store = new Map(Object.entries(context));
        return this.storage.run(store, callback);
    }
    /**
     * Get a specific context value
     */
    get(key) {
        return this.storage.getStore()?.get(key);
    }
    /**
     * Set a context value in the current store
     */
    set(key, value) {
        const store = this.storage.getStore();
        if (store) {
            store.set(key, value);
        }
    }
    /**
     * Get all context values
     */
    getAll() {
        const store = this.storage.getStore();
        if (!store)
            return {};
        return Object.fromEntries(store.entries());
    }
    /**
     * Clear all context
     */
    clear() {
        const store = this.storage.getStore();
        if (store) {
            store.clear();
        }
    }
    /**
     * Check if we're in an active context
     */
    hasContext() {
        return this.storage.getStore() !== undefined;
    }
}
/**
 * Global log context store
 */
exports.logContext = new LogContextStore();
/**
 * Common context keys
 */
exports.ContextKeys = {
    REQUEST_ID: 'requestId',
    USER_ID: 'userId',
    SESSION_ID: 'sessionId',
    IP_ADDRESS: 'ipAddress',
    USER_AGENT: 'userAgent',
    PATH: 'path',
    METHOD: 'method',
};
//# sourceMappingURL=async-context.js.map
/**
 * Context storage for request-scoped data
 */
declare class LogContextStore {
    private storage;
    /**
     * Run a function with the given context
     */
    run<T>(context: Record<string, any>, callback: () => T): T;
    /**
     * Get a specific context value
     */
    get(key: string): any;
    /**
     * Set a context value in the current store
     */
    set(key: string, value: any): void;
    /**
     * Get all context values
     */
    getAll(): Record<string, any>;
    /**
     * Clear all context
     */
    clear(): void;
    /**
     * Check if we're in an active context
     */
    hasContext(): boolean;
}
/**
 * Global log context store
 */
export declare const logContext: LogContextStore;
/**
 * Common context keys
 */
export declare const ContextKeys: {
    readonly REQUEST_ID: "requestId";
    readonly USER_ID: "userId";
    readonly SESSION_ID: "sessionId";
    readonly IP_ADDRESS: "ipAddress";
    readonly USER_AGENT: "userAgent";
    readonly PATH: "path";
    readonly METHOD: "method";
};
export {};

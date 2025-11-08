import type { LoggerConfig, ILogger } from './types';
/**
 * Core Logger implementation
 */
export declare class Logger implements ILogger {
    private readonly name;
    private readonly level;
    private readonly environment;
    private readonly transports;
    private readonly redactFields;
    private readonly prettyPrint;
    private readonly defaultContext;
    constructor(config: LoggerConfig);
    /**
     * Detect environment from NODE_ENV
     */
    private detectEnvironment;
    /**
     * Create a log entry
     */
    private createLogEntry;
    /**
     * Write log entry to all transports
     */
    private write;
    /**
     * Log at a specific level
     */
    private log;
    /**
     * TRACE level logging
     */
    trace(message: string, metadata?: any): void;
    /**
     * DEBUG level logging
     */
    debug(message: string, metadata?: any): void;
    /**
     * INFO level logging
     */
    info(message: string, metadata?: any): void;
    /**
     * WARN level logging
     */
    warn(message: string, metadata?: any): void;
    /**
     * ERROR level logging
     */
    error(message: string, error?: any, metadata?: any): void;
    /**
     * FATAL level logging
     */
    fatal(message: string, error?: any, metadata?: any): void;
    /**
     * Create a child logger with additional context
     */
    child(context: Record<string, any>): ILogger;
    /**
     * Flush all transports
     */
    flush(): Promise<void>;
    /**
     * Close all transports
     */
    close(): Promise<void>;
}
/**
 * Create a new logger instance
 */
export declare function createLogger(config: LoggerConfig): ILogger;

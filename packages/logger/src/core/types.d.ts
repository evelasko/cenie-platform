/**
 * Log levels in order of severity
 */
export declare enum LogLevel {
    TRACE = 0,
    DEBUG = 10,
    INFO = 20,
    WARN = 30,
    ERROR = 40,
    FATAL = 50
}
/**
 * Log level names
 */
export type LogLevelName = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';
/**
 * Environment types
 */
export type Environment = 'development' | 'production' | 'test';
/**
 * Log entry structure
 */
export interface LogEntry {
    timestamp: string;
    level: LogLevelName;
    message: string;
    context: LogContext;
    error?: ErrorInfo;
    metadata?: Record<string, any>;
}
/**
 * Context included in every log entry
 */
export interface LogContext {
    app: string;
    environment: Environment;
    requestId?: string;
    userId?: string;
    sessionId?: string;
    [key: string]: any;
}
/**
 * Serialized error information
 */
export interface ErrorInfo {
    name: string;
    message: string;
    stack?: string;
    code?: string | number;
    cause?: ErrorInfo;
    [key: string]: any;
}
/**
 * Logger configuration
 */
export interface LoggerConfig {
    name: string;
    level?: LogLevel | LogLevelName;
    environment?: Environment;
    context?: Record<string, any>;
    transports?: Transport[];
    redact?: string[];
    prettyPrint?: boolean;
}
/**
 * Transport interface for outputting logs
 */
export interface Transport {
    write(entry: LogEntry): void | Promise<void>;
    flush?(): void | Promise<void>;
    close?(): void | Promise<void>;
}
/**
 * Logger interface
 */
export interface ILogger {
    trace(message: string, metadata?: any): void;
    debug(message: string, metadata?: any): void;
    info(message: string, metadata?: any): void;
    warn(message: string, metadata?: any): void;
    error(message: string, error?: any, metadata?: any): void;
    fatal(message: string, error?: any, metadata?: any): void;
    child(context: Record<string, any>): ILogger;
}

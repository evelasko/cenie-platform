"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
exports.createLogger = createLogger;
/* eslint-disable @typescript-eslint/no-explicit-any */
const async_context_1 = require("../context/async-context");
const sanitizer_1 = require("../utils/sanitizer");
const serializer_1 = require("../utils/serializer");
const levels_1 = require("./levels");
const types_1 = require("./types");
/**
 * Core Logger implementation
 */
class Logger {
    name;
    level;
    environment;
    transports;
    redactFields;
    prettyPrint;
    defaultContext;
    constructor(config) {
        this.name = config.name;
        this.level = (0, levels_1.parseLogLevel)(config.level ?? types_1.LogLevel.INFO);
        this.environment = config.environment ?? this.detectEnvironment();
        this.transports = config.transports ?? [];
        this.redactFields = [...sanitizer_1.DEFAULT_REDACT_FIELDS, ...(config.redact ?? [])];
        this.prettyPrint = config.prettyPrint ?? this.environment === 'development';
        this.defaultContext = config.context ?? {};
    }
    /**
     * Detect environment from NODE_ENV
     */
    detectEnvironment() {
        const env = process.env.NODE_ENV;
        if (env === 'production')
            return 'production';
        if (env === 'test')
            return 'test';
        return 'development';
    }
    /**
     * Create a log entry
     */
    createLogEntry(level, message, error, metadata) {
        // Build context from multiple sources
        const asyncContext = async_context_1.logContext.getAll();
        const context = {
            app: this.name,
            environment: this.environment,
            ...this.defaultContext,
            ...asyncContext,
        };
        const entry = {
            timestamp: new Date().toISOString(),
            level,
            message,
            context,
        };
        // Add error if provided
        if (error) {
            entry.error = (0, serializer_1.serializeError)(error);
        }
        // Add metadata if provided
        if (metadata) {
            const serialized = (0, serializer_1.serialize)(metadata);
            entry.metadata = (0, sanitizer_1.sanitize)(serialized, this.redactFields);
        }
        return entry;
    }
    /**
     * Write log entry to all transports
     */
    async write(entry) {
        const promises = this.transports.map((transport) => transport.write(entry));
        await Promise.all(promises);
    }
    /**
     * Log at a specific level
     */
    log(level, message, error, metadata) {
        if (!(0, levels_1.shouldLog)(level, this.level)) {
            return;
        }
        const levelName = (0, levels_1.getLogLevelName)(level);
        const entry = this.createLogEntry(levelName, message, error, metadata);
        // Write to transports (async but don't block)
        void this.write(entry);
    }
    /**
     * TRACE level logging
     */
    trace(message, metadata) {
        this.log(types_1.LogLevel.TRACE, message, undefined, metadata);
    }
    /**
     * DEBUG level logging
     */
    debug(message, metadata) {
        this.log(types_1.LogLevel.DEBUG, message, undefined, metadata);
    }
    /**
     * INFO level logging
     */
    info(message, metadata) {
        this.log(types_1.LogLevel.INFO, message, undefined, metadata);
    }
    /**
     * WARN level logging
     */
    warn(message, metadata) {
        this.log(types_1.LogLevel.WARN, message, undefined, metadata);
    }
    /**
     * ERROR level logging
     */
    error(message, error, metadata) {
        this.log(types_1.LogLevel.ERROR, message, error, metadata);
    }
    /**
     * FATAL level logging
     */
    fatal(message, error, metadata) {
        this.log(types_1.LogLevel.FATAL, message, error, metadata);
    }
    /**
     * Create a child logger with additional context
     */
    child(context) {
        return new Logger({
            name: this.name,
            level: this.level,
            environment: this.environment,
            context: { ...this.defaultContext, ...context },
            transports: this.transports,
            redact: this.redactFields,
            prettyPrint: this.prettyPrint,
        });
    }
    /**
     * Flush all transports
     */
    async flush() {
        const promises = this.transports.filter((t) => t.flush).map((t) => t.flush());
        await Promise.all(promises);
    }
    /**
     * Close all transports
     */
    async close() {
        const promises = this.transports.filter((t) => t.close).map((t) => t.close());
        await Promise.all(promises);
    }
}
exports.Logger = Logger;
/**
 * Create a new logger instance
 */
function createLogger(config) {
    return new Logger(config);
}
//# sourceMappingURL=logger.js.map
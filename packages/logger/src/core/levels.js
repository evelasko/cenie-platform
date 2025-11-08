"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LOG_LEVEL_NAMES = exports.LOG_LEVEL_MAP = void 0;
exports.parseLogLevel = parseLogLevel;
exports.getLogLevelName = getLogLevelName;
exports.shouldLog = shouldLog;
const types_1 = require("./types");
/**
 * Map log level names to numeric values
 */
exports.LOG_LEVEL_MAP = {
    trace: types_1.LogLevel.TRACE,
    debug: types_1.LogLevel.DEBUG,
    info: types_1.LogLevel.INFO,
    warn: types_1.LogLevel.WARN,
    error: types_1.LogLevel.ERROR,
    fatal: types_1.LogLevel.FATAL,
};
/**
 * Map numeric log levels to names
 */
exports.LOG_LEVEL_NAMES = {
    [types_1.LogLevel.TRACE]: 'trace',
    [types_1.LogLevel.DEBUG]: 'debug',
    [types_1.LogLevel.INFO]: 'info',
    [types_1.LogLevel.WARN]: 'warn',
    [types_1.LogLevel.ERROR]: 'error',
    [types_1.LogLevel.FATAL]: 'fatal',
};
/**
 * Convert log level name or number to LogLevel enum
 */
function parseLogLevel(level) {
    if (typeof level === 'number') {
        return level;
    }
    const levelName = level.toLowerCase();
    return exports.LOG_LEVEL_MAP[levelName] ?? types_1.LogLevel.INFO;
}
/**
 * Get log level name from numeric level
 */
function getLogLevelName(level) {
    return exports.LOG_LEVEL_NAMES[level] ?? 'info';
}
/**
 * Check if a log level should be logged based on minimum level
 */
function shouldLog(level, minLevel) {
    return level >= minLevel;
}
//# sourceMappingURL=levels.js.map
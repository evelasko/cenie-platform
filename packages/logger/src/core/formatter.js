"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatPretty = formatPretty;
exports.formatJson = formatJson;
exports.formatLog = formatLog;
const chalk_1 = __importDefault(require("chalk"));
const serializer_1 = require("../utils/serializer");
/**
 * Color map for log levels
 */
const LEVEL_COLORS = {
    trace: chalk_1.default.gray,
    debug: chalk_1.default.cyan,
    info: chalk_1.default.green,
    warn: chalk_1.default.yellow,
    error: chalk_1.default.red,
    fatal: chalk_1.default.bgRed.white,
};
/**
 * Format log entry as pretty-printed console output
 */
function formatPretty(entry) {
    const { timestamp, level, message, context, error, metadata } = entry;
    const colorFn = LEVEL_COLORS[level] || chalk_1.default.white;
    const levelStr = colorFn(level.toUpperCase().padEnd(5));
    const timeStr = chalk_1.default.gray(new Date(timestamp).toISOString());
    let output = `${timeStr} ${levelStr} [${chalk_1.default.blue(context.app)}] ${message}`;
    // Add request ID if available
    if (context.requestId) {
        output += chalk_1.default.gray(` (${context.requestId.substring(0, 8)})`);
    }
    // Add metadata if present
    if (metadata && Object.keys(metadata).length > 0) {
        output += '\n' + chalk_1.default.gray((0, serializer_1.safeJsonStringify)(metadata, 2));
    }
    // Add error details if present
    if (error) {
        output += '\n' + formatError(error);
    }
    return output;
}
/**
 * Format log entry as JSON
 */
function formatJson(entry) {
    return (0, serializer_1.safeJsonStringify)(entry);
}
/**
 * Format error for pretty printing
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatError(error) {
    let output = chalk_1.default.red(`  ${error.name}: ${error.message}`);
    if (error.code) {
        output += chalk_1.default.gray(` [${error.code}]`);
    }
    if (error.stack) {
        // Format stack trace with indentation
        const stackLines = error.stack.split('\n').slice(1); // Skip first line (already shown)
        output += '\n' + stackLines.map((line) => chalk_1.default.gray('    ' + line.trim())).join('\n');
    }
    if (error.cause) {
        output += '\n' + chalk_1.default.gray('  Caused by:');
        output += '\n' + formatError(error.cause);
    }
    return output;
}
/**
 * Format log entry based on environment
 */
function formatLog(entry, prettyPrint) {
    return prettyPrint ? formatPretty(entry) : formatJson(entry);
}
//# sourceMappingURL=formatter.js.map
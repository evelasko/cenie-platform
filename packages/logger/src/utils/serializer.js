"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serialize = serialize;
exports.serializeError = serializeError;
exports.safeJsonStringify = safeJsonStringify;
const fast_safe_stringify_1 = __importDefault(require("fast-safe-stringify"));
/**
 * Maximum depth for nested objects
 */
const MAX_DEPTH = 10;
/**
 * Maximum string length for truncation
 */
const MAX_STRING_LENGTH = 10000;
/**
 * Safely serialize any value to a JSON-serializable format
 */
function serialize(value, depth = 0) {
    // Prevent infinite recursion
    if (depth > MAX_DEPTH) {
        return '[Max Depth Reached]';
    }
    // Handle null and undefined
    if (value === null)
        return null;
    if (value === undefined)
        return undefined;
    // Handle primitives
    if (typeof value === 'string') {
        return value.length > MAX_STRING_LENGTH
            ? value.substring(0, MAX_STRING_LENGTH) + '...[truncated]'
            : value;
    }
    if (typeof value === 'number' || typeof value === 'boolean') {
        return value;
    }
    // Handle Date
    if (value instanceof Date) {
        return value.toISOString();
    }
    // Handle Error
    if (value instanceof Error) {
        return serializeError(value);
    }
    // Handle Arrays
    if (Array.isArray(value)) {
        return value.map((item) => serialize(item, depth + 1));
    }
    // Handle Buffer
    if (Buffer.isBuffer(value)) {
        return `[Buffer ${value.length} bytes]`;
    }
    // Handle Functions
    if (typeof value === 'function') {
        return `[Function ${value.name || 'anonymous'}]`;
    }
    // Handle Objects
    if (typeof value === 'object') {
        const serialized = {};
        for (const [key, val] of Object.entries(value)) {
            try {
                serialized[key] = serialize(val, depth + 1);
            }
            catch {
                serialized[key] = '[Serialization Error]';
            }
        }
        return serialized;
    }
    // Fallback
    return String(value);
}
/**
 * Serialize an error object with stack trace
 */
function serializeError(error) {
    if (!(error instanceof Error)) {
        return { message: String(error) };
    }
    const serialized = {
        name: error.name,
        message: error.message,
    };
    // Include stack trace if available
    if (error.stack) {
        serialized.stack = error.stack;
    }
    // Include error code if available
    if ('code' in error) {
        serialized.code = error.code;
    }
    // Include status code if available
    if ('statusCode' in error) {
        serialized.statusCode = error.statusCode;
    }
    // Include cause if available (Error.cause)
    if ('cause' in error && error.cause) {
        serialized.cause = serializeError(error.cause);
    }
    // Include any other custom properties
    for (const key of Object.keys(error)) {
        if (!['name', 'message', 'stack'].includes(key)) {
            try {
                serialized[key] = serialize(error[key]);
            }
            catch {
                // Skip properties that can't be serialized
            }
        }
    }
    return serialized;
}
/**
 * Safe JSON stringify with circular reference handling
 */
function safeJsonStringify(value, indent) {
    try {
        return (0, fast_safe_stringify_1.default)(value, undefined, indent);
    }
    catch {
        return '[Serialization Failed]';
    }
}
//# sourceMappingURL=serializer.js.map
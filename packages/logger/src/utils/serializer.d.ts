/**
 * Safely serialize any value to a JSON-serializable format
 */
export declare function serialize(value: any, depth?: number): any;
/**
 * Serialize an error object with stack trace
 */
export declare function serializeError(error: any): any;
/**
 * Safe JSON stringify with circular reference handling
 */
export declare function safeJsonStringify(value: any, indent?: number): string;

import type { LogEntry } from './types';
/**
 * Format log entry as pretty-printed console output
 */
export declare function formatPretty(entry: LogEntry): string;
/**
 * Format log entry as JSON
 */
export declare function formatJson(entry: LogEntry): string;
/**
 * Format log entry based on environment
 */
export declare function formatLog(entry: LogEntry, prettyPrint: boolean): string;

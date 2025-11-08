import type { Transport, LogEntry } from '../core/types';
/**
 * Console transport configuration
 */
export interface ConsoleTransportConfig {
    prettyPrint?: boolean;
}
/**
 * Console transport - writes logs to stdout/stderr
 */
export declare class ConsoleTransport implements Transport {
    private readonly prettyPrint;
    constructor(config?: ConsoleTransportConfig);
    write(entry: LogEntry): void;
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsoleTransport = void 0;
const formatter_1 = require("../core/formatter");
/**
 * Console transport - writes logs to stdout/stderr
 */
class ConsoleTransport {
    prettyPrint;
    constructor(config = {}) {
        this.prettyPrint = config.prettyPrint ?? process.env.NODE_ENV === 'development';
    }
    write(entry) {
        const output = (0, formatter_1.formatLog)(entry, this.prettyPrint);
        // Use stderr for errors, stdout for everything else
        if (entry.level === 'error' || entry.level === 'fatal') {
            console.error(output);
        }
        else {
            console.log(output);
        }
    }
}
exports.ConsoleTransport = ConsoleTransport;
//# sourceMappingURL=console.js.map
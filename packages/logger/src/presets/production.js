"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productionPreset = productionPreset;
const types_1 = require("../core/types");
const console_1 = require("../transports/console");
/**
 * Production preset configuration
 * - INFO level logging (less verbose)
 * - JSON formatted output (for log aggregation)
 * - Console transport
 */
function productionPreset(name, context) {
    return {
        name,
        level: types_1.LogLevel.INFO,
        environment: 'production',
        context,
        transports: [new console_1.ConsoleTransport({ prettyPrint: false })],
        prettyPrint: false,
    };
}
//# sourceMappingURL=production.js.map
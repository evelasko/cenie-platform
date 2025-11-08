"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.developmentPreset = developmentPreset;
const types_1 = require("../core/types");
const console_1 = require("../transports/console");
/**
 * Development preset configuration
 * - DEBUG level logging
 * - Pretty printed output
 * - Console transport
 */
function developmentPreset(name, context) {
    return {
        name,
        level: types_1.LogLevel.DEBUG,
        environment: 'development',
        context,
        transports: [new console_1.ConsoleTransport({ prettyPrint: true })],
        prettyPrint: true,
    };
}
//# sourceMappingURL=development.js.map
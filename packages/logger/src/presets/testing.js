"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testingPreset = testingPreset;
const types_1 = require("../core/types");
/**
 * Testing preset configuration
 * - WARN level (minimal output during tests)
 * - No transports (silent by default)
 * - Can be overridden for specific tests
 */
function testingPreset(name, context) {
    return {
        name,
        level: types_1.LogLevel.WARN,
        environment: 'test',
        context,
        transports: [], // Silent by default
        prettyPrint: false,
    };
}
//# sourceMappingURL=testing.js.map
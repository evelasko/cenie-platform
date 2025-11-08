"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeJsonStringify = exports.serializeError = exports.serialize = exports.maskCreditCard = exports.maskEmail = exports.DEFAULT_REDACT_FIELDS = exports.sanitize = exports.ContextKeys = exports.logContext = exports.testingPreset = exports.productionPreset = exports.developmentPreset = exports.ConsoleTransport = exports.shouldLog = exports.getLogLevelName = exports.parseLogLevel = exports.LogLevel = exports.createLogger = exports.Logger = void 0;
// Core exports
var logger_1 = require("./core/logger");
Object.defineProperty(exports, "Logger", { enumerable: true, get: function () { return logger_1.Logger; } });
Object.defineProperty(exports, "createLogger", { enumerable: true, get: function () { return logger_1.createLogger; } });
var types_1 = require("./core/types");
Object.defineProperty(exports, "LogLevel", { enumerable: true, get: function () { return types_1.LogLevel; } });
// Levels
var levels_1 = require("./core/levels");
Object.defineProperty(exports, "parseLogLevel", { enumerable: true, get: function () { return levels_1.parseLogLevel; } });
Object.defineProperty(exports, "getLogLevelName", { enumerable: true, get: function () { return levels_1.getLogLevelName; } });
Object.defineProperty(exports, "shouldLog", { enumerable: true, get: function () { return levels_1.shouldLog; } });
// Transports
var console_1 = require("./transports/console");
Object.defineProperty(exports, "ConsoleTransport", { enumerable: true, get: function () { return console_1.ConsoleTransport; } });
// Presets
var presets_1 = require("./presets");
Object.defineProperty(exports, "developmentPreset", { enumerable: true, get: function () { return presets_1.developmentPreset; } });
Object.defineProperty(exports, "productionPreset", { enumerable: true, get: function () { return presets_1.productionPreset; } });
Object.defineProperty(exports, "testingPreset", { enumerable: true, get: function () { return presets_1.testingPreset; } });
// Context
var async_context_1 = require("./context/async-context");
Object.defineProperty(exports, "logContext", { enumerable: true, get: function () { return async_context_1.logContext; } });
Object.defineProperty(exports, "ContextKeys", { enumerable: true, get: function () { return async_context_1.ContextKeys; } });
// Utils
var sanitizer_1 = require("./utils/sanitizer");
Object.defineProperty(exports, "sanitize", { enumerable: true, get: function () { return sanitizer_1.sanitize; } });
Object.defineProperty(exports, "DEFAULT_REDACT_FIELDS", { enumerable: true, get: function () { return sanitizer_1.DEFAULT_REDACT_FIELDS; } });
Object.defineProperty(exports, "maskEmail", { enumerable: true, get: function () { return sanitizer_1.maskEmail; } });
Object.defineProperty(exports, "maskCreditCard", { enumerable: true, get: function () { return sanitizer_1.maskCreditCard; } });
var serializer_1 = require("./utils/serializer");
Object.defineProperty(exports, "serialize", { enumerable: true, get: function () { return serializer_1.serialize; } });
Object.defineProperty(exports, "serializeError", { enumerable: true, get: function () { return serializer_1.serializeError; } });
Object.defineProperty(exports, "safeJsonStringify", { enumerable: true, get: function () { return serializer_1.safeJsonStringify; } });
//# sourceMappingURL=index.js.map
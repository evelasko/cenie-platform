"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_REDACT_FIELDS = void 0;
exports.sanitize = sanitize;
exports.maskEmail = maskEmail;
exports.maskCreditCard = maskCreditCard;
/**
 * Default fields to redact for PII protection
 */
exports.DEFAULT_REDACT_FIELDS = [
    'password',
    'token',
    'apiKey',
    'api_key',
    'secret',
    'authorization',
    'cookie',
    'creditCard',
    'credit_card',
    'ssn',
    'privateKey',
    'private_key',
    'accessToken',
    'access_token',
    'refreshToken',
    'refresh_token',
    'idToken',
    'id_token',
];
/**
 * Redaction marker
 */
const REDACTED = '[REDACTED]';
/**
 * Check if a key should be redacted
 */
function shouldRedact(key, redactFields) {
    const lowerKey = key.toLowerCase();
    return redactFields.some((field) => lowerKey.includes(field.toLowerCase()));
}
/**
 * Sanitize an object by redacting sensitive fields
 */
function sanitize(obj, redactFields = exports.DEFAULT_REDACT_FIELDS) {
    if (obj === null || obj === undefined) {
        return obj;
    }
    // Handle primitives
    if (typeof obj !== 'object') {
        return obj;
    }
    // Handle Date objects
    if (obj instanceof Date) {
        return obj;
    }
    // Handle arrays
    if (Array.isArray(obj)) {
        return obj.map((item) => sanitize(item, redactFields));
    }
    // Handle objects
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
        if (shouldRedact(key, redactFields)) {
            sanitized[key] = REDACTED;
        }
        else if (value && typeof value === 'object') {
            sanitized[key] = sanitize(value, redactFields);
        }
        else {
            sanitized[key] = value;
        }
    }
    return sanitized;
}
/**
 * Mask email addresses (keep first 3 chars + domain)
 */
function maskEmail(email) {
    const parts = email.split('@');
    if (parts.length !== 2)
        return email;
    const [local, domain] = parts;
    const masked = local.length > 3 ? local.substring(0, 3) + '***' : '***';
    return `${masked}@${domain}`;
}
/**
 * Mask credit card numbers (keep last 4 digits)
 */
function maskCreditCard(cardNumber) {
    const cleaned = cardNumber.replace(/\s/g, '');
    if (cleaned.length < 4)
        return '****';
    return '****' + cleaned.slice(-4);
}
//# sourceMappingURL=sanitizer.js.map
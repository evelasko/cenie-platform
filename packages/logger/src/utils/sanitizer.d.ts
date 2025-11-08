/**
 * Default fields to redact for PII protection
 */
export declare const DEFAULT_REDACT_FIELDS: string[];
/**
 * Sanitize an object by redacting sensitive fields
 */
export declare function sanitize(obj: any, redactFields?: string[]): any;
/**
 * Mask email addresses (keep first 3 chars + domain)
 */
export declare function maskEmail(email: string): string;
/**
 * Mask credit card numbers (keep last 4 digits)
 */
export declare function maskCreditCard(cardNumber: string): string;

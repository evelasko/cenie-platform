import { config } from 'dotenv';
import { defineSecret } from 'firebase-functions/params';

// Load .env.local for emulator/local development
if (process.env.FUNCTIONS_EMULATOR === 'true') {
  config({ path: '.env.local' });
  console.log('📋 Loaded .env.local for local development');
}

// Define secrets for production deployment
// These will be accessed from Firebase Secret Manager
export const OPENAI_API_KEY = defineSecret('OPENAI_API_KEY');
export const ANTHROPIC_API_KEY = defineSecret('ANTHROPIC_API_KEY');

/**
 * Helper to safely get environment variables
 * Works in both local emulator and production environments
 */
export function getEnvVar(key: string, required = true): string | undefined {
  const value = process.env[key];
  
  if (!value && required) {
    throw new Error(
      `Missing required environment variable: ${key}. ` +
      `In production, set with: firebase functions:secrets:set ${key}`
    );
  }
  
  return value;
}

/**
 * Check if running in emulator
 */
export function isEmulator(): boolean {
  return process.env.FUNCTIONS_EMULATOR === 'true';
}

/**
 * Get the current environment
 */
export function getEnvironment(): 'development' | 'production' {
  return isEmulator() ? 'development' : 'production';
}


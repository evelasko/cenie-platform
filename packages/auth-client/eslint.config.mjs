import { baseConfig } from '../eslint-config/src/base.js';

export default [
  ...baseConfig,
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    rules: {
      // API client specific rules
      'no-console': ['error', { allow: ['warn', 'error'] }], // Stricter console usage
      
      // Security rules for authentication client
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      
      // Async/await patterns for API calls
      'no-await-in-loop': 'warn',
      'prefer-promise-reject-errors': 'error',
      'require-atomic-updates': 'error',
      
      // Import rules for API client
      'import/no-default-export': 'error',
      'import/prefer-default-export': 'off',
      
      // Error handling for API operations
      'no-throw-literal': 'error',
      
      // Authentication client specific async patterns
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      
      // Network/API patterns
      'prefer-promise-reject-errors': 'error',
      
      // Type safety for API responses
      '@typescript-eslint/strict-boolean-expressions': 'warn',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
    },
  },
];
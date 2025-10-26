// import { reactConfig } from '../eslint-config/src/react.js'
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import importPlugin from 'eslint-plugin-import'
import eslintConfigPrettier from 'eslint-config-prettier'

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
  // ...reactConfig,
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    rules: {
      // Component library specific rules
      'react/display-name': 'error', // Important for debugging components
      'react/prop-types': 'off', // Using TypeScript instead
      'react/jsx-no-leaked-render': 'error',

      // Enforce consistent exports for component library
      'import/prefer-default-export': 'off',
      'import/no-default-export': 'error',

      // Accessibility is crucial for UI components
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/aria-props': 'error',
      'jsx-a11y/role-has-required-aria-props': 'error',
      'jsx-a11y/role-supports-aria-props': 'error',

      // TypeScript strict rules for component library
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/prefer-as-const': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
    },
  },
  {
    files: ['**/*.stories.tsx', '**/*.test.tsx', '**/*.spec.tsx'],
    rules: {
      // Relax rules for test and story files
      'import/no-default-export': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
]

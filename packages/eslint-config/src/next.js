import { reactConfig } from './react.js';

export const nextConfig = [
  ...reactConfig,
  {
    rules: {
      // Next.js specific rules (simplified without Next.js plugin for packages)
      'react/display-name': 'off',
      
      // Allow default exports in Next.js app directory
      'import/no-default-export': 'off',
      
      // Override some strict rules for Next.js
      '@typescript-eslint/no-empty-interface': 'off',
    },
  },
  {
    files: ['**/app/**/*.tsx', '**/app/**/*.ts', '**/pages/**/*.tsx', '**/pages/**/*.ts'],
    rules: {
      'import/no-default-export': 'off',
    },
  },
];

export default nextConfig;
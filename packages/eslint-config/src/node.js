import { baseConfig } from './base.js';

export const nodeConfig = [
  ...baseConfig,
  {
    env: {
      node: true,
      es2022: true,
    },
    rules: {
      // Node.js specific rules
      'no-process-exit': 'error',
      'no-sync': 'warn',
      'handle-callback-err': 'error',
      
      // Async/await patterns
      'no-await-in-loop': 'warn',
      'prefer-promise-reject-errors': 'error',
      'require-atomic-updates': 'error',
      
      // Security considerations
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-script-url': 'error',
      
      // Error handling
      'no-throw-literal': 'error',
      'prefer-promise-reject-errors': 'error',
    },
  },
];

export default nodeConfig;
import eslintJS from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';

// Централизирана ESLint конфигурация за BrainBox
export default tseslint.config(
  eslintJS.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      // TypeScript специфични
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      
      // General Code Quality
      'no-console': 'off',
      'prefer-const': 'error',
      'no-var': 'error',
      'no-undef': 'off', // TypeScript handles this better
    },
  },
  {
    files: ['scripts/**/*.ts', 'scripts/**/*.js', 'scratch/**/*.js'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      'no-console': 'off'
    }
  },
  {
    ignores: ['node_modules/', '.next/', 'dist/', 'brainbox/']
  }
);

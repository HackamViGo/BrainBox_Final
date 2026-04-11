import eslintJS from '@eslint/js';
import tseslint from 'typescript-eslint';

// Use a basic flat config since we are not installing external peer deps
export default tseslint.config(
  eslintJS.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  }
);

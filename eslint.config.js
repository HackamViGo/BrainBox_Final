import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default tseslint.config(
  {
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/dist/**",
      "**/out/**",
      "**/public/**",
      "eslint.config.js",
      "**/*.config.js",
      "**/ref/**",
      "**/scratch/**",
      "**/.wxt/**",
      "**/.output/**"
    ]
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    // Application files requiring tsconfig.json
    files: [
      'apps/**/*.ts', 
      'apps/**/*.tsx', 
      'packages/**/*.ts', 
      'packages/**/*.tsx',
      'scripts/**/*.ts'
    ],
    languageOptions: {
      parserOptions: {
        project: true,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { 
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_'
        }
      ],
      'no-console': ['error', { allow: ['warn', 'error'] }],
    },
  },
  {
    // Tests and config files that don't need project context or have separate types
    files: [
      '**/tests/**/*.ts', 
      '**/__tests__/**/*.ts',
      '**/*.spec.ts',
      '**/*.test.ts',
      '**/*.config.ts',
      '**/*.config.js'
    ],
    languageOptions: {
      parserOptions: {
        project: null,
      },
    },
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    }
  },
  prettier,
);

import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  /* Global ignores (must be the only key in this config object to apply project-wide) */
  {
    ignores: [
      'node_modules',
      'dist',
      'dist-ssr',
      'build',
      'coverage',
      '*.d.ts',
      '*.min.js',
      '*.tsbuildinfo',
      'backend-setup',
    ],
  },

  /* Global configuration */
  {
    linterOptions: {
      /* Flags stale `// eslint-disable` comments that no longer suppress anything. */
      reportUnusedDisableDirectives: 'error',
    },
  },

  /* JavaScript recommended rules */
  js.configs.recommended,

  /* TypeScript recommended rules */
  ...tseslint.configs.recommended,

  /* Additional TypeScript strict rules */
  ...tseslint.configs.strict,

  /* TypeScript stylistic rules */
  ...tseslint.configs.stylistic,

  /* Type-aware TypeScript + React rules */
  {
    files: ['**/*.{ts,tsx}'],

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },

    settings: { react: { version: '19.2.5' } },

    extends: [
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
      react.configs.flat.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],

    plugins: { 'simple-import-sort': simpleImportSort },

    rules: {
      /* React 17+ JSX transform */
      'react/react-in-jsx-scope': 'off',

      /* TypeScript handles props typing */
      'react/prop-types': 'off',

      /* Import & Export sorting */
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',

      'sort-imports': 'off',

      /* TypeScript */
      '@typescript-eslint/consistent-type-imports': 'error',

      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],

      '@typescript-eslint/no-explicit-any': 'warn',

      /* Async */
      '@typescript-eslint/await-thenable': 'error',

      '@typescript-eslint/no-floating-promises': 'error',

      // React event handlers (onClick, onSubmit, buttonProps={{ onClick }}, ...) are allowed to
      // be async and ignore the returned promise - that's the standard, safe React pattern.
      '@typescript-eslint/no-misused-promises': [
        'error',
        { checksVoidReturn: { attributes: false, properties: false } },
      ],

      '@typescript-eslint/require-await': 'error',

      /* JavaScript */
      'no-console': ['warn', { allow: ['warn', 'error'] }],

      'no-debugger': 'error',

      /* Best Practices */
      eqeqeq: ['error', 'always'],

      curly: ['error', 'all'],
    },
  },

  /* Disable formatting rules handled by Prettier */
  prettier,
);

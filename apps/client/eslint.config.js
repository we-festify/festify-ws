import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import importPlugin from 'eslint-plugin-import';
import { fixupPluginRules } from '@eslint/compat';
import checkfilePlugin from 'eslint-plugin-check-file';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      prettier: eslintPluginPrettier,
      import: fixupPluginRules(importPlugin),
      'check-file': checkfilePlugin,
    },
    ignores: [
      'dist',
      'node_modules',
      'coverage',
      'build',
      'public',
      '*.test.*',
      '*.spec.*',
      'src/stories/*',
    ],
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'import/no-restricted-paths': [
        'error',
        {
          zones: [
            // disables cross-feature imports:
            {
              target: './src/packages',
              from: './src/packages',
            },

            // enforce unidirectional codebase:
            // app is allowed to import from features
            // but features are not allowed to import from app
            {
              target: './src/packages',
              from: './src/*',
            },
            // features and app are allowed to import from components, hooks, lib, types, and utils
            // but not the other way around
            {
              target: [
                './src/components',
                './src/hooks',
                './src/lib',
                './src/types',
                './src/utils',
              ],
              from: ['./src/features', './src/app'],
            },
          ],
        },
      ],
      'check-file/filename-naming-convention': [
        'error',
        {
          // for non hooks, allow KebabCase
          '**/!(use*).{tsx,jsx,ts,js}': 'KEBAB_CASE',
          // for hooks, allow CamelCase
          '**/use*.{tsx,jsx}': ['CAMEL_CASE', 'KEBAB_CASE'],
        },
        {
          // ignore the middle extensions of the filename to support filename like bable.config.js or smoke.spec.ts
          ignoreMiddleExtensions: true,
        },
      ],
      'check-file/folder-naming-convention': [
        'error',
        {
          // all folders within src (except __tests__)should be named in kebab-case
          'src/**/!(__tests__)': 'KEBAB_CASE',
        },
      ],

      // Prettier
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
        },
      ],

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
  },
);

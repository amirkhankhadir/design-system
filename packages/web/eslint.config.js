import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
  // Base JS rules
  js.configs.recommended,

  // TypeScript rules
  ...tseslint.configs.recommended,

  // React + Hooks
  {
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    settings: {
      react: { version: '18.3' },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,

      // React 17+ JSX transform — no need to import React
      'react/react-in-jsx-scope': 'off',
      // TypeScript covers prop-types
      'react/prop-types': 'off',
      // Allow explicit `any` in rare cases with a comment
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },

  // Prettier last — disables conflicting formatting rules
  prettierConfig,

  // Ignore build output and generated files
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
);

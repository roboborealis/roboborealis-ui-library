import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': 'error',
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
  },
  // Storybook stories use hooks in render() functions — this is the standard
  // Storybook pattern and triggers false positives for rules-of-hooks. Demo
  // interaction handlers (e.g. onClick: () => console.log(...)) are also
  // expected here — stories aren't production code.
  {
    files: ['src/**/*.stories.{ts,tsx}'],
    rules: {
      'react-hooks/rules-of-hooks': 'off',
      'react-hooks/exhaustive-deps': 'off',
      'no-console': 'off',
    },
  },
  // Test files: relax rules that conflict with test patterns
  {
    files: ['src/**/*.test.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-this-alias': 'off',
    },
  },
  // Starter templates are copy/customize scaffolding for consuming apps —
  // a placeholder console.log marking a spot to wire up real logic is
  // intentional, not a leftover.
  {
    files: ['src/templates/**/*.{ts,tsx}'],
    rules: {
      'no-console': 'off',
    },
  },
  {
    ignores: [
      'dist/**',
      'coverage/**',
      'node_modules/**',
      'designer/**',
      'storybook-static/**',
      'components/**',
      'design-tokens/**',
    ],
  },
];

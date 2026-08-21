import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import eslintReact from '@eslint-react/eslint-plugin';

// React rules — @eslint-react (flat-config native, eslint 10 compatible),
// replacing the retired eslint-plugin-react. Introduced non-breaking on this
// established 200+ component codebase: its recommended rules run at WARN, not
// CI-blocking error, so issues surface without a big-bang cleanup. Promote
// individual rules to 'error' over time. Hook rules stay owned by
// eslint-plugin-react-hooks, so @eslint-react's overlapping ones are disabled.
const reactRecommended = eslintReact.configs['recommended-typescript'];
const HOOK_OVERLAP = new Set([
  '@eslint-react/rules-of-hooks',
  '@eslint-react/exhaustive-deps',
]);
const reactRulesAsWarn = Object.fromEntries(
  Object.keys(reactRecommended.rules ?? {}).map((rule) => [
    rule,
    HOOK_OVERLAP.has(rule) ? 'off' : 'warn',
  ]),
);

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    ...reactRecommended,
    rules: reactRulesAsWarn,
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooksPlugin,
    },
    rules: {
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

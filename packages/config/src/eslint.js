import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export const baseConfig = tseslint.config([
  {
    ignores: ['**/dist/**', '**/node_modules/**', '**/coverage/**'],
  },
]);

export const nodeConfig = tseslint.config([
  ...baseConfig,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
  },
]);

export const reactConfig = (options = {}) => {
  const { strict = false } = options;
  
  return tseslint.config([
    ...baseConfig,
    {
      files: ['**/*.{jsx,tsx}'],
      extends: [
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:jsx-a11y/recommended',
        strict && 'plugin:react/jsx-runtime',
      ].filter(Boolean),
      settings: {
        react: {
          version: 'detect',
        },
      },
      languageOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        globals: {
          ...globals.browser,
        },
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
        },
      },
      rules: {
        'react/prop-types': 'off',
        'react/react-in-jsx-scope': 'off',
      },
    },
  ]);
};

export const typescriptConfig = tseslint.config([
  ...baseConfig,
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      'plugin:@typescript-eslint/recommended',
      'plugin:@typescript-eslint/stylistic',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      project: './tsconfig.json',
    },
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
]);

export const prettierConfig = {
  extends: ['prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
  },
};

export default tseslint.config([
  js.configs.recommended,
  ...typescriptConfig,
  ...reactConfig(),
  prettierConfig,
]);

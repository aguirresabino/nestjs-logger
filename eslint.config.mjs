// @ts-nocheck
import prettierConfig from 'eslint-config-prettier';
import jest from 'eslint-plugin-jest';
import tsEslint from 'typescript-eslint';

import eslint from '@eslint/js';
import tsEslintParser from '@typescript-eslint/parser';

export default tsEslint.config(
  eslint.configs.recommended,
  ...tsEslint.configs.recommended,
  ...tsEslint.configs.recommendedTypeChecked,
  ...tsEslint.configs.strict,
  prettierConfig,
  {
    ignores: [
      '.husky',
      'dist',
      'docs',
      'node_modules',
      '*.yml',
      'eslint.config.mjs',
      'jest.config*',
      '.prettierrc.js',
      '.prettierignore',
      '.gitignore',
      '.editorconfig',
      'commitlint.config.js',
      'nest-cli.json',
      'package.json',
      'tsconfig*',
      'yarn.lock',
      'test/coverage',
    ],
  },
  {
    languageOptions: {
      parser: tsEslintParser,
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ['test/**'],
    ...jest.configs['flat/all'],
    rules: {
      ...jest.configs['flat/all'].rules,
      'jest/prefer-expect-assertions': 'off',
      'jest/require-hook': 'off',
      'jest/prefer-lowercase-title': 'off',
      'jest/prefer-importing-jest-globals': 'off',
    },
  },
  {
    files: ['src/**', 'test/**'],
    rules: {
      'no-console': 'error',
      '@typescript-eslint/restrict-template-expressions': 'warn',
      '@typescript-eslint/no-base-to-string': 'warn',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/init-declarations': ['error', 'always'],
      '@typescript-eslint/no-for-in-array': ['error'],
      '@typescript-eslint/no-require-imports': 'error',
      '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/no-magic-numbers': [
        'error',
        {
          ignoreEnums: true,
          ignoreNumericLiteralTypes: true,
          ignoreReadonlyClassProperties: true,
        },
      ],
    },
  },
  {
    files: ['*.js'],
    ...tsEslint.configs.disableTypeChecked,
  }
);

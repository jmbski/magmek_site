// @ts-check

import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';

export default defineConfig(eslint.configs.recommended, tseslint.configs.recommended, {
    plugins: {
        '@stylistic': stylistic,
    },
    rules: {
        '@stylistic/indent': ['error', 4],
        '@stylistic/linebreak-style': ['error', 'unix'],
        '@stylistic/quotes': ['error', 'single'],
        '@stylistic/semi': ['error', 'always'],
        '@typescript-eslint/no-inferrable-types': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
    },
});

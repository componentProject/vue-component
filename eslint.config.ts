import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import globals from 'globals'
import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import pluginOxlint from 'eslint-plugin-oxlint'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

import pluginVitest from '@vitest/eslint-plugin'
import pluginCypress from 'eslint-plugin-cypress/flat'

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,mjs,jsx,ts,mts,tsx,vue}'],
  },

  globalIgnores([
    '**/dist/**',
    '**/dist-ssr/**',
    '**/coverage/**',
    '**/servers/**',
    '**/src/components/ConfigForm/**',
    '**/node_modules/**',
    '**/public/**',
    '**/package-lock.json',
    '**/yarn.lock',
    '**/pnpm-lock.yaml',
    '**/.history/**',
    '**/CHANGELOG*.md',
    '**/*.min.*',
    '**/LICENSE*',
    '**/__snapshots__/**',
    '**/auto-import?(s).d.ts',
    '**/components.d.ts',
  ]),
  vueTsConfigs.recommended,
  {
    languageOptions: {
      parserOptions: {
        parser: '@typescript-eslint/parser',
        ecmaVersion: 2020,
        ecmaFeatures: {
          jsx: true,
        },
        globals: {
          ...globals.browser,
          ...globals.node,
          myCustomGlobal: 'readonly',
        },
      },
    },
    files: ['src/components/**/*.{ts,mts,tsx,vue}'],
  },
  js.configs.recommended,
  pluginVue.configs['flat/essential'],
  ...pluginOxlint.configs['flat/recommended'],
  skipFormatting,

  {
    ...pluginVitest.configs.recommended,
    files: ['src/**/__tests__/*'],
  },

  {
    ...pluginCypress.configs.recommended,
    files: ['cypress/e2e/**/*.{cy,spec}.{js,ts,jsx,tsx}', 'cypress/support/**/*.{js,ts,jsx,tsx}'],
  },

  {
    name: 'ignores-rules',
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'vue/block-lang': 'off',
      'vue/multi-word-component-names': 'off',
      'no-duplicate-selectors': 'off',
      'vue/no-mutating-props': 'off',
    },
  },
)

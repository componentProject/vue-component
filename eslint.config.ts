import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import globals from 'globals'
import pluginVue from 'eslint-plugin-vue'
import pluginOxlint from 'eslint-plugin-oxlint'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default defineConfigWithVueTs(
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
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
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
  ]),

  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,
  ...pluginOxlint.configs['flat/recommended'],
  skipFormatting,

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

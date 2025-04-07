/*
 * @Author: moluoxixi 1983531544@qq.com
 * @Date: 2025-01-25 14:59:50
 * @LastEditors: moluoxixi 1983531544@qq.com
 * @LastEditTime: 2025-02-27 11:42:39
 * @FilePath: \vue-component\eslint.config.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import storybook from 'eslint-plugin-storybook'
import globals from 'globals'

// 兼容层（用于转换旧式配置到 Flat Config）
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
})
export default [
  {
    name: 'app/files-to-lint',
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
  // Vue + TypeScript 配置（通过兼容层转换）
  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  ...defineConfigWithVueTs(pluginVue.configs['flat/base'], vueTsConfigs.recommended),
  ...compat.extends('@vue/eslint-config-prettier/skip-formatting'),
  ...storybook.configs['flat/recommended'],
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'storybook/prefer-pascal-case': 'off',
      'vue/block-lang': 'off',
      'vue/multi-word-component-names': 'off',
      'no-duplicate-selectors': 'off',
      'vue/no-mutating-props': 'off',
    },
  },
]

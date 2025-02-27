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
import pluginVue from 'eslint-plugin-vue'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import storybook from 'eslint-plugin-storybook'

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },
  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'],
  },
  ...defineConfigWithVueTs(pluginVue.configs['flat/base'], vueTsConfigs.recommended),
  skipFormatting,
  ...storybook.configs['flat/recommended'],
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      'vue/block-lang': 'off',
    },
  },
]

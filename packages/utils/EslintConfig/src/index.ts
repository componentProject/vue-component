import type { OptionsConfig } from '@antfu/eslint-config'
// src入口文件
import type { createEslintConfigReturnType, optionsType, userConfigType } from './_types/index.ts'

import antfu from '@antfu/eslint-config'
import { deepMerge } from '@moluoxixi/utils/_utils/index.ts'

/**
 * 创建 ESLint 配置
 * @param config - 基础配置选项
 * @param userConfigs - 额外的用户配置，按序合并覆盖
 * @returns ESLint 配置数组
 */
export default function createEslintConfig(config: optionsType, ...userConfigs: userConfigType[]): createEslintConfigReturnType {
  const { ignores = [], ...otherOptions } = config
  return antfu(
    deepMerge({
      typescript: true,
      vue: true,
      yaml: true,
      formatters: true,
      ignores: [
        '.husky/**',
        '**/*.md',
        ...ignores,
      ],
      rules: {
        // 注释后是否强制一个空格
        'style/spaced-comment': ['error', 'always', {
          line: {
            // markers 列表中的标记，可以紧跟在 // 后，无需空格
            markers: [
              '#region',
              '#endregion',
            ],
          },
        }],
        // vue 组件块顺序
        'vue/block-order': ['error', {
          order: ['template', 'script', 'style'],
        }],
        //#region 不能在定义前使用变量
        'no-use-before-define': 'off',
        'ts/no-use-before-define': 'off',
        // JSON 排序
        'jsonc/sort-keys': 'off',
        // 不能使用console
        'no-console': 'off',
        // // 未使用的变量
        // 'unused-imports/no-unused-vars': 'off',
        // // 全局process
        // 'node/prefer-global/process': 'off',

        // //#region 是否强制使用三等号
        // 'eqeqeq': 'off',
        // 'vue/eqeqeq': 'off',
        // //#endregion

        //#endregion
        // // import 排序
        // 'perfectionist/sort-imports': 'off',

        // #region yaml
        // 'yaml/sort-keys': 'off',
        // 'yaml/spaced-comment': 'off',
        // #endregion
      },
    }, otherOptions) as OptionsConfig,
    ...userConfigs,
  )
}

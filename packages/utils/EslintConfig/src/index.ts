import antfu from '@antfu/eslint-config'

import type { optionsType, userConfigType } from './_types/index.ts'

export default function createEslintConfig(config: optionsType, ...userConfigs: userConfigType[]) {
  const { ignores, rules, ...otherOptions } = config
  return antfu(
    {
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
        'style/spaced-comment': 'off',
        //#region 是否强制使用三等号
        'eqeqeq': 'off',
        'vue/eqeqeq': 'off',
        //#endregion
        // vue 组件块顺序
        'vue/block-order': ['error', {
          order: ['template', 'script', 'style'],
        }],
        //#region 不能在定义前使用变量
        'no-use-before-define': 'off',
        'ts/no-use-before-define': 'off',
        //#endregion
        // import 排序
        'perfectionist/sort-imports': 'off',
        // JSON 排序
        'jsonc/sort-keys': 'off',
        // 不能使用console
        'no-console': 'off',
        // 未使用的变量
        'unused-imports/no-unused-vars': 'off',
        // 全局process
        'node/prefer-global/process': 'off',
        ...rules,
      },
      ...otherOptions,
    },
    ...userConfigs,
  )
}

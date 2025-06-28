import antfu from '@antfu/eslint-config'
import { globalIgnores } from 'eslint/config'

export default antfu(
  {
    jsx: true,
    formatters: true,
  },
  globalIgnores([
    '**/.husky/**',
    '**/dist/**',
    '**/dist-ssr/**',
    '**/coverage/**',
    '**/src/components/ConfigForm/**',
    '**/*.md',
  ]),
  {
    name: 'ignores-rules',
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
    },
  },
)

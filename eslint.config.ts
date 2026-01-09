// 配置文件
import EslintConfig from './packages/utils/EslintConfig/index.ts'

export default EslintConfig(
  {
    ignores: [
      'docs/vitepress/.vitepress/theme/components/DocsCodeDemo/**',
      'packages/components/AIAgent/**',
      'play/render/src/main.ts',
    ],
    rules: {
      // 未使用的变量
      'unused-imports/no-unused-vars': 'off',
      // 全局process
      'node/prefer-global/process': 'off',
      // console
      'no-console': 'off',
      // 不允许在定义前使用变量
      'ts/no-use-before-define': 'off',
    },
  },
)

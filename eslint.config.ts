import EslintConfig from './packages/utils/EslintConfig/index.ts'

export default EslintConfig(
  {
    ignores: [
      'docs/vitepress/.vitepress/theme/components/DocsCodeDemo/**',
      'packages/components/AIAgent/**',
    ],
    rules: {
      // 未使用的变量
      'unused-imports/no-unused-vars': 'off',
      // 全局process
      'node/prefer-global/process': 'off',
    },
  },
)

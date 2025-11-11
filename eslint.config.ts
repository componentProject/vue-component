import EslintConfig from './packages/utils/EslintConfig/index.ts'

export default EslintConfig(
  {
    ignores: [
      'docs/vitepress/.vitepress/theme/components/DocsCodeDemo/**',
      'packages/components/AIAgent/**',
    ],
  },
)

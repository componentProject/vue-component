import EslintConfig from './packages/utils/EslintConfig/index.ts'

export default EslintConfig(
  {
    ignores: [
      'packages/components/ConfigForm/**',
      '.husky/**',
      '**/*.md',
    ],
  },
)

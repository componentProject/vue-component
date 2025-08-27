import EslintConfig from './packages/components/EslintConfig'

export default EslintConfig(
  {
    ignores: [
      'packages/components/ConfigForm/**',
      '.husky/**',
      '**/*.md',
    ],
  },
)

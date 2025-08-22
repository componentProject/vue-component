import eslintConfig from '@moluoxixi/eslintconfig'

export default eslintConfig(
  {
    ignores: [
      'packages/components/ConfigForm/**',
      '.husky/**',
      '**/*.md',
    ],
  },
)

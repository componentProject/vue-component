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
)

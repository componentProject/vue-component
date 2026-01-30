// _AllTestOrNoPublishComponents的format组件
import type { languageType } from '../types'
import { toMonacoLanguage } from './language'

interface PrettierLike {
  format: (code: string, options: any) => string
}

async function loadPrettier(lang: languageType) {
  const langStr = toMonacoLanguage(lang)
  const prettier = await import('prettier/standalone')
  const [babel, estree, html, markdown, postcss, yaml] = await Promise.all([
    import('prettier/plugins/babel'),
    import('prettier/plugins/estree'),
    import('prettier/plugins/html'),
    import('prettier/plugins/markdown'),
    import('prettier/plugins/postcss'),
    import('prettier/plugins/yaml'),
  ])

  // 部分插件是通过 default 导出
  const plugins: any[] = [
    (babel as any).default ?? (babel as any),
    (estree as any).default ?? (estree as any),
    (html as any).default ?? (html as any),
    (markdown as any).default ?? (markdown as any),
    (postcss as any).default ?? (postcss as any),
    (yaml as any).default ?? (yaml as any),
  ]

  // TS 家族按需加载
  if (langStr === 'typescript') {
    const typescript = await import('prettier/plugins/typescript')
    plugins.push((typescript as any).default ?? (typescript as any))
  }

  // SQL 家族按需加载
  if (langStr === 'sql') {
    const sql = await import('prettier-plugin-sql')
    plugins.push((sql as any).default ?? (sql as any))
  }

  return { prettier: (prettier as any).default as PrettierLike, plugins }
}

function mapLanguageToPrettierParser(lang: languageType | string): string | null {
  switch (lang) {
    case 'js':
    case 'javascript':
    case 'jsx':
      return 'babel'
    case 'ts':
    case 'typescript':
    case 'tsx':
      return 'typescript'
    // SQL：需要 prettier-plugin-sql。其 parser 名为 'sql'
    case 'sql':
    case 'mysql':
    case 'postgres':
    case 'postgresql':
    case 'mssql':
    case 'plsql':
    case 'oracle':
    case 'sqlite':
    case 'mariadb':
      return 'sql'
    default:
      return 'babel'
  }
}

export interface FormatOptions {
  printWidth?: number
  tabWidth?: number
  useTabs?: boolean
  semi?: boolean
  singleQuote?: boolean
  quoteProps?: 'as-needed' | 'consistent' | 'preserve'
  trailingComma?: 'none' | 'es5' | 'all'
  bracketSpacing?: boolean
  bracketSameLine?: boolean
  arrowParens?: 'avoid' | 'always'
  endOfLine?: 'lf' | 'crlf' | 'cr' | 'auto'
  // 允许透传任意 Prettier 选项
  [key: string]: any
}

export async function formatWithPrettier(
  code: string,
  lang: languageType,
  userOptions: FormatOptions = {},
): Promise<string> {
  const parser = mapLanguageToPrettierParser(lang)
  if (!parser)
    return code

  try {
    const { prettier, plugins } = await loadPrettier(lang)
    return prettier.format(code, {
      parser,
      plugins,
      printWidth: 100,
      tabWidth: 2,
      useTabs: false,
      semi: false,
      singleQuote: true,
      trailingComma: 'all',
      bracketSpacing: true,
      bracketSameLine: false,
      arrowParens: 'always',
      endOfLine: 'lf',
      ...userOptions,
    })
  }
  catch (error) {
    console.error('[formatWithPrettier] 格式化失败，返回原文。', error)
    return code
  }
}

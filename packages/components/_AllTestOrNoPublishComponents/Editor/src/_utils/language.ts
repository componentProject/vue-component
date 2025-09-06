import type { languageType } from '../_types'

export function toMonacoLanguage(
  lang:
  languageType,
): string {
  switch (lang) {
    // JavaScript 家族
    case 'js':
    case 'javascript':
    case 'jsx':
      return 'javascript'
      // TypeScript 家族
    case 'ts':
    case 'typescript':
    case 'tsx':
      return 'typescript'
      // SQL 及各方言（Monaco 使用统一的 `sql`）
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
      return 'javascript'
  }
}

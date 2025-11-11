#!/usr/bin/env node
/**
 * 一键去除整个项目的注释
 * 支持的文件类型：.js, .ts, .jsx, .tsx, .vue, .css, .scss, .less
 */

// @ts-expect-error - Node.js built-in modules
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
// @ts-expect-error - Node.js built-in modules
import { dirname, extname, join, relative } from 'node:path'
// @ts-expect-error - Node.js built-in modules
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

/**
 * 需要忽略的目录和文件
 */
const IGNORE_PATTERNS = [
  'AIAgent',
  'moluoxixi',
  //#region 通用配置
  'removeComments.mts',
  '*.md',
  '*.sh',
  '*.d.',
  'commitlint.config.*',
  '.cz-config.*',
  'node_modules',
  '.git',
  'dist',
  'build',
  'typings',
  '_typings',
  '.cache',
  'cache',
  'coverage',
  '.idea',
  '.vscode',
  '.DS_Store',
  'vite.config.*',
  '*.yaml',
  '*.json',
  '*.lock',
  '*.min',
  //#endregion
]

/**
 * 支持的文件扩展名
 */
const SUPPORTED_EXTENSIONS = [
  '.js',
  '.ts',
  '.jsx',
  '.tsx',
  '.vue',
  '.css',
  '.scss',
  '.less',
  '.mts',
  '.cts',
]

/**
 * 检查文件是否应该被忽略
 */
function shouldIgnore(filePath: string): boolean {
  const relativePath = relative(projectRoot, filePath)

  return IGNORE_PATTERNS.some((pattern) => {
    if (pattern.includes('*')) {
      const regex = new RegExp(pattern.replace(/\*/g, '.*'))
      return regex.test(relativePath)
    }
    return relativePath.includes(pattern)
  })
}

/**
 * 去除文件注释
 */
function removeFileComments(filePath: string): boolean {
  try {
    const ext = extname(filePath)

    if (!SUPPORTED_EXTENSIONS.includes(ext)) {
      return false
    }

    let content = readFileSync(filePath, 'utf-8')
    const original = content

    // 去除多行注释 /* ... */ (只匹配前面是空白字符或行首的，但保留 eslint-disable 注释)
    content = content.replace(/(^|\s)\/\*[\s\S]*?\*\//gm, (match: string, prefix: string) => {
      // 如果注释包含 eslint-disable，则保留
      if (match.includes('eslint-disable')) {
        return match
      }
      return prefix
    })

    // 去除单行注释 // ... (只匹配前面是空白字符或行首的，避免误删 URL 中的 http://，但保留 eslint-disable 注释)
    content = content.replace(/(^|\s)\/\/.*/gm, (match: string, prefix: string) => {
      // 如果注释包含 eslint-disable，则保留
      if (match.includes('eslint-disable')) {
        return match
      }
      return prefix
    })

    // 去除 HTML 注释 <!-- ... --> (只匹配前面是空白字符或行首的，但保留 eslint-disable 注释)
    content = content.replace(/(^|\s)<!--[\s\S]*?-->/gm, (match: string, prefix: string) => {
      // 如果注释包含 eslint-disable，则保留
      if (match.includes('eslint-disable')) {
        return match
      }
      return prefix
    })

    // 清理多余的空行（连续3个以上空行替换为2个）
    content = content.replace(/\n{3,}/g, '\n\n')

    // 如果内容有变化，写入文件
    if (content !== original) {
      writeFileSync(filePath, content, 'utf-8')
      return true
    }

    return false
  }
  catch (error: unknown) {
    console.error(`处理文件失败: ${filePath}`, error)
    return false
  }
}

/**
 * 统计信息类型
 */
interface Stats {
  processed: number
  modified: number
  errors: number
}

/**
 * 递归遍历目录
 */
function walkDirectory(dirPath: string, stats: Stats): void {
  try {
    const files = readdirSync(dirPath)

    for (const file of files) {
      const filePath = join(dirPath, file)

      if (shouldIgnore(filePath)) {
        continue
      }

      try {
        const stat = statSync(filePath)

        if (stat.isDirectory()) {
          walkDirectory(filePath, stats)
        }
        else if (stat.isFile()) {
          stats.processed++
          const modified = removeFileComments(filePath)
          if (modified) {
            stats.modified++
            console.log(`✓ 已处理: ${relative(projectRoot, filePath)}`)
          }
        }
      }
      catch (error: unknown) {
        stats.errors++
        console.error(`✗ 处理失败: ${relative(projectRoot, filePath)}`, error)
      }
    }
  }
  catch (error: unknown) {
    console.error(`✗ 读取目录失败: ${dirPath}`, error)
    stats.errors++
  }
}

/**
 * 主函数
 */
function main() {
  console.log('🚀 开始去除项目注释...\n')

  const stats: Stats = {
    processed: 0,
    modified: 0,
    errors: 0,
  }

  const startTime = Date.now()

  // 从项目根目录开始遍历
  walkDirectory(projectRoot, stats)

  const endTime = Date.now()
  const duration = ((endTime - startTime) / 1000).toFixed(2)

  console.log(`\n${'='.repeat(50)}`)
  console.log('📊 处理完成统计:')
  console.log(`   总处理文件数: ${stats.processed}`)
  console.log(`   修改文件数: ${stats.modified}`)
  console.log(`   错误数: ${stats.errors}`)
  console.log(`   耗时: ${duration}秒`)
  console.log('='.repeat(50))

  if (stats.errors > 0) {
    // @ts-expect-error - process is available in Node.js runtime
    process.exit(1)
  }
}

// 运行主函数
main()

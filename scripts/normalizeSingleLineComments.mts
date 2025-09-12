#!/usr/bin/env tsx
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { resolve, extname, join } from 'node:path'

/**
 * 功能说明
 * 将三行形式的「单行内容」JSDoc 注释压缩为一行，便于统一代码风格。
 *
 * 转换规则示例：
 *   /**\n * content\n *\/   →   /** content */
 *
 * 保留原有的前置缩进（空格或 Tab），仅在匹配「三行、且只有一行内容」的情形下进行转换。
 *
 * 支持的文件扩展名：.ts, .tsx, .js, .jsx, .vue, .mts, .mjs
 *
 * 使用方式（建议）：
 *   pnpm tsx scripts/normalizeSingleLineComments.mts <dir1> <dir2> ...
 *   例如：pnpm tsx scripts/normalizeSingleLineComments.mts packages docs
 */

const exts: Set<string> = new Set(['.ts', '.tsx', '.js', '.jsx', '.vue', '.mts', '.mjs'])

/**
 * 递归列出目录下的所有目标类型文件
 * @param dir 需要遍历的目录绝对路径或相对路径
 * @returns 符合扩展名要求的文件绝对路径列表
 */
function listFiles(dir: string): string[] {
  const entries = readdirSync(dir, { withFileTypes: true })
  const files: string[] = []
  for (const entry of entries) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...listFiles(full))
    } else if (exts.has(extname(entry.name))) {
      files.push(full)
    }
  }
  return files
}

/**
 * 规范化（压缩）指定文件中的「三行单行内容」JSDoc 注释
 * 仅当内容发生变化时才写回磁盘
 * @param filePath 文件绝对路径或相对路径
 * @returns 是否发生了写入（内容被修改）
 */
function normalizeFile(filePath: string): boolean {
  const original = readFileSync(filePath, 'utf8')
  // 匹配三行 JSDoc（且仅有一行内容）并捕获前导缩进：
  // /**\n * content\n *\/  →  /** content */
  // 分组1：前导缩进；分组2：注释内容
  const pattern = /(^[\t ]*)\/\*\*\s*\r?\n[\t ]*\*\s+([^\r\n*][^\r\n]*)\s*\r?\n[\t ]*\*\/(?=\r?\n|$)/gm
  const updated = original.replace(pattern, (_m, indent: string, text: string) => `${indent}/** ${text.trim()} */`)
  if (updated !== original) {
    writeFileSync(filePath, updated)
    return true
  }
  return false
}

/**
 * 入口函数
 * 读取命令行参数中的目录，遍历并规范化匹配的注释样式
 */
function main(): void {
  const roots = process.argv.slice(2)
  if (roots.length === 0) {
    console.error('用法: pnpm tsx scripts/normalizeSingleLineComments.mts <dir1> <dir2> ...')
    process.exit(1)
  }
  let changed = 0
  for (const dir of roots) {
    const abs = resolve(process.cwd(), dir)
    const stats = statSync(abs)
    if (!stats.isDirectory()) continue
    const files = listFiles(abs)
    for (const f of files) {
      if (normalizeFile(f)) {
        // eslint-disable-next-line no-console
        console.log(`Updated: ${f}`)
        changed += 1
      }
    }
  }
  // eslint-disable-next-line no-console
  console.log(`Done. Files updated: ${changed}`)
}

main()



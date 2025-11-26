import type { BuildContext } from '../_types'
/**
 * 组件相关工具函数
 */
import fsp from 'node:fs/promises'
import glob from 'fast-glob'

/** 必须排除的文件 */
export const mustExcludeDirs = ['moluoxixi', 'node_modules', 'typings', '_typings']

/**
 * 简单延迟函数，用于在批量打包时给 GC 和系统 I/O 缓冲时间
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/** 获取组件列表（只分目录的组件） */
export async function getComponentNames(ctx: BuildContext) {
  const componentDirs = await glob([`.${ctx.entryBaseUrl}*`, `!.${ctx.entryBaseUrl}_*`, ...mustExcludeDirs.map(i => `!${i}`)], {
    cwd: ctx.packDir,
    onlyDirectories: true,
    ignore: [`${ctx.entryBaseUrl}_*`],
  })
  const excludeDirs = [ctx.LIB_NAMESPACE, ...mustExcludeDirs]
  return componentDirs
    .map(dir => dir.split('/').pop() || '')
    .filter(dirName => !!dirName && !excludeDirs.includes(dirName))
}

/**
 * 查找组件的入口文件（支持任意后缀名的 index 文件）
 * @param componentDir 组件目录路径
 * @returns 入口文件路径，如果未找到则返回 null
 */
export async function findComponentEntry(componentDir: string): Promise<string | null> {
  // 使用 glob 查找所有 index.* 文件
  const indexFiles = await glob(['index.*'], {
    cwd: componentDir,
    absolute: true,
    onlyFiles: true,
  })

  if (indexFiles.length > 0) {
    // 按优先级排序：优先选择 .ts, .tsx, .vue, .js, .jsx
    const priority = ['.ts', '.tsx', '.vue', '.js', '.jsx']
    const sortedFiles = indexFiles.sort((a, b) => {
      const extA = a.substring(a.lastIndexOf('.'))
      const extB = b.substring(b.lastIndexOf('.'))
      const indexA = priority.indexOf(extA)
      const indexB = priority.indexOf(extB)
      // 如果都在优先级列表中，按优先级排序；否则保持原顺序
      if (indexA !== -1 && indexB !== -1)
        return indexA - indexB
      if (indexA !== -1)
        return -1
      if (indexB !== -1)
        return 1
      return 0
    })
    return sortedFiles[0]
  }

  return null
}

/**
 * 获取路径字符串中第一个路径分隔符（/ 或 \）前的第一个片段。
 * @param fullPath 完整的路径字符串 (例如: 'PopoverTableSelect\src\base\index.vue')
 * @returns 第一个片段 (例如: 'PopoverTableSelect')
 */
export function getFirstPathSegment(fullPath: string): string {
  // 1. 查找两种分隔符的索引
  const forwardSlashIndex = fullPath.indexOf('/')
  const backwardSlashIndex = fullPath.indexOf('\\')

  // 2. 确定有效的起始截断点
  let separatorIndex: number

  // 场景 A: 都没有找到
  if (forwardSlashIndex === -1 && backwardSlashIndex === -1) {
    // 如果没有分隔符，整个字符串就是唯一的片段
    return fullPath
  }

  // 场景 B: 找到了至少一个
  else {
    // 使用 Math.min 找到最小的正数索引，即"最先出现"的分隔符

    // 如果其中一个没找到 (索引为 -1)，我们将其视为 Infinity，确保选择另一个找到的索引
    const indexA = forwardSlashIndex !== -1 ? forwardSlashIndex : Infinity
    const indexB = backwardSlashIndex !== -1 ? backwardSlashIndex : Infinity

    // 最小的那个索引就是我们的截断点
    separatorIndex = Math.min(indexA, indexB)
  }

  // 3. 返回截断后的子字符串
  return fullPath.substring(0, separatorIndex)
}

/**
 * 将包名转换为大驼峰格式（PascalCase）
 * @param packageName 包名 (例如: 'node:child_process', '@tailwindcss/postcss', 'element-plus')
 * @returns 大驼峰格式的包名 (例如: 'NodeChildProcess', 'TailwindcssPostcss', 'ElementPlus')
 */
export function toPascalCase(packageName: string): string {
  let processedName = packageName

  // 处理 node: 前缀
  if (processedName.startsWith('node:')) {
    processedName = `Node${processedName.slice(5)}` // 去掉 'node:' 并添加 'Node' 前缀
  }

  // 处理 @scope/package 格式
  if (processedName.startsWith('@')) {
    processedName = processedName.slice(1) // 去掉 '@'
  }

  // 处理普通包名：将连字符、下划线、斜杠等分隔符转换为单词边界，然后转大驼峰
  return processedName
    .split(/[-_/]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('')
}

/** 清空目录 */
export async function clearDir(DirPath: string) {
  // 清空目录
  await fsp.rm(DirPath, { recursive: true, force: true }).catch(() => {})
  await fsp.mkdir(DirPath, { recursive: true })
}

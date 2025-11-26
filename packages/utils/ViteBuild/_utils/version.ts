import type { BuildContext } from '../_types'
/**
 * 版本管理工具函数
 */
import fs from 'node:fs'
import fsp from 'node:fs/promises'
import { resolve } from 'node:path'

/**
 * 异步获取所有组件的版本号对象
 * @param ctx 构建上下文
 * @returns 版本号对象 Record<string, string>
 */
export async function getCurrentVersions(ctx: BuildContext): Promise<Record<string, string>> {
  try {
    // 当 uploadType 存在且包含 Test 时，使用测试版本文件
    const versionPath = ctx.uploadType && ctx.uploadType.includes('Test')
      ? resolve(ctx.packDir, 'test-version.json')
      : resolve(ctx.packDir, 'version.json')

    if (!fs.existsSync(versionPath)) {
      // 如果不存在，创建默认版本文件
      const defaultVersions: Record<string, string> = {}
      await fsp.writeFile(versionPath, JSON.stringify(defaultVersions, null, 2), 'utf-8')
      return defaultVersions
    }
    const content = await fsp.readFile(versionPath, 'utf-8')
    return JSON.parse(content)
  }
  catch (error) {
    console.warn(`获取版本号对象失败: ${(error as Error).message}`)
    return {}
  }
}

/**
 * 获取下一个版本号
 * @param currentVersion 当前版本号
 * @param type 版本类型：major, minor, patch
 * @param uploadType
 * @returns 下一个版本号
 */
export function getNextVersion(currentVersion: string, type: 'major' | 'minor' | 'patch' = 'patch', uploadType?: string): string {
  // 解析当前版本号，处理可能存在的预发布版本号
  const versionParts = currentVersion.split('-')
  const mainVersion = versionParts[0]

  // 解析主版本号
  const [major, minor, patch] = mainVersion.split('.').map(Number)

  // 根据类型计算新版本号
  let newMajor = major
  let newMinor = minor
  let newPatch = patch

  switch (type) {
    case 'major':
      newMajor++
      newMinor = 0
      newPatch = 0
      break
    case 'minor':
      newMinor++
      newPatch = 0
      break
    default: // patch
      newPatch++
      break
  }
  if (uploadType?.includes('Test')) {
    // 生成新版本号并添加 beta 后缀
    // 如果当前版本已经是 beta 版本，则递增 beta 版本号
    if (versionParts.length > 1 && versionParts[1].startsWith('beta.')) {
      // 提取 beta 版本号
      const betaVersionMatch = versionParts[1].match(/^beta\.(\d+)$/)
      const betaVersion = betaVersionMatch ? Number.parseInt(betaVersionMatch[1], 10) + 1 : 0
      return `${newMajor}.${newMinor}.${newPatch}-beta.${betaVersion}`
    }
    else {
      // 如果是新的 beta 版本，从 0 开始
      return `${newMajor}.${newMinor}.${newPatch}-beta.0`
    }
  }
  else {
    // 如果是新的 beta 版本，从 0 开始
    return `${newMajor}.${newMinor}.${newPatch}`
  }
}

/**
 * 将版本号写回 version.json 文件
 * @param ctx 构建上下文
 * @param versions 要更新的版本号对象
 */
export async function writeComponentVersions(ctx: BuildContext, versions: Record<string, string>): Promise<boolean> {
  try {
    let versionPath: string

    // 当 uploadType 存在且包含 Test 时，使用测试版本文件
    if (ctx.uploadType && ctx.uploadType.includes('Test')) {
      versionPath = resolve(ctx.packDir, 'test-version.json')
    }
    else {
      versionPath = resolve(ctx.packDir, 'version.json')
    }

    // 读取现有版本文件
    let existingVersions: Record<string, string> = {}
    if (fs.existsSync(versionPath)) {
      const content = await fsp.readFile(versionPath, 'utf-8')
      existingVersions = JSON.parse(content)
    }

    // 合并版本号（新版本覆盖旧版本）
    const mergedVersions = { ...existingVersions, ...versions }

    // 写回文件
    await fsp.writeFile(versionPath, JSON.stringify(mergedVersions, null, 2), 'utf-8')
    return true
  }
  catch (error) {
    console.error(`写入版本号失败: ${(error as Error).message}`)
    return false
  }
}

// generateSidebar.ts文件
import type { DefaultTheme } from 'vitepress'
import fs from 'node:fs'
import path from 'node:path'
import { docsPath } from '../../../../contants/index.ts'

interface SidebarItem {
  text: string
  link: string
}

interface SidebarGroup {
  text: string
  items: SidebarItem[]
}
/**
 * 扫描指定文件夹，生成侧边栏配置
 * @param folderName 文件夹名称，如 'guide' 或 'components'
 */
export function scanFolder(folderName: string): SidebarGroup[] {
  console.log(`🚀 开始扫描 ${folderName} 文件夹...`)
  const targetDir = path.resolve(docsPath, folderName)
  if (!fs.existsSync(targetDir)) {
    console.warn(`❌ ${folderName} 目录不存在，路径:`, targetDir)
    return []
  }

  try {
    const items = fs.readdirSync(targetDir, { withFileTypes: true })
    console.log(`📁 在 ${folderName} 中扫描到 ${items.length} 个项目`)

    const sidebarGroups: SidebarGroup[] = []
    const files: SidebarItem[] = []
    const directories: SidebarGroup[] = []

    for (const item of items) {
      // 跳过隐藏文件和 node_modules
      if (item.name.startsWith('.') || item.name === 'node_modules') {
        console.log(`⏩ 跳过: ${item.name}`)
        continue
      }

      if (item.isDirectory()) {
        // 处理子目录
        const subDir = path.join(targetDir, item.name)
        const subItems = fs.readdirSync(subDir, { withFileTypes: true })
        const subFiles: SidebarItem[] = []

        for (const subItem of subItems) {
          if (subItem.isFile() && subItem.name.endsWith('.md')) {
            const fileName = subItem.name.replace('.md', '')
            subFiles.push({
              text: fileName,
              link: `/${folderName}/${item.name}/${fileName}`,
            })
          }
        }

        if (subFiles.length > 0) {
          directories.push({
            text: item.name,
            items: subFiles.sort((a, b) => a.text.localeCompare(b.text)),
          })
        }
      }
      else if (item.isFile() && item.name.endsWith('.md')) {
        const fileName = item.name.replace('.md', '')
        files.push({
          text: fileName,
          link: `/${folderName}/${fileName}`,
        })
      }
    }

    // 先添加文件，再添加目录
    if (files.length > 0) {
      sidebarGroups.push({
        text: folderName,
        items: files.sort((a, b) => a.text.localeCompare(b.text)),
      })
    }

    sidebarGroups.push(...directories)

    console.log(`✅ ${folderName} 扫描完成，生成 ${sidebarGroups.length} 个分组`)
    return sidebarGroups
  }
  catch (error) {
    console.error(`❌ 扫描 ${folderName} 目录失败:`, error)
    return []
  }
}

/**
 * 生成VitePress侧边栏配置
 * @param folderNames 文件夹名称数组，如 ['guide', 'components']
 */
export function generateSidebar(folderNames: string[]): DefaultTheme.Sidebar {
  console.log(`🚀 开始生成侧边栏配置，文件夹: [${folderNames.join(', ')}]`)

  const sidebarConfig: Record<string, SidebarGroup[]> = {}

  for (const folderName of folderNames) {
    console.log(`📁 正在处理文件夹: ${folderName}`)

    // 统一使用文件夹扫描逻辑，不再区分 components
    const folderSidebar = scanFolder(folderName)
    sidebarConfig[`/${folderName}/`] = folderSidebar
    console.log(`✅ ${folderName} 处理完成，生成 ${folderSidebar.length} 个分组`)
  }

  console.log('🎯 所有文件夹处理完成，生成的路径:', Object.keys(sidebarConfig))
  return sidebarConfig
}

/**
 * 生成组件导航配置
 */
export function generateComponentNav(link: string) {
  console.log('🧭 生成组件导航...')

  // 扫描 components 文件夹获取组件数量
  const componentsSidebar = scanFolder('components')
  let componentCount = 0

  for (const group of componentsSidebar) {
    componentCount += group.items.length
  }

  const nav = {
    text: `组件 (${componentCount})`,
    link,
  }

  console.log('✅ 组件导航生成完成:', nav.text)
  return nav
}

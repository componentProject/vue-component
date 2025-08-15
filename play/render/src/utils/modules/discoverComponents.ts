import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

/**
 * 自动发现组件并生成入口配置
 * 扫描组件目录，过滤掉以下划线开头的辅助目录，生成组件入口配置
 * @returns 组件名称列表和入口文件配置
 */
export function discoverComponents() {
  const componentsDir = path.resolve(process.cwd(), 'src/components')

  // 获取组件目录下的所有文件夹，过滤掉以下划线开头的辅助目录
  const componentDirs = fs.readdirSync(componentsDir).filter(dir =>
    fs.statSync(path.join(componentsDir, dir)).isDirectory()
    && !dir.startsWith('_'),
  )

  // 生成入口文件配置
  const entry: Record<string, string> = {
    index: path.resolve(process.cwd(), 'src/components/index.ts'),
  }

  // 为每个组件添加入口
  componentDirs.forEach((component) => {
    entry[component] = path.resolve(process.cwd(), `src/components/${component}/index.vue`)
  })

  // 添加utils模块入口
  const utilsPath = path.resolve(process.cwd(), 'src/components/_utils/index.ts')
  if (fs.existsSync(utilsPath)) {
    entry._utils = utilsPath
  }

  return {
    componentNames: componentDirs,
    entry,
  }
}

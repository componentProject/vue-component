import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { resolveConfig } from 'vite'

// 获取当前模块的文件名
const __filename = fileURLToPath(import.meta.url)
// 获取当前目录名
const __dirname = path.dirname(__filename)
// 项目根目录
const rootDir = path.join(__dirname, '..')

// 解析vite配置，获取component模式下的输出目录
async function getComponentOutDir() {
  const viteConfig = await resolveConfig({}, 'build', 'component')
  return viteConfig.build.outDir || 'moluoxixi' // 默认值为moluoxixi
}

// 版本号自增
function incrementVersion(version) {
  const parts = version.split('.')
  // 增加补丁版本号
  parts[2] = (Number.parseInt(parts[2], 10) + 1).toString()
  return parts.join('.')
}

async function main() {
  try {
    // 获取组件库输出目录
    const outputDir = await getComponentOutDir()
    console.log(`组件库输出目录: ${outputDir}`)

    // 组件库输出路径
    const outputPath = path.join(rootDir, outputDir)

    // 读取项目package.json (只用来查看当前版本)
    const projectPackagePath = path.join(rootDir, 'package.json')
    const projectPackage = JSON.parse(fs.readFileSync(projectPackagePath, 'utf-8'))

    // 读取组件库专用的package.json模板
    const componentPackagePath = path.join(rootDir, 'package.component.json')
    const componentPackage = JSON.parse(fs.readFileSync(componentPackagePath, 'utf-8'))

    // 获取当前组件版本号，若不存在则使用项目版本号
    const currentComponentVersion = componentPackage.version || projectPackage.version

    // 仅增加组件库版本号
    const newVersion = incrementVersion(currentComponentVersion)
    console.log(`组件库版本号从 ${currentComponentVersion} 更新到 ${newVersion}`)

    // 更新组件库package.json的版本号
    componentPackage.version = newVersion

    // 保存更新后的组件库配置到模板文件
    fs.writeFileSync(componentPackagePath, JSON.stringify(componentPackage, null, 2))
    console.log(`组件库配置模板已更新版本号为: ${newVersion}`)

    // 确保输出目录存在
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true })
    }

    // 写入package.json到组件库目录
    fs.writeFileSync(
      path.join(outputPath, 'package.json'),
      JSON.stringify(componentPackage, null, 2),
    )

    // 复制README文件到组件库目录
    fs.copyFileSync(
      path.join(rootDir, 'package.readme.md'),
      path.join(outputPath, 'README.md'),
    )

    console.log(`组件库package.json和README.md已生成到 ${outputPath}`)

    // 更新scripts中的publish:component命令以使用动态输出目录
    const publishCommand = `npm run build:component && cd ${outputDir} && npm publish`
    projectPackage.scripts['publish:component'] = publishCommand
    fs.writeFileSync(projectPackagePath, JSON.stringify(projectPackage, null, 2))

    console.log(`发布命令已更新为: ${publishCommand}`)
  }
  catch (error) {
    console.error('构建组件库时出错:', error)
    process.exit(1)
  }
}

main()

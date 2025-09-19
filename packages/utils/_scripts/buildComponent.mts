import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildComponentsWithOptions } from '../_utils/build.mts'
import process from 'node:process'

// === 组件库命名空间配置 ===
const LIB_NAMESPACE = 'moluoxixi'
/**
 * 别名或者外部包的路径
 */
const aliasComponentPath = '@moluoxixi/utils'

/**
 * 必须要排除依赖的工具包(部分node包需要依赖本地运行，不排除依赖会出错）
 */
const requireExternalPacks = ['ViteConfig', 'EslintConfig']

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = resolve(__dirname, '../../../')
/**
 * 组件仓库所在路径
 */
const packDir = resolve(__dirname, '../')

function parseBoolean(input: string | undefined, defaultValue = false): boolean {
  if (typeof input === 'undefined')
    return defaultValue
  const v = String(input).toLowerCase()
  return v === 'true' || v === '1'
}

// 主函数
async function main() {
  // 获取命令行参数
  const args = process.argv.slice(2)
  const command = args[0] || 'build-publish' // 默认命令是build
  const mode = args[1] || 'all' // 默认模式是all
  // 第三个参数：是否排除重型插件（布尔），默认 false
  const excludeHeavyPlugins = parseBoolean(args[2], false)

  // 根据命令执行不同的操作
  switch (command) {
    case 'build':
    case 'build-publish': {
      // 构建并发布
      const buildPublishResult = await buildComponentsWithOptions({
        mode,
        shouldPublish: command === 'build-publish',
        excludeHeavyPlugins,
        requireExternalPacks,
        libNamespace: LIB_NAMESPACE,
        aliasComponentPath,
        rootDir,
        packDir,
      })
      return buildPublishResult ? 0 : 1
    }

    default:
      console.log(`
使用方法:
  node scripts/buildComponent.mjs [command] [mode]

命令:
  build         - 仅构建组件（默认）
  build-publish - 构建并发布组件

模式:
  all           - 处理所有单个组件和整个组件库（默认）
  library       - 只处理整个组件库
  <组件名>      - 只处理指定的单个组件

示例:
  tsx scripts/buildComponent.mts                   - 构建所有组件和组件库
  tsx scripts/buildComponent.mts build library     - 只构建组件库
  tsx scripts/buildComponent.mts build Icon        - 只构建Icon组件
  tsx scripts/buildComponent.mts build-publish     - 构建并发布所有组件和组件库
      `)
      return 1
  }
}

// 执行主函数
main().then((exitCode) => {
  process.exit(exitCode)
})

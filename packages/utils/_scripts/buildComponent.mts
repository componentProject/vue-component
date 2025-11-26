// buildComponent.mts文件
import type { GlobalFormatConfig } from '@moluoxixi/utils/ViteBuild'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UTIL_SETTING_TYPE } from '@moluoxixi/constant'
import { runBuildCliAndExit } from '@moluoxixi/utils/ViteBuild'

// === 组件库命名空间配置 ===
const LIB_NAMESPACE = 'moluoxixi'
/**
 * 别名或者外部包的路径
 */
const aliasComponentPath = '@moluoxixi/utils'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = resolve(__dirname, '../../../')
/**
 * 组件仓库所在路径
 */
const packDir = resolve(__dirname, '../')

/**
 * 格式配置：默认浏览器环境，仅指定组件使用 Node 环境
 * 注意：Node 环境下会自动强制启用依赖排除
 */
const formatConfig: GlobalFormatConfig = {
  // 默认浏览器环境（isNodeEnv 默认为 false）
  // 通过 componentFormats 为特定组件指定 Node 环境
  componentFormats: {
    ViteBuild: {
      isNodeEnv: true, // 指定为 Node 环境
      // nodeFormats 默认为 { cjs: true }，如需覆盖可在此配置
    },
    ViteConfig: {
      isNodeEnv: true, // 指定为 Node 环境
    },
    EslintConfig: {
      isNodeEnv: true, // 指定为 Node 环境
    },
  },
}

// 使用通用打印
runBuildCliAndExit(
  {
    libNamespace: LIB_NAMESPACE,
    aliasComponentPath,
    rootDir,
    packDir,
    formatConfig,
    presetGlobals: {
    },
  },
  { command: 'build-publish', uploadType: UTIL_SETTING_TYPE },
)

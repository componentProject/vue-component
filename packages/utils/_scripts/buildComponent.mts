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
 * 新格式：组件配置直接在顶层，使用 format 字段
 * 注意：Node 环境下会自动强制启用依赖排除
 *
 * 配置说明：
 * - 不指定 format 的组件会使用环境默认值（Node: { cjs: true }, 浏览器: { es: true }）
 * - 指定 format 的组件会使用自定义格式配置
 */
const formatConfig: GlobalFormatConfig = {
  // 默认浏览器环境（isNodeEnv 默认为 false）
  // 通过组件名作为键为特定组件指定配置
  ViteBuild: {
    isNodeEnv: true,
    format: {
      es: true,
    },
  },
  ViteConfig: {
    isNodeEnv: true,
    format: {
      es: true,
    },
  },
  EslintConfig: {
    isNodeEnv: true,
    format: {
      es: true,
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

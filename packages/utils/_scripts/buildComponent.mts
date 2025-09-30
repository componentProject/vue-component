import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { runBuildCliAndExit } from '../_utils/build/index.mts'

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

/** 示例用的 uploadType */
const EXAMPLE_UPLOAD_TYPE = 'UtilityClass'

// 使用通用打印

runBuildCliAndExit(
  {
    libNamespace: LIB_NAMESPACE,
    aliasComponentPath,
    rootDir,
    packDir,
    requireExternalPacks,
  },
  { command: 'build-publish' },
)

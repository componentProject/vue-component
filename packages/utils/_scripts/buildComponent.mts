import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { runBuildCliAndExit } from '@moluoxixi/utils/_utils/build/index.mts'
import { UTIL_SETTING_TYPE } from '@moluoxixi/constant'

// === 组件库命名空间配置 ===
const LIB_NAMESPACE = 'moluoxixi'
/**
 * 别名或者外部包的路径
 */
const aliasComponentPath = '@moluoxixi/utils'

/**
 * node环境下运行的必须要排除依赖，不可打包成单文件
 */
const requireExternalPacks = ['ViteConfig', 'EslintConfig']

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = resolve(__dirname, '../../../')
/**
 * 组件仓库所在路径
 */
const packDir = resolve(__dirname, '../')

// 使用通用打印
runBuildCliAndExit(
  {
    libNamespace: LIB_NAMESPACE,
    aliasComponentPath,
    rootDir,
    packDir,
    requireExternalPacks,
    presetGlobals: {
    },
  },
  { command: 'build-publish', uploadType: UTIL_SETTING_TYPE },
)

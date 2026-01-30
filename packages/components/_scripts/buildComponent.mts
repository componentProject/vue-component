// _scripts的buildComponent组件
import type { GlobalFormatConfig } from '@moluoxixi/utils/ViteBuild'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { COMPONENT_SETTING_TYPE } from '@moluoxixi/constant'
import { runBuildCliAndExit } from '@moluoxixi/utils/ViteBuild'
// === 组件库命名空间配置 ===
const LIB_NAMESPACE = 'moluoxixi'
/**
 * 别名或者外部包的路径
 */
const aliasComponentPath = '@moluoxixi/components'
/**
 * 必须要排除依赖的工具包
 */
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
/** 项目根目录，用于获取依赖版本信息 */
const rootDir = resolve(__dirname, '../../../')
/** 组件仓库所在路径  */
const packDir = resolve(__dirname, '../')
/** 路径别名 */
const alias = {
  '@moluoxixi/utils': resolve(rootDir, './packages/utils'),
  '@moluoxixi/utils/*': resolve(rootDir, './packages/utils/*'),
}

/**
 * 格式配置
 * - 默认格式：{ es: true }
 */
const formatConfig: GlobalFormatConfig = {
  format: { es: true, umd: true },
}

runBuildCliAndExit(
  {
    libNamespace: LIB_NAMESPACE,
    aliasComponentPath,
    alias,
    rootDir,
    packDir,
    formatConfig,
    // styleType: 'scoped',
    presetGlobals: {
    },
    // 组件扫描时忽略的目录模式
    excludeDirs: ['_*'],
    // 依赖分析时忽略的包前缀
    excludeDepPrefixes: ['_'],
    viteConfig: {
      build: {
        minify: false,
      },
      define: {
        process: {
          env: {
            VUE_APP_VXE_ENV: 'production',
          },
        },
      },
      css: {
        preprocessorOptions: {
          scss: {
            api: 'legacy',
            additionalData: (source: string, filename: string) => {
              if (filename.includes('.vue') && !filename.includes('AIAgent')) {
                return `@forward '@moluoxixi/components/_assets/styles/tailwind.scss';
                ${source}`
              }
              else {
                return source
              }
            },
          },
        },
      },
    },
  },
  { uploadType: COMPONENT_SETTING_TYPE, command: 'build-publish' },
)

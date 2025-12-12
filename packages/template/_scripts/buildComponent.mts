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
 * 格式配置：浏览器环境打 ES 和 UMD 格式
 * 新格式：使用 format 字段，根据 isNodeEnv 自动决定默认值
 * 注意：如果不提供 formatConfig，默认就是浏览器环境，只打 ES 格式
 */
const formatConfig: GlobalFormatConfig = {
  // isNodeEnv 默认为 false（浏览器环境），可省略
  format: {
    es: true, // 浏览器环境默认值
    umd: true, // 添加 UMD 格式
  },
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
    viteConfig: {
      build: {
        minify: false,
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

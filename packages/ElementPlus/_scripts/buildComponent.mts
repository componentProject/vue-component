// _scripts的buildComponent组件
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { COMPONENT_SETTING_TYPE } from '@moluoxixi/constant'

import { runBuildCliAndExit } from '@moluoxixi/utils/_utils/build/index.mts'
// === 组件库命名空间配置 ===
const LIB_NAMESPACE = 'moluoxixi'
/**
 * 别名或者外部包的路径
 */
const aliasComponentPath = '@moluoxixi/element-plus'
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

runBuildCliAndExit(
  {
    libNamespace: LIB_NAMESPACE,
    aliasComponentPath,
    alias,
    rootDir,
    packDir,
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

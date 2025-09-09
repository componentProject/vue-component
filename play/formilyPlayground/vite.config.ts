import viteConfig, { wrapperEnv } from '../../packages/utils/ViteConfig/index.ts'
import path from 'node:path'
import process from 'node:process'
import { loadEnv } from 'vite'

export default viteConfig(
  ({ mode }) => {
    const env = loadEnv(mode!, process.cwd())
    const viteEnv = wrapperEnv(env)
    const rootPath = path.resolve()
    return {
      rootPath,
      mode: {
        base: {
          VITE_AUTO_ROUTES: true,
          VITE_GLOB_APP_TITLE: viteEnv.VITE_GLOB_APP_TITLE,
          VITE_GLOB_APP_CODE: viteEnv.VITE_GLOB_APP_CODE,
          VITE_PORT: 3400,
          VITE_OPEN: true,
          VITE_COMPRESS: true,
          VITE_IMAGEMIN: true,
          VITE_BUILD_GZIP: true,
        },
      },
    }
  },
)

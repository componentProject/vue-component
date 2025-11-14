// ViteConfig入口文件
import { createViteConfig, getViteConfig } from './src/index.ts'

export default createViteConfig
export { wrapperEnv } from './src/_utils/index.ts'
export { getViteConfig, createViteConfig as ViteConfig }

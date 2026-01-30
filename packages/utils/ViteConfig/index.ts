import type { AutoRoutesConfig, CDNOptions, CompressionPlugin, ImageminPlugin, PluginConfig, PluginType, QiankunPlugin, VisualizerOptions, ViteConfigType, ViteFeatureContext } from './src/types'
import { createViteConfig, getViteConfig } from './src/index.ts'

export default createViteConfig
export { wrapperEnv } from './src/utils/index.ts'
export { getViteConfig, createViteConfig as ViteConfig }
export type { AutoRoutesConfig, CDNOptions, CompressionPlugin, ImageminPlugin, PluginConfig, PluginType, QiankunPlugin, VisualizerOptions, ViteConfigType, ViteFeatureContext }

import type { StorybookConfig } from '@storybook/vue3-vite'
import { mergeConfig } from 'vite'
import type { PluginOption } from 'vite'
import viteConfig from '../vite.config'
import type { modeType } from '../vite.config'
import importToCDN from 'vite-plugin-cdn-import'

type PluginOptionType = PluginOption & {
  name: never
}
const config: StorybookConfig = {
  stories: [
    './.stories/*.stories.@(js|jsx|mjs|ts|tsx|mdx)',
    '../src/components/**/stories/*.stories.@(js|jsx|mjs|ts|tsx|mdx)',
  ],
  addons: [
    '@storybook/addon-onboarding',
    '@storybook/addon-essentials',
    '@chromatic-com/storybook',
    '@storybook/addon-interactions',
    '@storybook/addon-storysource',
  ],
  core: {
    builder: '@storybook/builder-vite',
  },
  async viteFinal(config, { configType }) {
    const { plugins, build } = viteConfig({ mode: configType, type: 'storybook' } as modeType)
    const mergeconfig = mergeConfig(config, {
      build,
      plugins,
    })
    const existingPlugins = [importToCDN].map((item) => item.name)
    const mergePluginNames: string[] = []
    const mergePlugins: PluginOptionType[] = []
    mergeconfig.plugins.forEach((item?: PluginOptionType) => {
      if (!item) return
      if (!mergePluginNames.includes(item.name)) {
        mergePluginNames.push(item.name)
        mergePlugins.push(item)
      }
    })
    mergeconfig.plugins = mergePlugins.filter((plugin: PluginOptionType) => {
      return !existingPlugins.includes(plugin?.name)
    })
    return mergeconfig
  },
  docs: {
    autodocs: true,
  },
  framework: {
    name: '@storybook/vue3-vite',
    options: {
      // docgen:'vue-docgen-api'
      docgen: 'vue-component-meta',
    },
  },
}
export default config

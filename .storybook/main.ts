import type { StorybookConfig } from '@storybook/vue3-vite'
import type { PluginOption } from 'vite'
import importToCDN from 'vite-plugin-cdn-import'
import { external } from '../src/constants'

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
    if (configType === 'PRODUCTION') {
      const existingPlugins = [importToCDN].map((item) => item.name)
      config.plugins = config.plugins.filter((plugin: PluginOptionType) => {
        return !existingPlugins.includes(plugin?.name)
      })
      config.build.rollupOptions.external = config.build.rollupOptions.external.filter(
        (item: string) => !external.includes(item),
      )
    }
    return config
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

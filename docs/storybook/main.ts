// main.ts文件
import type { StorybookConfig } from '@storybook/vue3-vite'

const config: StorybookConfig = {
  stories: [
    './.stories/*.stories.@(js|jsx|mjs|ts|tsx|mdx)',
    '../packages/components/**/stories/*.stories.@(js|jsx|mjs|ts|tsx|mdx)',
  ],
  addons: [
    '@storybook/addon-onboarding',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-storysource',
  ],
  core: {
    builder: {
      name: '@storybook/builder-vite',
      options: {},
    },
  },
  async viteFinal(config, { configType }) {
    const { mergeConfig } = await import('vite')
    const excludePlugins = ['vite-plugin-cdn-import']
    const filterPluginsRecursive = (plugins: any[]): any[] => {
      return plugins.filter(Boolean).filter((item) => {
        if (Array.isArray(item)) {
          const filtered = filterPluginsRecursive(item)
          return filtered.length > 0
        }
        else {
          return !excludePlugins.includes(item.name)
        }
      })
    }
    config.plugins = filterPluginsRecursive(config.plugins || [])
    return mergeConfig(config, {
      mode: 'github',
    })
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

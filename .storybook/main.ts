import type { StorybookConfig } from '@storybook/vue3-vite'

const config: StorybookConfig = {
  stories: [
    './.stories/*.stories.@(js|jsx|mjs|ts|tsx|mdx)',
    '../src/components/**/stories/*.stories.@(js|jsx|mjs|ts|tsx|mdx)',
  ],
  addons: [
    '@storybook/addon-onboarding',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  core: {
    builder: {
      name: '@storybook/builder-vite',
      options: {},
    },
  },
  async viteFinal(config, { configType }) {
    const { mergeConfig } = await import('vite')
    if (configType === 'DEVELOPMENT') {
      // 开发环境
    }
    if (configType === 'PRODUCTION') {
      // 生产环境
    }
    const excludePlugins = ['vite-plugin-cdn-import']
    const filterPluginsRecursive = (plugins: any[]): any[] => {
      return plugins.filter((item) => {
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

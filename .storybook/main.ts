import type { StorybookConfig } from '@storybook/vue3-vite'
import { mergeConfig } from 'vite'
import viteConfig from '../vite.config'
import type { modeType } from '../vite.config'

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
    return config;
    // const { plugins, build } = viteConfig({ mode: configType,type: 'storybook' } as modeType)
    // return mergeConfig(config, {
    //   build,
    //   plugins
    // })
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

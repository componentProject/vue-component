import type { StorybookConfig } from '@storybook/vue3-vite'
import { mergeConfig } from 'vite'
import type { PluginOption } from "vite";
import viteConfig from '../vite.config'
import type { modeType } from '../vite.config'

type PluginOptionType = PluginOption & {
  name?: string;
};
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
    const { plugins, build } = viteConfig({ mode: configType,type: 'storybook' } as modeType)
    const mergeconfig = mergeConfig(config, {
      build,
      plugins,
    });
    mergeconfig.plugins = mergeconfig.plugins.filter((plugin: PluginOptionType) => {
      return plugin?.name != "vite-plugin-cdn-import";
    });
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

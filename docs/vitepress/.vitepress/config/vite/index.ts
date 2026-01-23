import cssModuleGlobalRootPlugin from '@moluoxixi/css-module-global-root-plugin'
import { getViteConfig } from '@moluoxixi/vite-config'
import { docsPath } from '../../../contants/index.ts'
import { MarkdownTransform } from './plugins/markdown-transform.ts'

const viteConfig = getViteConfig({
  rootPath: docsPath,
  vitepress: true,
  codeInspector: false,
  viteConfig: {
    ssr: {
      noExternal: ['element-plus'],
    },
    plugins: [
      MarkdownTransform() as any,
    ],
    server: {
      proxy: {
        '/ts-cache': {
          changeOrigin: true,
          target: 'http://192.168.209.103:84',
        },
        '/ts-fm': {
          changeOrigin: true,
          target: 'http://192.168.209.103:84',
        },
      },
    },
    css: {
      postcss: {
        plugins: [
          cssModuleGlobalRootPlugin(),
        ],
      },
      preprocessorOptions: {
        scss: {
          silenceDeprecations: ['legacy-js-api'],
          api: 'modern-compiler',
          additionalData: (source: string, filename: string) => {
            if (filename.includes('.vue')) {
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
})

export default viteConfig

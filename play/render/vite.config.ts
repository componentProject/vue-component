// 配置文件
import path from 'node:path'
import process from 'node:process'
import { loadEnv } from 'vite'
import cssModuleGlobalRootPlugin from '../../packages/utils/cssModuleGlobalRootPlugin/index.ts'
import { ViteConfig, wrapperEnv } from '../../packages/utils/ViteConfig/index.ts'

export default ViteConfig(
  ({ mode }) => {
    const env = loadEnv(mode!, process.cwd())
    const viteEnv = wrapperEnv(env)
    const rootPath = path.resolve()
    const appCode = viteEnv.VITE_APP_CODE
    const appTitle = viteEnv.VITE_APP_TITLE
    const port = viteEnv.VITE_PORT
    return {
      rootPath,
      appTitle,
      appCode,
      port,
      autoComponent: true,
      // pwa: {
      //   manifest: {
      //     icons: [
      //       {
      //         src: `/${appCode}/pwa-192x192.png`,
      //         sizes: '192x192',
      //         type: 'image/png',
      //         purpose: 'any' as const,
      //       },
      //       {
      //         src: `/${appCode}/pwa-512x512.png`,
      //         sizes: '512x512',
      //         type: 'image/png',
      //         purpose: 'any' as const,
      //       },
      //     ],
      //     // 桌面设备安装界面所需的屏幕截图
      //     screenshots: [
      //       {
      //         src: '/images/img.png',
      //         sizes: '1280x720',
      //         type: 'image/png',
      //         form_factor: 'wide' as const,
      //         label: '桌面端应用截图',
      //       },
      //     ],
      //   },
      // },
      autoRoutes: {
        routeConfig: {
          componentExamples: {
            glob: [
              '/../../packages/components/**/Example.vue',
              '!/../../packages/components/**/components/*',
              '!/../../packages/components/**/_*/*',
              '!/**/node_modules/**/*',
            ],
            baseRoute: '组件示例',
          },
          AllTestComponentExamples: {
            glob: [
              '/../../packages/components/_AllTestOrNoPublishComponents/**/Example.vue',
              '!/../../packages/components/_AllTestOrNoPublishComponents/**/components/*',
            ],
            baseRoute: '待发布/测试组件示例(放一些demo，也许后面会发布)',
          },
        },
      },
      viteConfig: {
        build: {
          outDir: '../../dist',
        },
        plugins: [],
        css: {
          postcss: {
            plugins: [
              cssModuleGlobalRootPlugin(),
            ],
          },
          preprocessorOptions: {
            scss: {
              api: 'modern-compiler',
              additionalData: (source: string, filename: string) => {
                if (filename.includes('.vue') && !filename.includes('AIAgent')) {
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
    }
  },
)

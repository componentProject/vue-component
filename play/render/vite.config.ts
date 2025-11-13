import path from 'node:path'
import process from 'node:process'
import { loadEnv } from 'vite'
import viteConfig, { wrapperEnv } from '../../packages/utils/ViteConfig/index.ts'

export default viteConfig(
  ({ mode }) => {
    const env = loadEnv(mode!, process.cwd())
    const viteEnv = wrapperEnv(env)
    const rootPath = path.resolve()
    return {
      rootPath,
      mode: {
        base: {
          appTitle: viteEnv.VITE_GLOB_APP_TITLE,
          appCode: viteEnv.VITE_GLOB_APP_CODE,
          port: 3301,
          autoComponent: false,
          // pwa: {
          //   manifest: {
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
          //
          // },
          autoRoutes: {
            routeConfig: {
              componentExamples: {
                glob: [
                  '/../../packages/components/**/Example.vue',
                  '!/../../packages/components/**/components/*',
                  '!/../../packages/components/**/_*/*',
                ],
                baseRoute: {
                  name: '组件示例',
                },
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
        },
        development: {},
        production: {},
      },
      viteConfig: {
        build: {
          outDir: '../../dist',
        },
        resolve: {
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
          alias: {
            '@moluoxixi/components': path.resolve(rootPath, '../../packages/components'),
            '@moluoxixi/utils': path.resolve(rootPath, '../../packages/utils'),
          },
        },
        plugins: [],
        server: {
          proxy: {
            // '/ts-bs-his-base': {
            //   target: `${viteEnv.VITE_PROXY_URL}`,
            //   secure: false,
            //   changeOrigin: true,
            //   configure: (proxy: any) => {
            //     const encryptedList = ['appId', 'randomStr', 'timestamp', 'version', 'sign']
            //     proxy.on('proxyReq', (proxyReq: any, req: any) => {
            //       encryptedList.forEach((item) => {
            //         proxyReq.setHeader(item, req.headers[item.toLocaleLowerCase()] || req.headers[item])
            //       })
            //     })
            //   },
            // },
            '/ompBase': {
              changeOrigin: true,
              target: 'http://192.168.209.103:9099',
            },
            '/ts-bs-his-base': {
              changeOrigin: true,
              target: 'http://192.168.208.26:9099',
            },
            '/ts-cache': {
              changeOrigin: true,
              target: 'http://192.168.209.103:9099',
            },
            '/ts-fm': {
              changeOrigin: true,
              target: 'http://192.168.209.103:9099',
            },
            '/ai-application': {
              // target: 'http://192.168.31.46:19061',
              target: 'http://192.168.209.101:19061',
              // target: 'http://192.168.31.218:19061',
              changeOrigin: true,
            },
            '/sso': {
              // target: 'http://192.168.211.135:8080',
              target: 'http://192.168.209.103:9099',
              changeOrigin: true,
            },
          },
        },
        css: {
          preprocessorOptions: {
            scss: {
              api: 'modern-compiler',
              additionalData: (source: string, filename: string) => {
                if (filename.includes('.vue') && !filename.includes('AIAgent')) {
                  return `@forward '@moluoxixi/components/_assets/styles/main.scss';
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

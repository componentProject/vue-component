import { getComponents } from './utils/serverUtils.ts'
import { buildBlogRSS } from './utils/rss.ts'

// https://github.com/mingyuLi97/blog
// https://vitepress.dev/reference/site-config
import { getSidebar } from './utils/index.js'

import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import mathjax3 from 'markdown-it-mathjax3'

import type { UserConfig } from 'vitepress'
import { demoblockPlugin, demoblockVitePlugin } from 'vitepress-theme-demoblock'
// vite vue插件
import vueJsx from '@vitejs/plugin-vue-jsx'
import { visualizer } from 'rollup-plugin-visualizer'

// 其余vite插件
import autoprefixer from 'autoprefixer'
import tailwindcss from '@tailwindcss/postcss'

import path from 'node:path'

import { githubConfig } from './constants/index.js'

async function config(): Promise<Awaited<UserConfig>> {
  const componentPath = '/components'
  const posts = await getComponents(componentPath)
  const pageSize = 5
  const postLength = posts.length

  const components = await getSidebar('components')
  const navs = await getSidebar('navs')

  const { repo, owner } = githubConfig
  console.log('repo', repo, owner)
  return {
    title: 'vueComponent',
    description: '一个vue组件库',
    base: `/${repo}/vitepress/`,
    lang: 'zh-CN',
    outDir: '../docs/vitepress',
    vite: {
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '../../src'),
        },
      },
      plugins: [
        demoblockVitePlugin() as any,
        vueJsx(),
        visualizer({
          open: true,
        }),
      ],
      // 添加 SSR 配置，解决 CSS 文件扩展名问题
      ssr: {
        noExternal: ['element-plus'],
      },
      css: {
        postcss: {
          plugins: [
            tailwindcss(),
            // 自动添加厂商前缀
            autoprefixer() as any,
          ],
        },
        preprocessorOptions: {
          scss: { api: 'modern-compiler' },
        },
      },
    },
    head: [
      [
        'link',
        {
          rel: 'icon',
          type: 'image/svg',
          href: `/${repo}/vitepress/horse.svg`,
        },
      ],
      [
        'meta',
        {
          name: 'author',
          content: 'moluoxixi',
        },
      ],
      [
        'meta',
        {
          property: 'og:title',
          content: 'Home',
        },
      ],
      [
        'meta',
        {
          property: 'og:description',
          content: 'Home of moluoxixi',
        },
      ],
    ],
    lastUpdated: false,
    markdown: {
      theme: {
        light: 'vitesse-light',
        dark: 'vitesse-dark',
      },
      codeTransformers: [transformerTwoslash() as any],
      config: (md: any) => {
        md.use(mathjax3)
        md.use(demoblockPlugin, {
          customClass: 'demoblock-custom',
        })
      },
    },
    themeConfig: {
      // https://vitepress.dev/reference/default-theme-config
      avator: `/${repo}/vitepress/avator.png`,
      // 标题
      siteTitle: 'vueComponent',
      // logo
      logo: `https://vuejs.org/images/logo.png`,
      logoLink: 'https://vuejs.org/',
      aside: false,
      // blogs page show firewokrs animation
      showFireworksAnimation: false,

      docsDir: '/.docs',
      posts,
      pageSize,
      postLength,

      buildEnd: buildBlogRSS,

      // 导航栏
      nav: [
        {
          text: '🏡Blogs',
          link: '/',
        },
        {
          text: 'storybook组件库',
          link: 'https://componentproject.github.io/vue-component/storybook/',
        },
        ...navs,
      ],

      // 侧边栏,配置基本同导航栏
      sidebar: {
        '/components/': components,
      },
      socialLinks: [
        {
          icon: 'github',
          link: `https://${owner}.github.io/${repo}/storybook`,
        },
      ],
      // 搜索配置
      search: {
        // local or algolia
        // provider: 'local'
        //#region algolia
        // algolia有两种方式,使用Crawler爬虫,或者github的DocSearch Scraper Action
        // 参考https://juejin.cn/post/7157340749065895944
        provider: 'algolia',
        options: {
          appId: 'DDD3D6CGWQ',
          apiKey: '3b7df1c9bcf3d1c31fa74e9707936af5',
          indexName: 'vueTemplateDoc',
        },
        //#endregion
      },
    },
  }
}

export default config()

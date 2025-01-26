import { defineConfig } from 'vitepress'
import { fileURLToPath, URL } from 'node:url'
// https://github.com/mingyuLi97/blog
// https://vitepress.dev/reference/site-config
import { getSidebar } from './utils'
import { vitepressDemoPlugin } from 'vitepress-demo-plugin';
export default defineConfig({
  title: 'vueComponent',
  description: '一个vue组件库',
  base: '/vue-component/vitepress/',
  lang: 'zh-CN',
  outDir: '../docs/vitepress',
  markdown: {
    config(md) {
      md.use(vitepressDemoPlugin)
    }
  },
  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('../../src', import.meta.url)),
      },
    },
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    // 标题
    siteTitle: 'vueComponent',
    // logo
    logo: `https://vuejs.org/images/logo.png`,
    logoLink: 'https://vuejs.org/',
    // 导航栏
    nav: [
      // 单层级
      { text: '首页', link: '/' },
      // 多层级
      {
        text: '基础组件',
        items: getSidebar('examples'),
      },
    ],

    // 侧边栏,配置基本同导航栏
    sidebar: {
      '/guide/': [
        {
          text: '指南',
          items: getSidebar('guide'),
        },
      ],
      '/examples/': [
        {
          text: '基础组件',
          items: getSidebar('examples'),
        },
      ],
    },
    // sidebar: [
    //   {
    //     text: '指南',
    //     link: '/guide/',
    //     items: [
    //       {
    //         text: '配置化表单',
    //         link: '/guide/configForm',
    //       },
    //     ],
    //   },
    //   {
    //     text: '基础组件',
    //     link: '/examples/',
    //     items: [{}],
    //   },
    // ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/componentProject/vue-component' }],
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
        indexName: 'vueComponent',
      },
      //#endregion
    },
  },
})

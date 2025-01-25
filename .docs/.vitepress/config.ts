import { defineConfig } from 'vitepress'
// https://github.com/mingyuLi97/blog
// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'vueComponent',
  description: '一个vue组件库',
  base: '/vue-component/',
  lang: 'zh-CN',
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
      { text: 'Home', link: '/' },
      // 多层级
      {
        text: 'examples',
        items: [
          {
            text: 'markdown-examples',
            items: [{ text: 'markdown-examples', link: '/markdown-examples' }],
          },
        ],
      },
    ],

    // 侧边栏,配置基本同导航栏
    sidebar: [
      // 单层级
      {
        text: 'Home',
        link: '/',
        // 是否可折叠
        collapsed: false,
      },
      // 多层级
      {
        text: 'examples',
        items: [
          {
            text: 'markdown-examples',
            items: [{ text: 'markdown-examples', link: '/markdown-examples' }],
          },
        ],
      },
    ],

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

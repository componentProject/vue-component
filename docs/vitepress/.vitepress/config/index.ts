// config入口文件
import { defineConfig } from 'vitepress'
import { baseUrl } from '../../contants/web.ts'
import head from './head.ts'
import markdown from './markdown/index.ts'
import themeConfig from './theme/index.ts'
import vite from './vite/index.ts'

/**
 * VitePress 主配置
 */
export default defineConfig({
  title: 'Moluoxixi Vue组件库',
  outDir: '../../docsOut/vitepress',
  description: '基于Vue3 + TypeScript + Element Plus的现代化组件库',
  lang: 'zh-CN',
  base: baseUrl,
  head,
  lastUpdated: true,
  themeConfig,
  markdown,
  vite,
})

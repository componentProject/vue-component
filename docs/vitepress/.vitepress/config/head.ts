// head.ts文件
import type { HeadConfig } from 'vitepress'
import { baseUrl } from '../../contants/web.ts'
/**
 * SEO关键词配置
 */
const content = [
  'vue3组件库',
  'moluoxixi组件库',
  'vue3',
  'element-plus',
  'typescript',
  'vite',
  'component library',
  'ui framework',
  'ui组件',
  '基础组件',
  '业务组件',
  '前端组件库',
  'vue组件',
].toString()

/**
 * HTML Head 配置
 */
const head: HeadConfig[] = [
  ['meta', { name: 'author', content: 'moluoxixi' }],
  [
    'meta',
    {
      name: 'viewport',
      content:
          'width=device-width,initial-scale=1,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no',
    },
  ],
  [
    'meta',
    {
      name: 'description',
      content: '基于Vue3 + TypeScript + Element Plus的现代化组件库，提供丰富的业务组件和工具函数',
    },
  ],
  ['meta', { name: 'keywords', content }],
  ['link', { rel: 'icon', href: `${baseUrl}/avator.png` }],
  ['link', { rel: 'apple-touch-icon', href: '/vueComponents/avator.png' }],
]
export default head

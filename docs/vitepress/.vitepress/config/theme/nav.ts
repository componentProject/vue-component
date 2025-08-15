import type { DefaultTheme } from 'vitepress'
import { generateComponentNav } from './utils/generateSidebar.ts'

import { docsPath, repoInfo } from '../../../contants/index.ts'
import path from 'node:path'
import fs from 'node:fs'

// 读取 package.json 获取版本信息
const pkgPath = path.resolve(docsPath, './package.json')
const pkgContent = fs.readFileSync(pkgPath, 'utf-8')
const pkg = JSON.parse(pkgContent)

/**
 * 导航栏配置
 */
export const nav: DefaultTheme.NavItem[] = [
  {
    text: '首页',
    link: '/',
  },
  {
    text: '指南',
    link: '/guide/guide',
  },
  generateComponentNav('/components/Overview'),
  {
    text: 'GitHub',
    link: repoInfo.url,
  },
  {
    text: `v${pkg.version}`,
    link: repoInfo.releasesUrl,
  },
]

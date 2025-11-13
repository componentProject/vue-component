// sidebar.ts文件
import type { DefaultTheme } from 'vitepress'
import { generateSidebar } from './utils/generateSidebar.ts'

/**
 * 侧边栏配置
 * 动态生成 guide 和 components 文件夹的侧边栏
 */
export const sidebar: DefaultTheme.Sidebar = generateSidebar(['guide', 'components'])

// socialLinks.ts文件
import type { DefaultTheme } from 'vitepress'
import { repoInfo } from '../../../contants/index.ts'

/**
 * 社交链接配置
 */
export const socialLinks: DefaultTheme.SocialLink[] = [
  { icon: 'github', link: repoInfo.url },
]

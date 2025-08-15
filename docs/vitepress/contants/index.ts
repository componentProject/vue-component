import path from 'node:path'
import { getRepoInfoWithFallback } from './utils/getRepoInfo.ts'

export const REPO_BRANCH = 'main'
export const rootPath = path.resolve(__dirname, '../../..')
export const docsPath = path.resolve(rootPath, 'docs/vitepress')
// 获取仓库信息
export const repoInfo = getRepoInfoWithFallback()

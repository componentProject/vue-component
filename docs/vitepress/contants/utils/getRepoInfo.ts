// getRepoInfo.ts文件
import fs from 'node:fs'
import path from 'node:path'
import { docsPath } from '../index.ts'

export interface RepoInfo {
  owner: string
  repo: string
  url: string
  httpsUrl: string
  issuesUrl: string
  releasesUrl: string
  discussionsUrl: string
  contributorsUrl: string
  licenseUrl: string
}

/**
 * 从package.json读取仓库信息
 */
export function getRepoInfo(): RepoInfo | null {
  try {
    // 查找package.json文件

    const pkgPath = path.resolve(docsPath, './package.json')

    if (!pkgPath) {
      console.error('❌ 未找到 package.json 文件')
      return null
    }

    console.log('📄 读取 package.json:', pkgPath)
    const pkgContent = fs.readFileSync(pkgPath, 'utf-8')
    const pkg = JSON.parse(pkgContent)

    if (!pkg.repository || !pkg.repository.url) {
      console.error('❌ package.json 中没有 repository 字段')
      return null
    }

    // 解析 repository URL
    const repoUrl = pkg.repository.url

    // 支持多种格式的 repository URL
    let httpsUrl = ''

    if (repoUrl.startsWith('git+https://')) {
      httpsUrl = repoUrl.replace('git+', '').replace('.git', '')
    }
    else if (repoUrl.startsWith('git@')) {
      httpsUrl = repoUrl.replace('git@', 'https://').replace('.git', '')
    }
    else if (repoUrl.startsWith('https://')) {
      httpsUrl = repoUrl.replace('.git', '')
    }
    else if (repoUrl.startsWith('git://')) {
      httpsUrl = repoUrl.replace('git://', 'https://').replace('.git', '')
    }
    else {
      console.error('❌ 不支持的 repository URL 格式:', repoUrl)
      return null
    }

    // 提取 owner 和 repo 名称
    const urlMatch = httpsUrl.match(/https:\/\/github\.com\/([^/]+)\/([^/]+)/)
    if (!urlMatch) {
      console.error('❌ 无法解析 GitHub URL:', httpsUrl)
      return null
    }

    const [, owner, repo] = urlMatch

    const repoInfo: RepoInfo = {
      owner,
      repo,
      url: httpsUrl,
      httpsUrl,
      issuesUrl: `${httpsUrl}/issues`,
      releasesUrl: `${httpsUrl}/releases`,
      discussionsUrl: `${httpsUrl}/discussions`,
      contributorsUrl: `${httpsUrl}/graphs/contributors`,
      licenseUrl: `${httpsUrl}/blob/main/LICENSE`,
    }

    console.log('✅ 仓库信息解析成功:', {
      owner: repoInfo.owner,
      repo: repoInfo.repo,
      url: repoInfo.url,
    })

    return repoInfo
  }
  catch (error) {
    console.error('❌ 读取仓库信息失败:', error)
    return null
  }
}

/**
 * 获取仓库信息，如果失败则返回默认值
 */
export function getRepoInfoWithFallback(defaultRepoInfo: RepoInfo): RepoInfo {
  const repoInfo = getRepoInfo()

  if (repoInfo) {
    return repoInfo
  }

  // 默认值
  console.log('🔄 使用默认仓库信息')
  return defaultRepoInfo
}

// contants入口文件
import path from 'node:path'
import { getRepoInfoWithFallback } from './utils/getRepoInfo.ts'

export const REPO_BRANCH = 'main'
export const rootPath = path.resolve(__dirname, '../../..')
export const docsPath = path.resolve(rootPath, 'docs/vitepress')
// 获取仓库信息
export const repoInfo = getRepoInfoWithFallback({
  owner: 'componentProject',
  repo: 'vue-component',
  url: 'http://192.168.18.106/middle-tec/front-web/vue-component',
  httpsUrl: 'http://192.168.18.106/middle-tec/front-web/vue-component',
  issuesUrl: 'http://192.168.18.106/middle-tec/front-web/vue-component/issues',
  releasesUrl: 'http://192.168.18.106/middle-tec/front-web/vue-component/releases',
  discussionsUrl: 'http://192.168.18.106/middle-tec/front-web/vue-component/discussions',
  contributorsUrl: 'http://192.168.18.106/middle-tec/front-web/vue-component/graphs/contributors',
  licenseUrl: 'http://192.168.18.106/middle-tec/front-web/vue-component/blob/main/LICENSE',
})

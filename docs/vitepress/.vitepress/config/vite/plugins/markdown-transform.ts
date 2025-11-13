import type { Plugin } from 'vite'
/**
 * Vite 插件：Markdown 文档转换
 *
 * 该插件主要用于转换 Element Plus 组件的 Markdown 文档，添加必要的脚本设置、页眉和页脚内容。
 * 主要功能包括：
 * 1. 自动导入组件示例文件
 * 2. 处理自定义的 <vp-script setup> 标签
 * 3. 为组件文档添加源码链接和贡献者信息
 */
import fs from 'node:fs'
import path from 'node:path'
import glob from 'fast-glob'

import { docsPath, REPO_BRANCH, repoInfo, rootPath } from '../../../../contants/index.ts'

// GitHub 链接常量
const GITHUB_BLOB_URL = `${repoInfo.url}/blob/${REPO_BRANCH}`
const GITHUB_TREE_URL = `${repoInfo.url}/tree/${REPO_BRANCH}`
const COMPONENTS_PATH = `/packages/components`
const COMPONENTS_DOCS_BASE_URL = `${GITHUB_BLOB_URL}/docs/vitepress/components`
const COMPONENTS_BASE_URL = `${GITHUB_TREE_URL}${COMPONENTS_PATH}`
// 定义要追加到 Markdown 文件的内容类型
type Append = Record<'headers' | 'footers', string[]>

// 存储组件路径的全局变量
let compPaths: string[]

/**
 * Markdown 转换插件主函数
 * @returns Vite 插件对象
 */
export function MarkdownTransform(): Plugin {
  return {
    name: 'md-transform',

    // 在其他插件之前执行
    enforce: 'pre',

    /**
     * 构建开始时的钩子函数
     * 查找并存储所有语言的组件文档路径
     */
    async buildStart() {
      // 构建 glob 模式匹配字符串，如：{zh,en}/component

      // 使用 fast-glob 查找所有组件文档目录
      compPaths = await glob(['./components'], {
        cwd: docsPath,
        absolute: true,
        onlyDirectories: true,
      })
      console.log('compPaths', compPaths)
    },

    /**
     * 转换 Markdown 文件的核心函数
     * @param code 原始 Markdown 内容
     * @param id 文件路径
     * @returns 转换后的 Markdown 内容
     */
    async transform(code, id) {
      // 只处理 .md 文件
      if (!id.endsWith('.md'))
        return

      // 初始化要追加的内容
      const append: Append = {
        headers: [],
        footers: [],
      }
      let compPath = compPaths.find(compPath => id.startsWith(compPath))
      if (!compPath?.endsWith('/')) {
        compPath += '/'
      }
      // 如果是组件文档，则添加额外的转换处理
      if (compPath) {
        code = transformComponentMarkdown(id, id.replace(compPath, ''), code, append)
      }

      // 组合并返回最终的 Markdown 内容
      return combineMarkdown(
        code,
        [...append.headers],
        append.footers,
      )
    },
  }
}

/**
 * 组合 Markdown 内容
 * @param code 原始 Markdown 内容
 * @param headers 要添加到开头的头部内容
 * @param footers 要添加到末尾的底部内容
 * @returns 组合后的完整 Markdown 内容
 */
function combineMarkdown(code: string, headers: string[], footers: string[]) {
  // 查找 frontmatter 结束位置
  const frontmatterEnds = code.indexOf('---\n\n')
  // 查找第一个标题位置
  const firstHeader = code.search(/\n#{1,6}\s.+/)
  // 确定插入位置
  const sliceIndex
    = firstHeader < 0
      ? frontmatterEnds < 0
        ? 0
        : frontmatterEnds + 4
      : firstHeader

  // 插入头部内容
  if (headers.length > 0) {
    code
      = code.slice(0, sliceIndex) + headers.join('\n') + code.slice(sliceIndex)
  }

  // 追加底部内容
  code += footers.join('\n')

  return `${code}\n`
}

/**
 * 转换组件 Markdown 文档
 * @param id 文件路径
 * @param componentId 组件 ID
 * @param code 原始 Markdown 内容
 * @param append 要追加的内容对象
 * @returns 处理后的 Markdown 内容
 */
function transformComponentMarkdown(id: string, componentId: string, code: string, append: Append) {
  const baseComponentId = path.basename(componentId, '.md')

  // 构建相关链接
  const docUrl = `${COMPONENTS_DOCS_BASE_URL}/${componentId}`
  const componentUrl = `${COMPONENTS_BASE_URL}/${baseComponentId}`

  // 检查组件和样式文件是否存在
  const componentPath = path.resolve(
    rootPath,
    `./${COMPONENTS_PATH}/${baseComponentId}`,
  )
  const isComponent = fs.existsSync(componentPath)

  // 构建链接数组
  const links = [['文档', docUrl]]

  if (isComponent)
    links.unshift(['组件', componentUrl])

  // 生成链接文本
  const linksText = links
    .filter(i => i)
    .map(([text, link]) => `[${text}](${link})`)
    .join(' • ')

  // 构建源码部分和贡献者部分内容
  const sourceSection = `
### 源码

${linksText}`

  const contributorsSection = `
### 贡献者

<Contributors id="${componentId}" />`

  // 将内容添加到页脚
  if (isComponent) {
    append.footers.push(sourceSection, contributorsSection)
  }

  return code
}

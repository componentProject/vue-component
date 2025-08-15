import type MarkdownIt from 'markdown-it'

/**
 * 这个插件为 VitePress 添加了自定义的 tooltip 语法支持
 * 语法格式: ^[type](`details`)
 * 例如: ^[string](`可选的详细信息`)
 */
export default (md: MarkdownIt): void => {
  // 定义 tooltip 标记的渲染规则
  md.renderer.rules.tooltip = (tokens, idx) => {
    const token = tokens[idx]
    // 将标记渲染为自定义的 Vue 组件
    return `<api-typing type="${token.content}" details="${token.info}" />`
  }

  // 在强调语法之前添加 tooltip 语法解析规则
  md.inline.ruler.before('emphasis', 'tooltip', (state, silent) => {
    // 定义匹配 tooltip 语法的正则表达式
    // 匹配 ^[content](`optional`) 格式
    const tooltipRegExp = /^\^\[([^\]]*)\](`[^`]*`)?/
    const str = state.src.slice(state.pos, state.posMax)

    // 如果不匹配语法，返回 false
    if (!tooltipRegExp.test(str))
      return false
    // 如果是预解析阶段，只返回 true 表示匹配成功
    if (silent)
      return true

    // 提取匹配结果
    const result = str.match(tooltipRegExp)

    if (!result)
      return false

    // 创建新的 token
    const token = state.push('tooltip', 'tooltip', 0)
    // 处理内容中的转义竖线
    token.content = result[1].replace(/\\\|/g, '|')
    // 提取并清理 details 信息（去除反引号）
    token.info = (result[2] || '').replace(/^`(.*)`$/, '$1')
    token.level = state.level
    // 更新解析位置
    state.pos += result[0].length

    return true
  })
}

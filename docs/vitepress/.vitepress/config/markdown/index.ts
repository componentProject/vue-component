// markdown入口文件
import mdPlugin from './plugins/index.ts'

/**
 * Markdown 配置
 */
const markdownConfig = {
  lineNumbers: true,
  config: (md: any) => mdPlugin(md),
}
export default markdownConfig

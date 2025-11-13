// plugins入口文件
import type MarkdownIt from 'markdown-it'
import demoPlugin from './demo.ts'
import repositoryPlugin from './repository.ts'
import tooltipPlugin from './tooltip.ts'

export default function mdPlugin(md: MarkdownIt) {
  demoPlugin(md)
  repositoryPlugin(md)
  tooltipPlugin(md)
}

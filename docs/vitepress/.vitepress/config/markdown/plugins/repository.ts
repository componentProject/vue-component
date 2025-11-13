// repository.ts文件
import type MarkdownIt from 'markdown-it'
import type Renderer from 'markdown-it/lib/renderer.d.ts'
import type Token from 'markdown-it/lib/token.d.ts'
import mdContainer from 'markdown-it-container'
import { repoInfo } from '../../../../contants/index.ts'

interface ContainerOpts {
  marker?: string | undefined
  validate?: (params: string) => boolean
  render?: (tokens: Token[], index: number, options: any, env: any, self: Renderer) => string
}

export default function repositoryPlugin(md: MarkdownIt) {
  md.use(mdContainer as any, 'repository', {
    validate(params) {
      // eslint-disable-next-line regexp/no-super-linear-backtracking
      return !!params.trim().match(/^repository\s*(.*)$/)
    },

    render(tokens, idx) {
      // eslint-disable-next-line regexp/no-super-linear-backtracking
      const m = tokens[idx].info.trim().match(/^repository\s+(.*)$/)
      const description = m && m.length > 1 ? `${m[1]}：` : ''
      if (tokens[idx].nesting === 1 /* means the tag is opening */) {
        const sourceFileToken = tokens[idx + 2]
        const sourceFile = sourceFileToken.children?.[0].content ?? ''

        return `${description}<a href="${repoInfo.url}/tree/vueComponent/packages/components/${sourceFile}" target="_blank" rel="noreferrer">`
      }
      else {
        return '</a>'
      }
    },
  } as ContainerOpts)
}

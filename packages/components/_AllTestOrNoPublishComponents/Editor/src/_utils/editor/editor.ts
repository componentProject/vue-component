// _AllTestOrNoPublishComponents的editor组件
import type * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { buildMonacoOptions } from './common'

export interface CreateMonacoEditorOptions extends Partial<monaco.editor.IStandaloneEditorConstructionOptions> {
  /** 初始化内容 */
  value: string
  /** 语言（如 'javascript' | 'typescript' | 'json' 等） */
  language: string
  /** 仅用于切换主题，不参与构造选项合并 */
  theme?: string
}

export function createMonacoEditor(
  container: HTMLElement,
  monacoInstance: typeof monaco,
  options: CreateMonacoEditorOptions,
): monaco.editor.IStandaloneCodeEditor {
  const { theme, ...restOptions } = options
  const standaloneOptions = buildMonacoOptions<monaco.editor.IStandaloneEditorConstructionOptions>({
    ...(restOptions as Partial<monaco.editor.IStandaloneEditorConstructionOptions>),
    value: options.value ?? '',
    language: options.language,
  })
  const instance = monacoInstance.editor.create(container, standaloneOptions)
  if (theme)
    monacoInstance.editor.setTheme(theme)
  return instance
}

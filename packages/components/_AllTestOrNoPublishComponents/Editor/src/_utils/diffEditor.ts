// _AllTestOrNoPublishComponents的diffEditor组件
import type * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { buildMonacoOptions } from './editor/common'

export interface CreateMonacoDiffEditorOptions {
  originalValue: string
  modifiedValue: string
  language: string
  theme?: string
  renderSideBySide?: boolean
}

export function createMonacoDiffEditor(
  container: HTMLElement,
  monacoInstance: typeof monaco,
  options: CreateMonacoDiffEditorOptions,
): monaco.editor.IStandaloneDiffEditor {
  const diffOptions = buildMonacoOptions<monaco.editor.IDiffEditorConstructionOptions>({
    originalEditable: false,
    renderSideBySide: options.renderSideBySide ?? true,
  })
  const diffEditor = monacoInstance.editor.createDiffEditor(container, diffOptions)
  if (options.theme)
    monacoInstance.editor.setTheme(options.theme)

  const originalModel = monacoInstance.editor.createModel(
    options.originalValue ?? '',
    options.language,
  )
  const modifiedModel = monacoInstance.editor.createModel(
    options.modifiedValue ?? '',
    options.language,
  )

  diffEditor.setModel({ original: originalModel, modified: modifiedModel })

  return diffEditor
}

import type * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { buildMonacoOptions } from './common'

export interface CreateMonacoDiffEditorOptions extends Partial<monaco.editor.IDiffEditorConstructionOptions> {
  originalValue: string
  modifiedValue: string
  language: string
  theme?: string
}

export function createMonacoDiffEditor(
  container: HTMLElement,
  monacoInstance: typeof monaco,
  options: CreateMonacoDiffEditorOptions,
): monaco.editor.IStandaloneDiffEditor {
  const { theme, originalValue, modifiedValue, language, ...restOptions } = options
  const diffOptions = buildMonacoOptions<monaco.editor.IDiffEditorConstructionOptions>({
    ...(restOptions as Partial<monaco.editor.IDiffEditorConstructionOptions>),
  })
  const diffEditor = monacoInstance.editor.createDiffEditor(container, diffOptions)
  if (theme)
    monacoInstance.editor.setTheme(theme)

  const originalModel = monacoInstance.editor.createModel(
    originalValue ?? '',
    language,
  )
  const modifiedModel = monacoInstance.editor.createModel(
    modifiedValue ?? '',
    language,
  )

  diffEditor.setModel({ original: originalModel, modified: modifiedModel })

  return diffEditor
}

import type * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { buildMonacoOptions } from './common'

export interface CreateMonacoEditorOptions {
  value: string
  language: string
  theme?: string
}

export function createMonacoEditor(
  container: HTMLElement,
  monacoInstance: typeof monaco,
  options: CreateMonacoEditorOptions,
): monaco.editor.IStandaloneCodeEditor {
  const standaloneOptions = buildMonacoOptions<monaco.editor.IStandaloneEditorConstructionOptions>({
    value: options.value ?? '',
    language: options.language,
  })
  const instance = monacoInstance.editor.create(container, standaloneOptions)
  if (options.theme)
    monacoInstance.editor.setTheme(options.theme)
  return instance
}

import type * as monaco from 'monaco-editor/esm/vs/editor/editor.api'

export interface CommonMonacoOptions {
  theme?: string
  fontSize?: number
  readOnly?: boolean
  cursorSmoothCaretAnimation?: 'on' | 'off'
  formatOnPaste?: boolean
  mouseWheelZoom?: boolean
  folding?: boolean
  automaticLayout?: boolean
  minimap?: { enabled: boolean }
  scrollBeyondLastLine?: boolean
  scrollbar?: { verticalScrollbarSize: number, horizontalScrollbarSize: number }
  glyphMargin?: boolean
  overviewRulerBorder?: boolean
}

export const defaultCommonMonacoOptions: CommonMonacoOptions = {
  theme: undefined,
  fontSize: 14,
  readOnly: false,
  cursorSmoothCaretAnimation: 'on',
  formatOnPaste: true,
  mouseWheelZoom: true,
  folding: true,
  automaticLayout: true,
  minimap: { enabled: true },
  scrollBeyondLastLine: false,
  scrollbar: {
    verticalScrollbarSize: 2,
    horizontalScrollbarSize: 2,
  },
  glyphMargin: true,
  overviewRulerBorder: false,
}

export function buildMonacoOptions<
  T extends
  | monaco.editor.IStandaloneEditorConstructionOptions
  | monaco.editor.IDiffEditorConstructionOptions,
>(overrides: Partial<T> = {} as Partial<T>): T {
  const base = { ...defaultCommonMonacoOptions } as unknown as T
  return { ...(base as object), ...overrides } as T
}

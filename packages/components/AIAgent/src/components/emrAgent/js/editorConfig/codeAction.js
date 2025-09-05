// 按需引入 Monaco Editor 模块
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'

export const ActionId = 'medical.qc.fix'

export function codeAction(model, range, context) {
  // 只处理当前光标所在行的 marker
  const markers = context.markers
    .filter(m => m.severity === monaco.MarkerSeverity.Error)
    .filter(m => m.startLineNumber === range.startLineNumber)

  if (!markers.length)
    return { actions: [], dispose: () => { } }

  // 每行只显示一个修复按钮
  const actions = [{
    title: '创星AI助手快速修复',
    diagnostics: [markers[0]],
    kind: 'quickfix',
    command: {
      id: ActionId,
      title: '快速修复',
      arguments: [markers[0]],
    },
    isPreferred: true,
  }]
  return { actions, dispose: () => { } }
}

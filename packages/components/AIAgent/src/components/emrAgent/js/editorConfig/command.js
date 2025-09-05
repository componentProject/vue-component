// 按需引入 Monaco Editor 模块
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import MedicalLanguage from './language'

export function dealTabCommand(editor) {
  if (!editor) {
    return
  }

  const position = editor.getPosition()
  const model = editor.getModel()
  const totalLines = model.getLineCount()

  // ghost text 优先
  if (MedicalLanguage.lastGhostObject.lineNumber === position.lineNumber && MedicalLanguage.lastGhostObject.text) {
    const insertText = MedicalLanguage.lastGhostObject.text
    const maxColumn = model.getLineMaxColumn(position.lineNumber)

    // 确保范围有效
    if (maxColumn > 1) {
      const range = new monaco.Range(
        position.lineNumber,
        1,
        position.lineNumber,
        maxColumn,
      )

      try {
        editor.executeEdits('ghost-complete', [{
          range,
          text: insertText,
        }])
      }
      catch (error) {
        console.warn('执行幽灵文本替换时出现警告（可忽略）:', error.message)
      }
    }

    // 清除幽灵文本状态
    MedicalLanguage.lastGhostObject = {
      lineNumber: 0,
      text: '',
      id: '',
      deCode: '',
      name: '',
      unit: '',
    }
    return
  }

  // 跳转到下一行冒号后
  if (position.lineNumber < totalLines) {
    const nextLineContent = model.getLineContent(position.lineNumber + 1)
    if (!nextLineContent || nextLineContent === '') {
      return
    }

    editor.setPosition({
      lineNumber: position.lineNumber + 1,
      column: nextLineContent.length + 1,
    })
  }
}

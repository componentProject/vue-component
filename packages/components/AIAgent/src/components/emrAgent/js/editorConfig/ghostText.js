import MedicalLanguage from './language'

export function getGhostTextCompletion(model, position) {
  const items = []
  const lineContent = model.getLineContent(position.lineNumber)
  const ghostObject = MedicalLanguage.lastGhostObject
  const lineBeforeContent = lineContent.substring(0, position.column - 1)
  const targetBeforeContent = ghostObject.text.substring(0, position.column - 1)
  const targetContent = ghostObject.text.substring(position.column - 1)
  const maxColumn = model.getLineMaxColumn(position.lineNumber)

  if (ghostObject.lineNumber === position.lineNumber && ghostObject.text && lineBeforeContent == targetBeforeContent) {
    items.push({
      text: targetContent, // 只插入差异部分
      range: {
        startLineNumber: position.lineNumber,
        startColumn: position.column,
        endLineNumber: position.lineNumber,
        endColumn: position.column == maxColumn ? maxColumn : maxColumn - 1,
      },
      command: undefined,
    })
  }
  if (items.length) {
    console.groupCollapsed('getGhostTextCompletion')
    console.log('aiContent', ghostObject.text)
    console.log('lineBeforeContent', lineBeforeContent)
    console.log('targetBeforeContent', targetBeforeContent)
    console.log('column', position.column)
    console.groupEnd()
  }
  return { items }
}

// AIAgent的constrained组件
import constrainedEditor from 'constrained-editor-plugin'
import * as monaco from 'monaco-editor'

export function initConstrainedEditor(editorInstance) {
  const constrainedInstance = constrainedEditor(monaco)
  constrainedInstance.initializeIn(editorInstance)
  let model = editorInstance.getModel()

  model = constrainedInstance.addRestrictionsTo(model, [
    {
      range: [1, 4, 1, 4], // [startLine, startColumn, endLine, endColumn]
      label: 'readonlyField',
    },
    {
      range: [2, 5, 2, 5], // [startLine, startColumn, endLine, endColumn]
      label: 'readonlyField',
    },
    {
      range: [3, 5, 3, 5], // [startLine, startColumn, endLine, endColumn]
      label: 'readonlyField',
    },
    {
      range: [4, 6, 4, 6], // [startLine, startColumn, endLine, endColumn]
      label: 'readonlyField',
    },
    {
      range: [5, 6, 5, 6], // [startLine, startColumn, endLine, endColumn]
      label: 'readonlyField',
    },
    {
      range: [6, 4, 6, 4], // [startLine, startColumn, endLine, endColumn]
      label: 'readonlyField',
    },
    {
      range: [7, 4, 7, 4], // [startLine, startColumn, endLine, endColumn]
      label: 'readonlyField',
    },
    {
      range: [8, 6, 8, 6], // [startLine, startColumn, endLine, endColumn]
      label: 'readonlyField',
    },
    // ...更多区间
  ])

  model.toggleHighlightOfEditableAreas({
    cssClassForSingleLine: 'editableArea--single-line',
    cssClassForMultiLine: 'editableArea--multi-line',
  })
}

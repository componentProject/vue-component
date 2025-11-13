// AIAgent的suggestions组件
import { keywords } from './keyword'
// 按需引入 Monaco Editor 模块
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'

export function getSuggestions() {
  const suggestions = []
  for (const key in keywords) {
    keywords[key].forEach((word) => {
      suggestions.push({
        label: word,
        kind: monaco.languages.CompletionItemKind.Text,
        insertText: word,
      })
    })
  }
  return suggestions
}

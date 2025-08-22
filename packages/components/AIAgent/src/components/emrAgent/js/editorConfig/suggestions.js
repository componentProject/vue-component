import { keywords } from './keyword'
import * as monaco from 'monaco-editor';

export const getSuggestions = () => {
    const suggestions = []
    for (const key in keywords) {
        keywords[key].forEach(word => {
            suggestions.push({
                label: word,
                kind: monaco.languages.CompletionItemKind.Text,
                insertText: word
            })
        })
    }
    return suggestions
}

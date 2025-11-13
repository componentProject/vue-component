// AIAgent的language组件
import { keywords } from './keyword'
import { themeName, themeRules } from './theme'
// 按需引入 Monaco Editor 模块
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { getSuggestions } from './suggestions'
import { getGhostTextCompletion } from './ghostText'
import { ActionId, codeAction } from './codeAction'

const MedicalLanguage = {
  languageName: 'MedicalLanguage',
  markName: 'medicalQC',
  lastGhostObject: {
    lineNumber: 0,
    text: '',
    id: '',
    deCode: '',
    name: '',
    unit: '',
  },

  initLanguage(handleCodeAction) {
    // 1. 注册自定义语言
    monaco.languages.register({ id: MedicalLanguage.languageName })

    // 2. 动态生成 Monarch 规则
    const reserved = keywords.reserved.join('|')
    const symptoms = keywords.symptoms.join('|')
    const diagnosis = keywords.diagnosis.join('|')
    const drugs = keywords.drugs.join('|')
    monaco.languages.setMonarchTokensProvider(MedicalLanguage.languageName, {
      tokenizer: {
        root: [
          [new RegExp(`(${reserved})`), 'reserved'],
          [new RegExp(`(${symptoms})`), 'symptom'],
          [new RegExp(`(${diagnosis})`), 'diagnosis'],
          [new RegExp(`(${drugs})`), 'drug'],
          [/./, ''],
        ],
      },
    })

    // 3. 自定义主题
    monaco.editor.defineTheme(themeName, {
      base: 'vs',
      rules: themeRules,
      inherit: true,
      colors: {},
    })

    // 4. 注册自动补全
    monaco.languages.registerCompletionItemProvider(MedicalLanguage.languageName, {
      provideCompletionItems() {
        return {
          suggestions: getSuggestions(),
        }
      },
    })

    // 5. 注册幽灵文本
    monaco.languages.registerInlineCompletionsProvider(MedicalLanguage.languageName, {
      provideInlineCompletions(model, position) {
        if (!MedicalLanguage.lastGhostObject)
          return { items: [] }
        return getGhostTextCompletion(model, position, MedicalLanguage.lastGhostObject)
      },
      handleItemDidShow() { },
      freeInlineCompletions() { },
    })

    // 6. 注册代码操作
    monaco.languages.registerCodeActionProvider(MedicalLanguage.languageName, {
      provideCodeActions: codeAction,
    })

    // 7. 注册代码操作处理
    monaco.editor.registerCommand(ActionId, handleCodeAction)
  },
}

export default MedicalLanguage

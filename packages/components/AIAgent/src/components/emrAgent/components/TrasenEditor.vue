<!-- AIAgent的TrasenEditor组件 -->
<template>
  <div class="editor-container">
    <div class="readonly-info-container">
      <div v-for="item in patientInfo" :key="item.deCode" class="readonly-info-item">
        <div class="readonly-info-item-title">
          {{ item.name }}:
        </div>
        <div
          class="readonly-info-item-content"
          :class="{ 'important-content': importantContent.includes(item.deCode) }"
        >
          {{ item.content || "" }}
        </div>
      </div>
    </div>
    <div v-if="showRegenerate" class="regenerate-btn-container">
      <div class="regenerate-btn-item" @click="handleRegenerate">
        <i class="ai-iconfont icon-refresh" />重新生成
      </div>
    </div>
    <div class="monaco-editor-container">
      <div ref="editorContainer" class="monaco-editor" />
    </div>
    <div class="bottom-tip">
      内容由AI生成，仅供参考。
    </div>
    <AILoading :visible="isGeneratingEmr" />
  </div>
</template>

<script>
// 按需引入 Monaco Editor 核心模块
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import 'monaco-editor/esm/vs/editor/contrib/contextmenu/contextmenu.js'
import 'monaco-editor/esm/vs/editor/contrib/inlineCompletions/ghostTextController.js'
// import 'monaco-editor/esm/vs/editor/contrib/suggest/browser/suggestController.js'; // 代码联想提示
// import 'monaco-editor/esm/vs/editor/contrib/tokenization/browser/tokenization.js'; // 代码联想提示

import AILoading from '../../ui/Loading.vue'
import { getModelField, updateEmrContentByLineNumber } from '../js/editorConfig/model'
import MedicalLanguage from '../js/editorConfig/language'
import { themeName } from '../js/editorConfig/theme'
import { dealTabCommand } from '../js/editorConfig/command'
import contextMenuManager from '../js/editorConfig/contextMenu'

let editorInstance = null
export default {
  name: 'TrasenEditor',
  components: {
    AILoading,
  },
  props: {
    emr_data: {
      type: Object,
      default: () => ({}),
    },
    isGeneratingEmr: {
      type: Boolean,
      default: false,
    },
    showRegenerate: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isInit: false,
      patientInfo: this.emr_data?.readOnly || [],
      emrInfo: this.emr_data?.normal || [],
      selectedLineNum: [],
      localEmrData: { ...this.emr_data },
      continueTimer: null,
      importantContent: ['DE02.01.039.01', 'DE02.01.040.00', 'DE02.01.026.00'],
    }
  },

  watch: {
    emr_data: {
      handler(newVal) {
        if (newVal instanceof Object) {
          this.patientInfo = newVal?.readOnly || []
          this.emrInfo = newVal?.normal || []
          this.clearGhostText()
          if (!this.isInit) {
            this.initEditor()
          }
          else {
            // this.updateAllEmrData();
            const model = editorInstance.getModel()
            const content = getModelField(this.emrInfo)
            model.setValue(content)
          }
        }
      },
      immediate: true,
    },
    localEmrData: {
      handler(val) {
        if (JSON.stringify(val) !== JSON.stringify(this.emr_data)) {
          this.$emit('update:emr_data', val)
        }
      },
      deep: true,
    },
  },
  beforeUnmount() {
    contextMenuManager.destroyContextMenu()
    if (editorInstance) {
      editorInstance.dispose()
      editorInstance = null
    }
    if (this.continueTimer) {
      clearTimeout(this.continueTimer)
      this.continueTimer = null
    }
  },
  methods: {
    initEditor() {
      if (!this.$refs.editorContainer)
        return

      MedicalLanguage.initLanguage(this.handleCodeAction)
      const model = getModelField(this.emrInfo)
      editorInstance = monaco.editor.create(this.$refs.editorContainer, {
        value: model,
        language: MedicalLanguage.languageName,
        wordWrap: 'on',
        theme: themeName,
        automaticLayout: true,
        fontSize: 16,
        lineHeight: 32,
        contextmenu: false,
        minimap: { enabled: false },
        lineNumbers(lineNumber) {
          // 自定义行号显示逻辑
          let lineNumberStr = ''
          if (lineNumber < 10) {
            lineNumberStr = `0${lineNumber.toString()}`
          }
          else {
            lineNumberStr = lineNumber.toString()
          }
          return `${lineNumberStr}、`
        },
        lineNumbersMinChars: 2,
        unicodeHighlight: {
          nonBasicASCII: false,
          ambiguousCharacters: false,
          invisibleCharacters: false,
        },
      })

      // 注册tab命令
      editorInstance.addCommand(monaco.KeyCode.Tab, () => {
        dealTabCommand(editorInstance)
      })

      // 约束只读字段
      // initConstrainedEditor(editorInstance)

      // 编辑器内容变更
      editorInstance.onDidChangeModelContent(() => {
        const position = editorInstance.getPosition()
        const model = editorInstance.getModel()
        const lineContent = model.getLineContent(position.lineNumber)
        updateEmrContentByLineNumber(this.emrInfo, position.lineNumber, lineContent)
        this.clearGhostText()
      })

      // 编辑器光标停留
      editorInstance.onDidChangeCursorPosition((e) => {
        this.clearGhostText()
        const markers = monaco.editor.getModelMarkers(
          editorInstance.getModel(),
          MedicalLanguage.markName,
        )
        const currentLineMarkers = markers.filter(
          m => m.startLineNumber === e.position.lineNumber,
        )
        if (currentLineMarkers.length > 0) {
          return
        }

        if (this.continueTimer)
          clearTimeout(this.continueTimer)
        this.continueTimer = setTimeout(async () => {
          const position = editorInstance.getPosition()
          if (position.lineNumber === 1 && position.column === 1) {
            return
          }
          const model = editorInstance.getModel()
          const lineContent = model.getLineContent(position.lineNumber)
          // const lineContent = getModelContentByLineNumber(this.emrInfo, lineNumber);

          // const tmpEmrData = {
          //     normal: this.emrInfo,
          //     readOnly: this.patientInfo
          // };

          // if (!needCallCreateEmr(tmpEmrData)) {
          this.$emit('continueLine', { position, lineContent }) // 单行续写
          // } else {
          //     this.$emit('createEmr'); // 生成病历
          // }
        }, 3000)
      })

      editorInstance.onDidBlurEditorWidget(() => {
        if (this.continueTimer) {
          clearTimeout(this.continueTimer)
          this.continueTimer = null
        }
      })

      // 编辑器选中内容变更
      editorInstance.onDidChangeCursorSelection((e) => {
        const selection = e.selection
        // 判断是否有选中内容
        if (
          selection.startLineNumber !== selection.endLineNumber
          || selection.startColumn !== selection.endColumn
        ) {
          this.selectedLineNum = []
          for (let i = selection.startLineNumber; i <= selection.endLineNumber; i++) {
            this.selectedLineNum.push(i)
          }
        }
        else {
          this.selectedLineNum = []
        }

        this.$emit('selectedEmr', this.selectedLineNum)
      })

      // 编辑器右键菜单
      editorInstance.onContextMenu((e) => {
        const position = editorInstance.getPosition()
        const currentLineNumber = [position.lineNumber]
        setTimeout(() => {
          contextMenuManager.showEditorContextMenu(e.event.posx, e.event.posy, [
            {
              text: this.selectedLineNum.length > 0 ? '同步选中行' : '同步当前行',
              handler: () => {
                this.$emit(
                  'syncSelectedEmr',
                  this.selectedLineNum.length > 0 ? this.selectedLineNum : currentLineNumber,
                )
              },
            },
            {
              text: '同步所有行',
              handler: () => {
                this.$emit('syncAllEmr')
              },
            },
          ])
        }, 10)

        e.event.preventDefault()
      })

      this.isInit = true
    },

    getLineNumberByFieldValue(value) {
      const model = editorInstance.getModel()
      const lines = model.getLinesContent()
      const lineNumber = lines.findIndex(line => line.startsWith(`${value}:`))
      return lineNumber + 1
    },

    handleQC() {
      this.$emit('checkEmr', editorInstance)
    },
    async handleCodeAction(accessor, ...args) {
      const marker = args[0]
      const model = editorInstance.getModel()
      const lineNumber = marker.startLineNumber
      const lineContent = model.getLineContent(lineNumber)

      let suggestion = ''
      if (marker && marker.message) {
        const match = marker.message.match(/建议：(.+)$/)
        if (match)
          suggestion = match[1]
      }

      this.$emit('fixEmr', { editorInstance, lineNumber, lineContent, suggestion })
    },

    clearGhostText() {
      MedicalLanguage.lastGhostObject = {
        lineNumber: 0,
        text: '',
        id: '',
        deCode: '',
        name: '',
        unit: '',
      }

      if (editorInstance) {
        try {
          // 尝试隐藏内联建议
          editorInstance.trigger('editor', 'editor.action.inlineSuggest.hide')
        }
        catch (error) {
          // 忽略可能的错误，避免影响正常功能
          console.warn('清除幽灵文本时出现警告（可忽略）:', error.message)
        }
      }
    },

    setGhostLineContent(lineNumber, ghostData) {
      this.clearGhostText()
      console.log('setGhostLineContent', lineNumber, ghostData)
      MedicalLanguage.lastGhostObject.lineNumber = lineNumber
      MedicalLanguage.lastGhostObject.text = `${ghostData.name}:${ghostData.newContent}`
      MedicalLanguage.lastGhostObject.id = ghostData.id
      MedicalLanguage.lastGhostObject.deCode = ghostData.deCode
      MedicalLanguage.lastGhostObject.name = ghostData.name
      MedicalLanguage.lastGhostObject.unit = ghostData.unit
      editorInstance.trigger('keyboard', 'editor.action.inlineSuggest.trigger')
    },

    updateEmrData(item, index) {
      if (!item) {
        return
      }

      // 使用索引+1作为行号，而不是依赖item.line
      const lineNumber = index + 1
      const content = item.content + (item.unit ? ` ${item.unit}` : '')
      this.setLineContent(lineNumber, content)
    },

    updateAllEmrData() {
      this.emrInfo.forEach((item, index) => {
        // 传递索引以确保行号正确
        this.updateEmrData(item, index)
      })
    },

    setLineContent(lineNumber, newContent, fieldValue = '') {
      if (!editorInstance) {
        console.warn('编辑器实例不存在')
        return
      }

      const model = editorInstance.getModel()
      if (!model) {
        console.warn('编辑器模型不存在')
        return
      }

      // 检查行号是否有效
      const totalLines = model.getLineCount()
      if (lineNumber < 1 || lineNumber > totalLines) {
        console.warn(`行号 ${lineNumber} 超出范围，总行数: ${totalLines}`)
        return
      }

      // 检查emrInfo数据是否存在
      const obj = this.emrInfo[lineNumber - 1]
      if (!obj || typeof obj !== 'object') {
        console.warn(`行 ${lineNumber} 对应的数据不存在或格式错误`)
        return
      }

      try {
        // 行首
        const startPosition = { lineNumber, column: 1 }
        // 行尾（注意：column 是"行内容长度+1"）
        const endPosition = {
          lineNumber,
          column: model.getLineMaxColumn(lineNumber),
        }
        const range = new monaco.Range(
          startPosition.lineNumber,
          startPosition.column,
          endPosition.lineNumber,
          endPosition.column,
        )

        const key = `${obj.name}:`

        if (!newContent.startsWith(key)) {
          newContent = key + newContent.trim()
        }
        model.applyEdits([{ range, text: newContent }])
      }
      catch (error) {
        console.error(`更新行 ${lineNumber} 时发生错误:`, error)
      }
    },

    clearData(emrNormalTemplate) {
      const model = getModelField(emrNormalTemplate)
      editorInstance.setValue(model)
    },
    showQCBtn() {
      const qcBtn = document.querySelector('.el-button.el-button--danger')
      if (!qcBtn)
        return

      for (let i = 0; i < this.emrInfo.length; i++) {
        if (!this.emrInfo[i].content || this.emrInfo[i].content.trim() === '') {
          qcBtn.style.opacity = '0'
          qcBtn.style.transition = 'opacity 0.5s ease-in-out'
          return
        }
      }

      qcBtn.style.opacity = '1'
      qcBtn.style.transition = 'opacity 0.5s ease-in-out'
    },
    handleRegenerate() {
      this.$emit('regenerate')
    },
  },
}
</script>

<style scoped lang="scss">
.editor-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  color: #333;
  position: relative;
  .monaco-editor-container {
    flex: 1;
    overflow: hidden;
    padding: 8px 8px 0 8px;
    background-color: #fafbfc;
    .monaco-editor {
      width: 100%;
      height: 100%;
      border-radius: 4px;
      background-color: #fff;
      overflow: hidden;
      text-align: left;
    }
  }

  .readonly-info-container {
    padding: 8px;
    white-space: pre-wrap;
    .readonly-info-item {
      display: inline-flex;
      margin-right: 24px;
      line-height: 32px;
      .readonly-info-item-title {
        margin-right: 8px;
        font-size: 16px;
        color: #a1a6b0;
      }
      .readonly-info-item-content {
        font-size: 16px;
        color: #333;
      }
      .important-content {
        font-weight: bold;
        color: #5086ff;
      }
    }
  }
  .regenerate-btn-container {
    padding: 4px 8px 0 0;
    background-color: #fafbfc;
    display: flex;
    justify-content: space-between;
    justify-content: flex-end;
    align-items: center;
    color: #e6a23c;

    .regenerate-btn-item {
      color: #5086ff;
      cursor: pointer;
      i {
        margin-right: 4px;
      }
    }
  }
  .bottom-tip {
    font-size: 12px;
    color: #999;
    text-align: center;
    padding: 4px 0;
  }
}
</style>

<style>
.monaco-editor,
.monaco-editor * {
  --vscode-focusBorder: #e0e0e0 !important;
}

.el-button:focus {
  outline: none !important;
  box-shadow: none !important;
}

.editableArea--single-line {
  background-color: #f5ffa050;
}

.editableArea--multi-line {
  text-decoration: underline;
}
</style>

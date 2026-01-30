<!-- _AllTestOrNoPublishComponents组件主文件 -->
<template>
  <div ref="editorEl" class="m-editor" style="width: 100%; height: 100%" />
  <!-- 容器高度由父元素控制，组件本身默认占满父容器 -->
</template>

<script setup lang="ts">
import type { languageType, themeType } from './types'
import type { CommonMonacoOptions } from './utils/editor/common'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { onBeforeUnmount, onMounted, useTemplateRef, watch } from 'vue'
import { createMonacoDiffEditor, createMonacoEditor } from './utils/editor'
import { formatWithPrettier } from './utils/format'
import { toMonacoLanguage } from './utils/language'
import './utils/workers'

defineOptions({
  name: 'Editor',
})

const props = withDefaults(defineProps<{
  language?:
  languageType
  originalValue?: string
  modifiedValue?: string
  autoFormat?: boolean
  modelValue?: string
  theme?: themeType
  /** 统一的 Monaco 配置（单/双栏通用），会被显式入参覆盖 */
  options?: CommonMonacoOptions
}>(), {
  language: 'js',
  autoFormat: true,
  theme: 'vs',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
}>()

const editorEl = useTemplateRef<HTMLElement | null>('editorEl')
let editor: monaco.editor.IStandaloneCodeEditor | null = null
let diffEditor: monaco.editor.IStandaloneDiffEditor | null = null

async function getValue(_value: string | undefined) {
  const value = _value ?? ''
  return !props.autoFormat
    ? value
    : await formatWithPrettier(value, props.language, {
        semi: false,
        singleQuote: true,
      })
}
onMounted(async () => {
  if (!editorEl.value)
    return

  const hasDiff = (props.originalValue ?? '') !== '' || (props.modifiedValue ?? '') !== ''

  if (hasDiff) {
    const original = await getValue(props.originalValue)
    const modified = await getValue(props.modifiedValue ?? props.modelValue)
    diffEditor = createMonacoDiffEditor(editorEl.value, monaco, {
      ...(props.options || {}),
      originalValue: original,
      modifiedValue: modified,
      language: toMonacoLanguage(props.language),
      theme: props.theme,
      renderSideBySide: true,
    })

    const modifiedEditor = diffEditor.getModifiedEditor()
    modifiedEditor.onDidChangeModelContent(() => {
      const newVal = modifiedEditor.getValue()
      if (newVal !== props.modelValue) {
        emit('update:modelValue', newVal)
        emit('change', newVal)
      }
    })
  }
  else {
    const value = await getValue(props.modelValue)
    editor = createMonacoEditor(editorEl.value, monaco, {
      ...(props.options || {}),
      value,
      language: toMonacoLanguage(props.language),
      theme: props.theme,
    })

    // 编辑器内容变化
    editor.onDidChangeModelContent(() => {
      if (!editor)
        return
      const newVal = editor.getValue()
      if (newVal !== props.modelValue) {
        // 同步触发两种更新事件，外部用哪种 v-model 就会响应哪种
        emit('update:modelValue', newVal)
        emit('change', newVal)
      }
    })
  }
})

watch(
  () => props.language,
  (lang: languageType) => {
    const langId = toMonacoLanguage(lang)
    if (editor) {
      const model = editor.getModel()
      if (model)
        monaco.editor.setModelLanguage(model, langId)
      return
    }
    if (diffEditor) {
      const model = diffEditor.getModel()
      if (model) {
        monaco.editor.setModelLanguage(model.original, langId)
        monaco.editor.setModelLanguage(model.modified, langId)
      }
    }
  },
)

watch(
  () => props.theme,
  (val: themeType | undefined) => {
    monaco.editor.setTheme(val || 'vs')
  },
)

//#region 值改变
watch(
  () => props.modelValue,
  async (val: string | undefined) => {
    const formatted = await getValue(val)
    if (editor) {
      if (editor.getValue() !== formatted)
        editor.setValue(formatted)
      return
    }
    if (diffEditor) {
      const modifiedEditor = diffEditor.getModifiedEditor()
      if (modifiedEditor.getValue() !== formatted)
        modifiedEditor.setValue(formatted)
    }
  },
)

watch(
  () => props.originalValue,
  async (val: string | undefined) => {
    if (!diffEditor)
      return
    const formatted = await getValue(val)
    const model = diffEditor.getModel()
    if (model && model.original.getValue() !== formatted)
      model.original.setValue(formatted)
  },
)

watch(
  () => props.modifiedValue,
  async (val: string | undefined) => {
    if (!diffEditor)
      return
    const formatted = await getValue(val)
    const model = diffEditor.getModel()
    if (model && model.modified.getValue() !== formatted)
      model.modified.setValue(formatted)
  },
)
//#endregion

//#region 配置改变
watch(
  () => props.options,
  (val: CommonMonacoOptions | undefined) => {
    if (!val)
      return
    // 过滤不应通过 updateOptions 更新的字段
    const {
      theme: _theme,
      language: _language,
      value: _value,
      originalValue: _originalValue,
      modifiedValue: _modifiedValue,
      ...rest
    } = val as Record<string, unknown>

    if (diffEditor) {
      // 先更新 Diff 专有/通用可识别的选项
      diffEditor.updateOptions(rest as monaco.editor.IDiffEditorOptions)
      // 再给左右两个子编辑器应用通用编辑器选项（如 wordWrap、minimap、fontSize 等）
      const original = diffEditor.getOriginalEditor()
      const modified = diffEditor.getModifiedEditor()
      original.updateOptions(rest as monaco.editor.IStandaloneEditorConstructionOptions)
      modified.updateOptions(rest as monaco.editor.IStandaloneEditorConstructionOptions)
      return
    }

    if (editor) {
      editor.updateOptions(rest as monaco.editor.IStandaloneEditorConstructionOptions)
    }
  },
  { deep: true },
)
//#endregion
onBeforeUnmount(() => {
  if (editor) {
    const model = editor.getModel()
    editor.dispose()
    if (model)
      model.dispose()
    editor = null
  }
  if (diffEditor) {
    const model = diffEditor.getModel()
    diffEditor.dispose()
    if (model) {
      model.original.dispose()
      model.modified.dispose()
    }
    diffEditor = null
  }
})
</script>

<style scoped>
.m-editor {
  box-sizing: border-box;
}
</style>

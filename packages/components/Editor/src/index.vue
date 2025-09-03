<template>
  <div ref="editorEl" class="m-editor" style="width: 100%; height: 100%" />
  <!-- 容器高度由父元素控制，组件本身默认占满父容器 -->
</template>

<script setup lang="ts">
import type { languageType, themeType } from './_types'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { createMonacoEditor } from './_utils/editor'
import { toMonacoLanguage } from './_utils/language'
import { formatWithPrettier } from './_utils/format'
import './_utils/workers'

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
}>(), {
  language: 'js',
  modelValue: '',
  originalValue: '',
  modifiedValue: '',
  autoFormat: true,
  theme: 'vs',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
}>()

const editorEl = useTemplateRef<HTMLElement | null>('editorEl')
let editor: monaco.editor.IStandaloneCodeEditor | null = null

async function getValue(value: string) {
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

  const value = await getValue(props.modelValue ?? '')
  editor = createMonacoEditor(editorEl.value, monaco, {
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
})

watch(
  () => props.language,
  (lang) => {
    if (!editor)
      return
    const model = editor.getModel()
    if (model)
      monaco.editor.setModelLanguage(model, toMonacoLanguage(lang))
  },
)

watch(
  () => props.theme,
  (val) => {
    if (!editor)
      return
    monaco.editor.setTheme(val || 'vs')
  },
)

watch(
  () => props.modelValue,
  async (val) => {
    if (!editor)
      return
    const formatted = await getValue(val)

    if (editor.getValue() !== formatted)
      editor.setValue(formatted)
  },
)

onBeforeUnmount(() => {
  if (editor) {
    const model = editor.getModel()
    editor.dispose()
    if (model)
      model.dispose()
    editor = null
  }
})
</script>

<style scoped>
.m-editor {
  box-sizing: border-box;
}
</style>

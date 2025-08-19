<template>
  <div ref="editorEl" class="m-editor" style="width: 100%; height: 100%" />
  <!-- 容器高度由父元素控制，组件本身默认占满父容器 -->
</template>

<script setup lang="ts">
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
// 确保需要的语言已注册
import 'monaco-editor/esm/vs/language/typescript/monaco.contribution'
import 'monaco-editor/esm/vs/basic-languages/sql/sql.contribution'

defineOptions({
  name: 'Editor',
})

// 同时支持默认 v-model（modelValue）与 v-model:code 两种用法
const props = withDefaults(defineProps<{
  language?:
    | 'js' | 'javascript' | 'jsx'
    | 'ts' | 'typescript' | 'tsx'
    | 'sql' | 'mysql' | 'postgres' | 'postgresql' | 'mssql' | 'plsql' | 'oracle' | 'sqlite' | 'mariadb'
  modelValue?: string
}>(), {
  language: 'js',
  modelValue: undefined,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
}>()

const editorEl = ref<HTMLElement | null>(null)
let editor: monaco.editor.IStandaloneCodeEditor | null = null
let isProgrammaticChange = false

function toMonacoLanguage(
  lang:
    | 'js' | 'javascript' | 'jsx'
    | 'ts' | 'typescript' | 'tsx'
    | 'sql' | 'mysql' | 'postgres' | 'postgresql' | 'mssql' | 'plsql' | 'oracle' | 'sqlite' | 'mariadb',
): string {
  switch (lang) {
    // JavaScript 家族
    case 'js':
    case 'javascript':
    case 'jsx':
      return 'javascript'
    // TypeScript 家族
    case 'ts':
    case 'typescript':
    case 'tsx':
      return 'typescript'
    // SQL 及各方言（Monaco 使用统一的 `sql`）
    case 'sql':
    case 'mysql':
    case 'postgres':
    case 'postgresql':
    case 'mssql':
    case 'plsql':
    case 'oracle':
    case 'sqlite':
    case 'mariadb':
      return 'sql'
    default:
      return 'javascript'
  }
}

onMounted(() => {
  if (!editorEl.value)
    return

  editor = monaco.editor.create(editorEl.value, {
    value: props.modelValue ?? '',
    language: toMonacoLanguage(props.language),
    automaticLayout: true,
    theme: 'vs',
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
  })

  editor.onDidChangeModelContent(() => {
    if (!editor)
      return
    const newVal = editor.getValue()
    if (newVal !== props.modelValue) {
      isProgrammaticChange = true
      // 同步触发两种更新事件，外部用哪种 v-model 就会响应哪种
      emit('update:modelValue', newVal)
      emit('change', newVal)
      // 稍后清除标记，避免外部 watch 回写再次触发
      queueMicrotask(() => {
        isProgrammaticChange = false
      })
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
  () => props.modelValue,
  (val) => {
    if (!editor || isProgrammaticChange)
      return
    const safeVal = val ?? ''
    if (editor.getValue() !== safeVal)
      editor.setValue(safeVal)
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

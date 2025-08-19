<template>
  <div ref="editorEl" class="m-editor" style="width: 100%; height: 100%" />
  <!-- 容器高度由父元素控制，组件本身默认占满父容器 -->
</template>

<script setup lang="ts">
import { editor as monacoEditor } from 'monaco-editor/esm/vs/editor/editor.api'
// 各语言 的 basic 贡献
//#region 全量引入
// import 'monaco-editor/esm/vs/basic-languages/monaco.contribution'
//#endregion
//#region 分开引入
import 'monaco-editor/esm/vs/basic-languages/sql/sql.contribution'
import 'monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution'
import 'monaco-editor/esm/vs/basic-languages/typescript/typescript.contribution'
//#endregion

defineOptions({
  name: 'Editor',
})

// Worker 由 onMounted 中按需动态导入配置，避免打包器不支持导致语法错误

// 同时支持默认 v-model（modelValue）与 v-model:code 两种用法
const props = withDefaults(defineProps<{
  language?:
    | 'js' | 'javascript' | 'jsx'
    | 'ts' | 'typescript' | 'tsx'
    | 'sql' | 'mysql' | 'postgres' | 'postgresql' | 'mssql' | 'plsql' | 'oracle' | 'sqlite' | 'mariadb'
  modelValue?: string
}>(), {
  language: 'js',
  modelValue: '',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
}>()

const editorEl = ref<HTMLElement | null>(null)
let editor: monacoEditor.IStandaloneCodeEditor | null = null
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

onMounted(async () => {
  if (!editorEl.value)
    return

  // 动态导入并配置 Monaco 的 worker（若打包器支持 ?worker 则启用）
  let EditorWorkerCtor: any
  let TsWorkerCtor: any
  try {
    const mod = await import('monaco-editor/esm/vs/editor/editor.worker?worker')
    EditorWorkerCtor = mod?.default
  }
  catch {
    // ignore
  }
  try {
    const mod = await import('monaco-editor/esm/vs/language/typescript/ts.worker?worker')
    TsWorkerCtor = mod?.default
  }
  catch {
    // ignore
  }
  if (EditorWorkerCtor || TsWorkerCtor) {
    ;(globalThis as any).MonacoEnvironment = {
      getWorker(_moduleId: string, label: string) {
        if (label === 'typescript' || label === 'javascript')
          return TsWorkerCtor ? new TsWorkerCtor() : undefined
        return EditorWorkerCtor ? new EditorWorkerCtor() : undefined
      },
    }
  }

  editor = monacoEditor.create(editorEl.value, {
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
      monacoEditor.setModelLanguage(model, toMonacoLanguage(lang))
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

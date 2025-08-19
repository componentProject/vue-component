<template>
  <div ref="editorEl" class="m-editor" style="width: 100%; height: 100%" />
  <!-- 容器高度由父元素控制，组件本身默认占满父容器 -->
</template>

<script setup lang="ts">
import type { langType } from './_types'
import * as monaco from 'monaco-editor'

defineOptions({
  name: 'Editor',
})

// Worker 由 onMounted 中按需动态导入配置，避免打包器不支持导致语法错误

// 同时支持默认 v-model（modelValue）与 v-model:code 两种用法
const props = withDefaults(defineProps<{
  language?:
  langType
  modelValue?: string
  theme?: 'vs' | 'hc-black' | 'vs-dark'
}>(), {
  language: 'js',
  modelValue: '',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
}>()

const editorEl = useTemplateRef<HTMLElement | null>('editorEl')
let editor: monaco.editor.IStandaloneCodeEditor | null = null

function toMonacoLanguage(
  lang:
  langType,
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

  editor = monaco.editor.create(editorEl.value, {
    value: props.modelValue ?? '',
    language: toMonacoLanguage(props.language),
    // 官方白带三种主题vS, hc-btack, or vs-dark
    theme: props.theme,
    // 字体大小
    fontSize: 14,
    // 是否只读
    readOnly: false,
    // 滚动是否有边框
    overviewRulerBorder: false,
    // 控制光标平滑动画的开启与关闭。当开启时，光标移动会有平滑的动画效果。
    cursorSmoothCaretAnimation: 'on',
    //设置是否在粘贴文本时自动格式化代码
    formatOnPaste: true,
    //设置是否开启鼠标滚轮缩放功能
    mouseWheelZoom: true,
    //控制是否开启代码折叠功能
    folding: true,
    // 控制编辑器是否自动调整布局以适应容器大小的变化
    automaticLayout: true,
    minimap: {
      // 是否启用预览图
      enabled: true,
    },
    // 禁用额外滚动区
    scrollBeyondLastLine: false,
    scrollbar: {
      // 垂直滚动条宽度，默认px
      verticalScrollbarSize: 2,
      // 水平滚动条高度
      horizontalScrollbarSize: 2,
    },
    //字形边缘
    glyphMargin: true,
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
  (val) => {
    if (!editor)
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

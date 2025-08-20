import type * as monaco from 'monaco-editor/esm/vs/editor/editor.api'

export interface CreateMonacoEditorOptions {
  value: string
  language: string
  theme?: string
}

export function createMonacoEditor(
  container: HTMLElement,
  monacoInstance: typeof monaco,
  options: CreateMonacoEditorOptions,
): monaco.editor.IStandaloneCodeEditor {
  return monacoInstance.editor.create(container, {
    value: options.value ?? '',
    language: options.language,
    // 官方白带三种主题vS, hc-btack, or vs-dark
    theme: options.theme,
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
}

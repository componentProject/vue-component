// _AllTestOrNoPublishComponents的common组件
import type * as monaco from 'monaco-editor/esm/vs/editor/editor.api'

/**
 * 公共的 Monaco 编辑器配置类型
 * 说明：
 * - 这里采用对单文件编辑器与 Diff 编辑器配置的交集（均为 Partial），
 *   以便在一个默认对象内集中声明常用项，按需覆盖即可。
 */
export type CommonMonacoOptions
  = Partial<monaco.editor.IStandaloneEditorConstructionOptions>
    & Partial<monaco.editor.IDiffEditorConstructionOptions>

export const defaultCommonMonacoOptions: CommonMonacoOptions = {
  //#region 核心
  /** 主题（vs | vs-dark | hc-black） */
  theme: 'vs',
  /** 字体大小 */
  fontSize: 14,
  /** 只读模式 */
  readOnly: false,
  /** 容器尺寸变化时自动布局 */
  automaticLayout: true,
  //#endregion

  //#region 布局与展示
  /** 自动换行（off | on | bounded | wordWrapColumn） */
  wordWrap: 'on',
  /** 行号显示（on | off | relative | interval | 函数） */
  lineNumbers: 'on',
  /** 右侧预览图（小地图） */
  minimap: { enabled: true },
  /** 末行额外滚动 */
  scrollBeyondLastLine: false,
  /** 平滑滚动 */
  smoothScrolling: true,
  /** 鼠标滚轮缩放字体 */
  mouseWheelZoom: true,
  /** 字形边距（断点/装饰标记栏） */
  glyphMargin: true,
  /** 滚动条尺寸 */
  scrollbar: { verticalScrollbarSize: 2, horizontalScrollbarSize: 2 },
  /** 概览标尺边框 */
  overviewRulerBorder: false,
  //#endregion

  //#region 文本与缩进
  /** Tab 对应空格数 */
  tabSize: 2,
  /** 使用空格替代 Tab */
  insertSpaces: true,
  /** 自动探测缩进 */
  detectIndentation: true,
  /** 展示空白字符（none | boundary | selection | trailing | all） */
  renderWhitespace: 'boundary',
  /** 展示控制字符 */
  renderControlCharacters: false,
  //#endregion

  //#region 交互与光标
  /** 光标样式（line | block | underline） */
  cursorStyle: 'line',
  /** 光标闪烁（blink | smooth | phase | expand | solid） */
  cursorBlinking: 'blink',
  /** 行高亮（none | gutter | line | all） */
  renderLineHighlight: 'line',
  /** 右键菜单 */
  contextmenu: true,
  /** 光标平滑动画 */
  cursorSmoothCaretAnimation: 'on',
  //#endregion

  //#region 结构与可读性
  /** 启用代码折叠 */
  folding: true,
  /** 折叠策略（auto | indentation） */
  foldingStrategy: 'auto',
  /** 相同符号高亮 */
  occurrencesHighlight: true,
  /** 选中高亮 */
  selectionHighlight: true,
  /** 括号匹配（always | near | never） */
  matchBrackets: 'always',
  /** 缩进参考线（旧版选项，兼容性更好） */
  renderIndentGuides: true,
  //#endregion

  //#region 智能提示与格式化
  /** 快速建议（在注释/字符串等位置是否弹出） */
  quickSuggestions: { other: true, comments: false, strings: false },
  /** 触发字符即弹出建议 */
  suggestOnTriggerCharacters: true,
  /** 参数提示 */
  parameterHints: { enabled: true },
  /** 悬停提示 */
  hover: { enabled: true },
  /** 输入时格式化 */
  formatOnType: true,
  /** 粘贴时格式化 */
  formatOnPaste: true,
  /** Tab 完成（on | off | onlySnippets） */
  tabCompletion: 'on',
  //#endregion

  //#region 链接与安全
  /** 识别文中链接并可点击 */
  links: true,
  //#endregion

  //#region Diff 编辑器
  /** 侧边对比（true：左右对比；false：内联） */
  renderSideBySide: true,
  /** 忽略行尾空白差异 */
  ignoreTrimWhitespace: true,
  /** 原文是否可编辑 */
  originalEditable: false,
  /** 变更指示器（加减号） */
  renderIndicators: true,
  /** 分割视图可拖动调整 */
  enableSplitViewResizing: true,
  //#endregion
}

export function buildMonacoOptions<
  T extends
  | monaco.editor.IStandaloneEditorConstructionOptions
  | monaco.editor.IDiffEditorConstructionOptions,
>(overrides: Partial<T> = {} as Partial<T>): T {
  const base = { ...defaultCommonMonacoOptions } as unknown as T
  return { ...(base as object), ...overrides } as T
}

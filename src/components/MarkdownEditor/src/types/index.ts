import type { ConfigOption, EditorProps } from 'md-editor-v3'

export interface propsType {
  //#region 扩展props
  config?: ConfigOption
  /**
   * 是否显示行号
   */
  showNum?: boolean
  //#endregion
  /**
   * 编辑器的唯一标识，使用默认前缀和useId拼接
   */
  id?: EditorProps['id']
  // /**
  //  * 编辑的内容
  //  */
  // modelValue?: EditorProps['modelValue']
  /**
   * 编辑器主题，支持 light 和 dark 两种
   */
  theme?: EditorProps['theme']
  /**
   * 编辑器的类名
   */
  class?: EditorProps['class']
  /**
   * 编辑器内联样式
   */
  style?: EditorProps['style']
  /**
   * 内置中英文,可自行扩展其他语言
   */
  language?: EditorProps['language']
  /**
   * 代码块是否显示行号
   */
  showCodeRowNumber?: EditorProps['showCodeRowNumber']
  /**
   * 预览内容主题，支持自定义。内置主题: default、github、vuepress、mk-cute、smart-blue、cyanosis
   */
  previewTheme?: EditorProps['previewTheme']
  /**
   * 代码块高亮样式名称。内置主题: atom、a11y、github、gradient、kimbie、paraiso、qtcreator、stackoverflow
   */
  codeTheme?: EditorProps['codeTheme']
  /**
   * 构造标题ID的生成方式。默认使用 github 的方式处理
   */
  mdHeadingId?: EditorProps['mdHeadingId']
  /**
   * 通过该属性修改编译后的html内容。默认不处理
   */
  sanitize?: EditorProps['sanitize']
  /**
   * 格式化复制代码。默认移除每行最前面的空格
   */
  formatCopiedText?: EditorProps['formatCopiedText']
  /**
   * 代码风格自动反转。当编辑器主题变化时，是否自动切换代码块的风格
   */
  codeStyleReverse?: EditorProps['codeStyleReverse']
  /**
   * 需要自动调整的预览主题。配置后，仅当预览主题为下列值时，切换编辑器主题才会自动切换代码块样式
   */
  codeStyleReverseList?: EditorProps['codeStyleReverseList']
  /**
   * 不高亮代码。设置为 true 后，所有代码块将不会被高亮处理
   */
  noHighlight?: EditorProps['noHighlight']
  /**
   * 禁用图片放大功能。设置为 true 后，点击预览区域的图片不会有任何反应
   */
  noImgZoomIn?: EditorProps['noImgZoomIn']
  /**
   * 自定义图标。可以传入一个对象，key 为图标名称，value 为图标组件
   */
  customIcon?: EditorProps['customIcon']
  /**
   * 转换生成的mermaid代码。可以通过该方法来修改mermaid的内容
   */
  sanitizeMermaid?: EditorProps['sanitizeMermaid']
  /**
   * 是否开启折叠代码功能。设置为 true 后，超过设定行数的代码块将被折叠
   */
  codeFoldable?: EditorProps['codeFoldable']
  /**
   * 触发自动折叠代码的行数阈值。当代码块的行数超过该值时，将自动折叠
   */
  autoFoldThreshold?: EditorProps['autoFoldThreshold']
  /**
   * 页面内全屏。设置为 true 后，编辑器将撑满父级元素
   */
  pageFullscreen?: EditorProps['pageFullscreen']
  /**
   * 是否显示预览。设置为 false 时，预览区域将被隐藏
   */
  preview?: EditorProps['preview']
  /**
   * 是否显示 html 预览。当设置为true时，需要将preview设置为false
   */
  htmlPreview?: EditorProps['htmlPreview']
  /**
   * 工具栏配置。可以配置显示哪些工具栏按钮
   */
  toolbars?: EditorProps['toolbars']
  /**
   * 不显示的工具栏。可以配置不显示哪些工具栏按钮
   */
  toolbarsExclude?: EditorProps['toolbarsExclude']
  /**
   * 是否禁用prettier格式化。设置为 true 后，格式化按钮将被禁用
   */
  noPrettier?: EditorProps['noPrettier']
  /**
   * 编辑器tab键空格数。默认为2个空格
   */
  tabWidth?: EditorProps['tabWidth']
  /**
   * 表格行列配置。[最大行数, 最大列数] 或 [最大行数, 最大列数, 扩展最大行数, 扩展最大列数]
   */
  tableShape?: EditorProps['tableShape']
  /**
   * 占位提示文字。编辑器为空时显示的文字
   */
  placeholder?: EditorProps['placeholder']
  /**
   * 页脚显示配置。可以配置显示字数统计、滚动同步开关等
   */
  footers?: EditorProps['footers']
  /**
   * 是否开启左右同步滚动。设置为 false 后，预览区域将不会跟随编辑区域滚动
   */
  scrollAuto?: EditorProps['scrollAuto']
  /**
   * 是否禁用上传图片。设置为 true 后，上传图片按钮将被禁用
   */
  noUploadImg?: EditorProps['noUploadImg']
  /**
   * 是否自动获得焦点。设置为 true 后，编辑器将在挂载后自动获得焦点
   */
  autoFocus?: EditorProps['autoFocus']
  /**
   * 是否禁用编辑器。设置为 true 后，编辑器将变为只读模式
   */
  disabled?: EditorProps['disabled']
  /**
   * 是否只读模式。设置为 true 后，编辑器内容将不能被修改
   */
  readOnly?: EditorProps['readOnly']
  /**
   * 最大字符数。超过该值后，将不能继续输入
   */
  maxLength?: EditorProps['maxLength']
  /**
   * 是否自动检测代码语言。设置为 true 后，将自动检测代码块的语言
   */
  autoDetectCode?: EditorProps['autoDetectCode']
  /**
   * 输入自动完成来源。可以配置自动完成的内容
   */
  completions?: EditorProps['completions']
  /**
   * 是否显示工具栏名称。设置为 true 后，鼠标悬浮在工具栏按钮上时将显示按钮名称
   */
  showToolbarName?: EditorProps['showToolbarName']
  /**
   * 输入框默认宽度。可以设置编辑区域的默认宽度
   */
  inputBoxWidth?: EditorProps['inputBoxWidth']
  /**
   * 转换图片链接。可以通过该方法来修改图片的链接
   */
  transformImgUrl?: EditorProps['transformImgUrl']
  /**
   * 目录布局方式。支持 fixed 和 flat 两种方式
   */
  catalogLayout?: EditorProps['catalogLayout']
  /**
   * 是否禁用mermaid。设置为 true 后，将不会渲染mermaid图表
   */
  noMermaid?: EditorProps['noMermaid']
  /**
   * 是否禁用katex。设置为 true 后，将不会渲染数学公式
   */
  noKatex?: EditorProps['noKatex']
  /**
   * 默认工具栏。可以通过该属性来配置默认显示的工具栏按钮
   */
  defToolbars?: EditorProps['defToolbars']
}

export interface mdPreviewEventsType {
  /**
   * 内容变化事件。回调参数：(value: string) => void
   */
  onChange?: EditorProps['onChange']
  /**
   * html变化回调事件。回调参数：(html: string) => void
   */
  onHtmlChanged?: EditorProps['onHtmlChanged']

  /**
   * >=5.3.0 内容重新挂载事件，在这个事件中能够正确获取到内容中的节点。
   */
  onRemount?: EditorProps['onRemount']
  /**
   * 动态获取markdown目录。回调参数：(catalogList: Array<HeadList>) => void
   */
  onGetCatalog?: EditorProps['onGetCatalog']
}
export interface eventsType extends mdPreviewEventsType {
  /**
   * 保存事件，快捷键与保存按钮均会触发。回调参数：(value: string, html: string) => void
   */
  onSave?: EditorProps['onSave']
  /**
   * 上传图片事件。回调参数：(files: Array<File>, callback: (urls: Array<string>) => void) => void
   */
  onUploadImg?: EditorProps['onUploadImg']
  /**
   * 捕获执行错误事件。回调参数：(err: Error) => void
   */
  onError?: EditorProps['onError']

  /**
   * 输入框失去焦点时触发事件。回调参数：(event: FocusEvent) => void
   */
  onBlur?: EditorProps['onBlur']
  /**
   * 输入框获得焦点时触发事件。回调参数：(event: FocusEvent) => void
   */
  onFocus?: EditorProps['onFocus']
  /**
   * 输入框键入内容事件。回调参数：(value: string) => void
   */
  onInput?: EditorProps['onInput']
  /**
   * 拖放内容事件。回调参数：(event: DragEvent) => void
   */
  onDrop?: EditorProps['onDrop']
  /**
   * 调整输入框宽度事件
   */
  onInputBoxWidthChange?: (width: string) => void
}

export interface slotsType {
  /**
   * 自定义扩展页脚。可以通过该插槽来自定义页脚的内容
   */
  defFooters?: EditorProps['defFooters']
  /**
   * 自定义工具栏插槽，通过使用内置的NormalToolbar普通点击触发事件组件，DropdownToolbar下拉点击触发事件组件和ModalToolbar弹窗触发事件组件进行扩展。将defToolbars插槽中的组件下标穿插在toolbars实现展示（这并不规范）。
   */
  defToolbars?: EditorProps['defToolbars']
}

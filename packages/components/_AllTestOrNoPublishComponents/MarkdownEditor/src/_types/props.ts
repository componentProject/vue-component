import type { EditorProps } from 'md-editor-v3'
import type { DocumentListItem, ImageData, SavedDocumentData } from './api'

/**
 * MarkdownEditor 组件的 Props 类型定义
 */
export interface propsType {
  //#region 扩展props
  /**
   * 自定义配置对象
   */
  config?: any
  /**
   * 是否显示行号
   */
  showNum?: boolean
  //#endregion

  /**
   * 编辑器的唯一标识，使用默认前缀和useId拼接
   */
  id?: EditorProps['id']
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

  //#region 自定义方法
  /**
   * 自定义保存方法
   */
  saveMethod?: EditorProps['onSave']
  /**
   * 自定义加载方法
   */
  loadMethod?: () => Promise<SavedDocumentData | null>
  /**
   * 自定义获取文档列表方法
   */
  getDocumentsMethod?: () => Promise<DocumentListItem[]>
  /**
   * 自定义删除文档方法
   */
  deleteDocumentMethod?: (key: string) => Promise<boolean>
  /**
   * 自定义图片上传方法
   */
  uploadImageMethod?: (files: File[]) => Promise<string[]>
  /**
   * 自定义获取图片列表方法
   */
  getImagesMethod?: () => Promise<ImageData[]>
  /**
   * 自定义删除图片方法
   */
  deleteImageMethod?: (imageId: string) => Promise<boolean>
  //#endregion

  //#region 事件回调
  /**
   * 保存成功事件，当内容成功保存到 IndexedDB 时触发
   * @param data - 保存的数据，包含value和html
   */
  saveSuccess?: (data: { value: string, html: string }) => void
  /**
   * 保存失败事件，当保存到 IndexedDB 失败时触发
   * @param error - 错误信息
   */
  saveError?: (error: Error) => void
  /**
   * 上传图片事件
   * @param files - 上传的文件列表
   * @param callback - 回调函数，用于返回图片URL
   */
  onUploadImg?: EditorProps['onUploadImg']
  /**
   * 捕获执行错误事件
   * @param err - 错误对象
   */
  onError?: EditorProps['onError']
  /**
   * 输入框失去焦点时触发事件
   * @param event - 焦点事件
   */
  onBlur?: EditorProps['onBlur']
  /**
   * 输入框获得焦点时触发事件
   * @param event - 焦点事件
   */
  onFocus?: EditorProps['onFocus']
  /**
   * 输入框键入内容事件
   * @param value - 输入的内容
   */
  onInput?: EditorProps['onInput']
  /**
   * 拖放内容事件
   * @param event - 拖放事件
   */
  onDrop?: EditorProps['onDrop']
  /**
   * 调整输入框宽度事件
   * @param width - 新的宽度值
   */
  onInputBoxWidthChange?: (width: string) => void
  /**
   * 内容变化事件
   * @param value - 变化后的内容
   */
  onChange?: EditorProps['onChange']
  /**
   * HTML变化回调事件
   * @param html - 变化后的HTML内容
   */
  onHtmlChanged?: EditorProps['onHtmlChanged']
  /**
   * 内容重新挂载事件，在这个事件中能够正确获取到内容中的节点
   * @param value - 重新挂载的内容
   */
  onRemount?: EditorProps['onRemount']
  /**
   * 动态获取markdown目录
   * @param catalogList - 目录列表
   */
  onGetCatalog?: EditorProps['onGetCatalog']
  /**
   * 图片上传成功事件
   * @param data - 上传成功的图片信息
   */
  uploadImageSuccess?: (data: { files: File[], urls: string[] }) => void
  /**
   * 图片上传失败事件
   * @param error - 错误信息
   */
  uploadImageError?: (error: Error) => void
  //#endregion
}

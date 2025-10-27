import type { EditorProps } from 'md-editor-v3'

/**
 * Markdown 预览相关事件类型
 */
export interface mdPreviewEventsType {
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
}

/**
 * MarkdownEditor 组件的事件类型定义
 */
export interface emitsType extends mdPreviewEventsType {
  /**
   * 保存事件，快捷键与保存按钮均会触发
   * @param value - Markdown内容
   * @param html - HTML内容
   */
  onSave?: EditorProps['onSave']
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
}

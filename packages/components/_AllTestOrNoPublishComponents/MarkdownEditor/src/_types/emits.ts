/**
 * MarkdownEditor 组件的 emit 事件类型定义
 */
export interface emitEventsType {
  /**
   * 保存成功事件
   * @param data - 保存的数据，包含value和html
   */
  saveSuccess: [data: { value: string, html: string }]
  /**
   * 保存失败事件
   * @param error - 错误信息
   */
  saveError: [error: Error]
  /**
   * 内容变化事件
   * @param value - 变化后的内容
   */
  change: [value: string]
  /**
   * HTML变化事件
   * @param html - 变化后的HTML内容
   */
  htmlChanged: [html: string]
  /**
   * 内容重新挂载事件
   * @param value - 重新挂载的内容
   */
  remount: [value: string]
  /**
   * 动态获取markdown目录
   * @param catalogList - 目录列表
   */
  getCatalog: [catalogList: any[]]
  /**
   * 上传图片事件
   * @param files - 上传的文件列表
   * @param callback - 回调函数，用于返回图片URL
   */
  uploadImg: [files: File[], callback: (urls: string[]) => void]
  /**
   * 捕获执行错误事件
   * @param err - 错误对象
   */
  error: [err: Error]
  /**
   * 输入框失去焦点时触发事件
   * @param event - 焦点事件
   */
  blur: [event: FocusEvent]
  /**
   * 输入框获得焦点时触发事件
   * @param event - 焦点事件
   */
  focus: [event: FocusEvent]
  /**
   * 输入框键入内容事件
   * @param value - 输入的内容
   */
  input: [value: string]
  /**
   * 拖放内容事件
   * @param event - 拖放事件
   */
  drop: [event: DragEvent]
  /**
   * 调整输入框宽度事件
   * @param width - 新的宽度值
   */
  inputBoxWidthChange: [width: string]
}

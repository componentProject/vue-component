/**
 * SystemErrorDialog 组件的 Emits 类型定义
 */
export interface SystemErrorDialogEmitsType {
  /** v-model 更新事件 */
  'update:modelValue': [val: boolean]
  /** 关闭事件 */
  close: []
  /** 确认事件 */
  confirm: [data: any]
  /** 上报事件 */
  report: []
}


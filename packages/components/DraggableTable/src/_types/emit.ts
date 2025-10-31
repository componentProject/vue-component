import type { VxeTableDefines } from 'vxe-table'

/**
 * DraggableTable 组件的 Emits 类型定义
 */
export interface emitsType {
  (e: 'headerContextMenu', params: HTMLElement): void
  (e: 'checkboxAll', params: VxeTableDefines.CheckboxAllParams): void
  (e: 'checkboxChange', params: VxeTableDefines.CheckboxAllParams): void
  (e: 'resizableChange', params: VxeTableDefines.ResizableChangeParams): void
  (e: 'rowDragend', params: any): void
  (e: 'columnDragend', params: any): void
  (e: 'update:tableData', params: any[]): void
  // 当在表格中最后一个输入元素按下Enter键时触发
  (e: 'noNextInput', params: NoNextInputParams): void
  // 当在表格中select下拉为空时触发
  (e: 'noSelectValue', params: NoSelectValueParams): void
  (e: 'toggleTreeExpand', params: VxeTableDefines.ToggleRowExpandEventParams): void
}
// Emits for CustomConfigDialog component
export interface CustomConfigDialogConfirmPayload {
  customColumns: any[]
  isCommon: boolean
}
export interface CustomConfigDialogEmitsType {
  (e: 'confirm', payload: CustomConfigDialogConfirmPayload): void
}
/** 当没有下一个输入元素时触发的事件参数 */
export interface NoNextInputParams {
  /** 当前行数据 */
  row: any
  /** 行索引 */
  rowIndex: number
  /** 列索引 */
  colIndex: number
}

/** 当select下拉为空时触发的事件参数 */
export interface NoSelectValueParams {
  /** 当前行数据 */
  row: any
  /** 行索引 */
  rowIndex: number
  /** 列索引 */
  colIndex: number
}

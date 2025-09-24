import type { VxeTableDefines } from 'vxe-table'
import type { NoNextInputParams, NoSelectValueParams } from './index'

/**
 * DraggableTable 组件的 Emits 类型定义
 */
export interface DraggableTableEmits {
  (e: 'currentChange', params: number): void
  (e: 'update:pagination', params: number): void
  (e: 'sizeChange', params: number): void
  (e: 'pageChange', params: number): void
  (e: 'headerContextMenu', params: HTMLElement): void
  (e: 'headerCellMenu', params: VxeTableDefines.HeaderCellMenuParams & { cell?: HTMLElement }): void
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

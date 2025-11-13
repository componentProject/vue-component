// PopoverTableSelect的emits组件
import type { VxeTableDefines } from 'vxe-table'

/**
 * PopoverTableSelect 组件的 Emits 类型定义
 */
export interface emitsType {
  /** 输入框获得焦点时触发 */
  (e: 'focus'): void
  /** 输入框失去焦点时触发 */
  (e: 'blur'): void
  /** 按下回车键时触发 */
  (e: 'enter', val: any): void
  /** 清空输入框时触发 */
  (e: 'clear'): void
  /** 加载更多数据时触发 */
  (e: 'loadMore'): void
  /** 选择行时触发 */
  (e: 'select', row: any): void
  /** 输入时触发 */
  (e: 'input', val: any): void
}

/**
 * PopoverTableSelectBase 组件的 Emits 类型定义
 */
export interface baseEmitsType {
  /** 选择行时触发 */
  (e: 'select', row: any): void
  /** 单元格点击时触发 */
  (e: 'cellClick', params: VxeTableDefines.CellClickParams): void
  /** 单元格双击时触发 */
  (e: 'cellDblClick', params: VxeTableDefines.CellDblclickParams): void
  /** 列宽变化时触发 */
  (e: 'resizableChange', params: VxeTableDefines.ResizableChangeParams): void
  /** 表头右键菜单时触发 */
  (e: 'headerContextMenu', params: HTMLElement): void
  /** 按下回车键时触发 */
  (e: 'enter', row: any): void
}

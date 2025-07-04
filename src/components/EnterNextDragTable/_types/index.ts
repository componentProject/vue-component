/**
 * EnterNextDragTable组件的属性接口
 */
export interface EnterNextDragTableProps {
  /**
   * 是否允许在select没有选中值时跳转
   * @default false
   */
  allowSelectNextInEmpty?: boolean
}

/**
 * 当没有下一个输入元素时触发的事件参数
 */
export interface NoNextInputParams {
  /**
   * 当前行数据
   */
  row: any
  /**
   * 行索引
   */
  rowIndex: number
}

/**
 * 当select下拉为空时触发的事件参数
 */
export interface NoSelectValueParams {
  /**
   * 当前行数据
   */
  row: any
  /**
   * 行索引
   */
  rowIndex: number
  /**
   * 列索引
   */
  colIndex: number
}

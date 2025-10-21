/**
 * ImportExcel 组件的 Props 类型定义
 */
export interface propsType {
  /** 列配置（数组）：例如 [{ label/title, prop/field, ... }] */
  columns: Array<Record<string, any>>
  /** 从 columns 中匹配列头名称时用到的字段名优先级 */
  titles?: string[]
  /** 从 columns/tableData 中匹配字段 key 时用到的字段名优先级 */
  fields?: string[]
}

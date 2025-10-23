/**
 * ExportExcel 组件的 Props 类型定义
 */
export interface propsType {
  /** 表格数据 */
  tableData: any[]
  /** 表格列配置 */
  columns: any[]
  /** 从 columns 中匹配列头名称的字段优先级 */
  titles?: string[]
  /** 从 tableData 中匹配值的字段优先级 */
  fields?: string[]
  /** 导出文件名 */
  fileName?: string
  /** 按钮文本 (当没有默认插槽时使用) */
  buttonText?: string
  /** 导出类型 xlsx/csv */
  exportType?: 'xlsx' | 'csv'
  /** 是否自动宽度 */
  autoWidth?: boolean
  /** 是否允许空数据导出 */
  allowEmptyExport?: boolean
  /** 空数据导出提示信息 */
  emptyMessage?: string
}

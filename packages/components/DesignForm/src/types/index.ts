// 表单配置接口
export interface FormConfig {
  size: 'default' | 'large' | 'small'
  labelPosition: 'top' | 'left' | 'right'
  hideBtns?: boolean
  labelWidth?: number | string
  colGap?: string
  submitBtnText?: string
  cancelBtnText?: string
  items: FormItem[]
  [key: string]: any
}

// 表单项接口
export interface FormItem {
  label: string
  field: string
  component: any
  props?: Record<string, any>
  defaultValue?: any
  rules?: Array<{
    required?: boolean
    message?: string
    trigger?: string | string[]
    [key: string]: any
  }>
  visible?: {
    conditions: Array<{
      field: string
      value: any
      type: '=' | '!=' | '<' | '>' | '<=' | '>='
    }>
  }
  [key: string]: any
}

// 组件类型配置接口
export interface ComponentTypeConfig {
  label: string
  field: string
  component: any
  props?: Record<string, any>
  childComp?: any
  [key: string]: any
}

// 表单组件类型映射
export interface FormItemObjMap {
  [key: string]: ComponentTypeConfig
}

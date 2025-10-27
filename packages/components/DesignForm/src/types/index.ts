// 表单配置接口
export interface FormConfig {
  size: 'default' | 'large' | 'small'
  labelPosition?: 'top' | 'left' | 'right'
  hideBtns?: boolean
  labelWidth?: number | string
  colGap?: string
  submitBtnText?: string
  cancelBtnText?: string
  items?: FormItem[]
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
}

// 通用表单配置对象类型（用于表单规则配置）
export interface FormConfigData {
  [key: string]: any
}

// 组件实例类型
export interface ComponentInstance {
  name: string
}

// 表单项属性类型
export interface ItemProps {
  [key: string]: any
  options?: any[]
  requestParams?: any
}

// 表单规则类型
export interface FormRule {
  validator?: ((rule: any, value: any, callback: (error?: string | Error) => void) => void) | string
}

// 选中项类型
export interface SelectedItem {
  component: ComponentInstance
  props?: ItemProps
  rules?: FormRule[]
  [key: string]: any
}

// ReForm组件ref类型
export interface ReFormInstance {
  formData: FormConfigData
  validate?: (callback?: (valid: boolean) => void) => boolean
}

// 标签项类型
export interface TabItem {
  label: string
  name: string
}

// 组件类型配置接口
export interface ComponentTypeConfig {
  label: string
  field: string
  component: any
  props?: Record<string, any>
  childComp?: any
}

// 表单组件类型映射
export interface FormItemObjMap {
  [key: string]: ComponentTypeConfig
}

// 表单设计器组件事件接口
export interface FormItemClickEvent {
  detail?: {
    field?: string
    item?: FormItem
  }
  index?: number
}

// 表单设计器组件类型
export interface DesignFormInstance {
  getFinalFormConfig: () => string | null
}

// 表单规则组件引用类型
export interface DesignFormRulesInstance {
  getFormData: () => FormConfigData | null
  validate: (callback?: (valid: boolean) => void) => boolean
}

// 表单配置类型
export interface FormConfig {
  items?: FormItem[]
  labelWidth?: string | number
  labelPosition?: 'top' | 'left' | 'right'
  inline?: boolean
  [key: string]: any
}

// 表单项类型
export interface FormItem {
  field: string
  label: string
  component: any
  defaultValue?: any
  props?: Record<string, any>
  rules?: Array<{
    required?: boolean
    message?: string
    trigger?: string | string[]
    [key: string]: any
  }>
  placeholder?: string
  customClass?: string
  dataType?: boolean
  requestUrl?: string
  requestParams?: Record<string, any>
  requestMethod?: string
  responseDataPath?: string
  options?: Array<{ label: string, value: any }>
  valueKey?: string
  labelKey?: string
  [key: string]: any
}

// 表单规则类型
export interface FormRule {
  required?: boolean
  message?: string
  trigger?: string | string[]
  validator?: string | ((rule: any, value: any, callback: (error?: string | Error) => void) => void)
  min?: number
  max?: number
  [key: string]: any
}

// 组件类型配置
export interface ComponentTypeConfig {
  field: string
  label: string
  component: any
  props?: Record<string, any>
  rules?: FormRule[]
  [key: string]: any
}

// 表单设计器组件事件接口
export interface FormItemClickEvent {
  detail?: {
    field?: string
    item?: FormItem
  }
  index?: number
  [key: string]: any
}

// 表单设计器组件类型
export interface DesignFormInstance {
  getFinalFormConfig: () => string | null
}

// 表单规则组件引用类型
export interface DesignFormRulesInstance {
  getFormData: () => FormConfigData | null
  validate: (callback?: (valid: boolean) => void) => boolean
}

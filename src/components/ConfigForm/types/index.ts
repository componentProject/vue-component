/*
 * @Author: moluoxixi 1983531544@qq.com
 * @Date: 2025-02-27 15:08:29
 * @LastEditors: moluoxixi 1983531544@qq.com
 * @LastEditTime: 2025-02-27 15:16:14
 * @FilePath: \vue-component\src\components\ConfigForm\types\index.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import type {
  FormProps,
  FormItemProps,
  ColProps,
  RowProps,
  PopoverProps,
  PopconfirmProps,
  ElTooltipProps,
} from 'element-plus'
import type { AsyncComponentOptions } from 'vue'

export interface ComponentsType {
  [key: string]: AsyncComponentOptions
}

import type { DefineComponent } from 'vue'

export type FormModelProps = Partial<FormProps['model']>
export type FormRuleProps = Partial<FormProps['rules']>
export type ComponentType = DefineComponent<ComponentPropsType>

export interface ComponentPropsType {
  ref?: string
  title?: string
  titleWidth?: string
  emphasize?: string
  prop?: string
  model?: FormModelProps
  slots?: string
  config: configType[]

  [key: string]: any
}

export interface configType {
  [key: string]: any
}

export interface FormItemConfig extends FormItemProps {
  /**
   * element-plus组件的名字,例如select
   */
  type?: string
  colConfig?: ColProps
  renderSlot?: string
  tooltipConfig?: ElTooltipProps
  popoverConfig?: PopoverProps
  popconfirmConfig?: PopconfirmProps
  render?: (scope?: Record<string, unknown>) => import('vue').VNode | any
  slots?: Record<string, (scope: Record<string, unknown>) => import('vue').VNode>
  message?: string
  config?: Record<string, any>

  prop?: string

  [key: string]: any
}

/**
 * el-form的表单配置项
 */
export interface formOptionsConfig extends FormProps {
  rules: FormRuleProps
  model: FormModelProps

  [key: string]: any
}

/**
 * rows对应每一行,
 *
 *     rows中的成员属性,除formItems外,其余配置项会作为el-row配置项
 *     formItems其成员对应每一列,其成员属性:
 *         type用于指定使用的内置组件类型,
 *
 *         render对应自定义jsx,
 *
 *         renderSlot:'插槽名称',接受configForm的对应插槽,
 *
 *         tooltipConfig,popoverConfig,popconfirmConfig,分别用来启用每一列是否启用tooltip，popover，popconfirm及其配置项
 *
 *         slots用于自定义每一列自定义组件的插槽内容,
 *
 *         colConfig作为el-col配置项,
 *
 *         其余配置项会传递给el-form-item
 */
export interface rowConfig extends RowProps {
  hidden?: boolean | ((params?: any) => boolean)
  render?: (scope?: Record<string, unknown>) => import('vue').VNode | any
  formItems?: Array<FormItemConfig>

  [key: string]: any
}

export interface ConfigFormProps {
  formOptions?: formOptionsConfig
  rows?: Array<rowConfig>
}

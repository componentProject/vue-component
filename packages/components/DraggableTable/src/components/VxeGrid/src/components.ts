// VxeGrid的components组件
import type { App } from 'vue'
import type { VxeGlobalConfig } from './_types'

import { VxeUI } from '@vxe-ui/core'
import { VxeColgroup } from './colgroup'
import { VxeColumn } from './column'
import { VxeGrid } from './grid'
import zhCN from './locale/lang/zh-CN'

import { VxeTable } from './table'

import { VxeToolbar } from './toolbar'

const components = [
  VxeColumn,
  VxeColgroup,
  VxeGrid,
  VxeTable,
  VxeToolbar,
]

// 默认安装
export function install(app: App, options?: VxeGlobalConfig) {
  VxeUI.setConfig(options)
  components.forEach(component => component.install(app))
}

// 保留兼容老版本
if (!VxeUI.hasLanguage('zh-CN')) {
  const defaultLanguage = 'zh-CN'
  VxeUI.setI18n(defaultLanguage, zhCN)
  VxeUI.setLanguage(defaultLanguage)
}
VxeUI.setTheme('light')

export * from './colgroup'

export * from './column'
export * from './grid'
// Components
export * from './table'
export * from './toolbar'
export * from './ui'

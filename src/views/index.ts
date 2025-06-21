/*
 * @Author: moluoxixi 1983531544@qq.com
 * @Date: 2025-05-07 14:08:20
 * @LastEditors: moluoxixi 1983531544@qq.com
 * @LastEditTime: 2025-05-09 20:03:22
 * @FilePath: \vue-template\src\views\index.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import type { Plugin, Component } from 'vue'

const pageFiles = import.meta.glob(['./**/index.vue', '!./**/components/*'], {
  eager: true,
  import: 'default',
})
const pages: Plugin = Object.keys(pageFiles).reduce((modules = {}, modulePath) => {
  const name: string | undefined = modulePath
  const component: Component = pageFiles[modulePath] as Component
  if (!component) return modules
  if (name) {
    modules[name as string] = component
  }
  return modules
}, {} as any) as Plugin
export default pages

// webpack下

/**
 * 获取./component目录下的所有组件,命名需要小驼峰
 * componentFiles.keys() 获取../components/ 路径下所有文件的文件路径组成的数组,eg:["./wlCheckbox/index.vue","./wlCheckboxGroup/index.vue"]
 */

import type { AsyncComponentOptions } from 'vue'

export interface ComponentsType {
  [key: string]: AsyncComponentOptions
}

const componentFiles = import.meta.glob('./components/**/*.vue')

const components: ComponentsType & {
  install?: (Vue: any) => void
} = Object.keys(componentFiles).reduce((modules = {}, modulePath) => {
  const name = modulePath.split('/').at(-2)
  const value = componentFiles[modulePath]
  if (value && name) modules[name] = value
  return modules
}, {} as any)
// const components = componentFiles.keys().reduce((modules, modulePath) => {
//   const name = modulePath.split('/')[1];
//   const value = componentFiles(modulePath).default;
//   if (value) modules[name] = value;
//   return modules;
// }, {});

// vite下
// const components = import.meta.glob("../components/**/*.vue")

const componentNames = Object.keys(components)
components.install = function (Vue) {
  componentNames.forEach((name) => {
    Vue.component(name, components[name])
  })
}
export default components

// //#region webpack下
// // 各种气泡框
// const popComponentFiles = require.context('./popComponents/', true, /\.vue$/);
// /**
//  * 获取./component目录下的所有组件,命名需要小驼峰
//  * componentFiles.keys() 获取../components/ 路径下所有文件的文件路径组成的数组,eg:["./wlCheckbox/index.vue","./wlCheckboxGroup/index.vue"]
//  */
//
// const fileList = [popComponentFiles];
//
// const components = fileList.reduce((p, componentFiles) => {
//   return componentFiles.keys().reduce((modules, modulePath) => {
//     const name = modulePath.split('/')[1];
//     const value = componentFiles(modulePath).default;
//     if (value) modules[name] = value;
//     return modules;
//   }, p);
// }, {});
//
// // const components = componentFiles.keys().reduce((modules, modulePath) => {
// //   const name = modulePath.split('/')[1];
// //   const value = componentFiles(modulePath).default;
// //   if (value) modules[name] = value;
// //   return modules;
// // }, {});
//
// //#endregion

//#region vite下

import type { ComponentsType } from '@/components/ConfigForm/src/types'

const componentFiles = import.meta.glob('./components/popComponents/**/*.vue')
const components: ComponentsType = Object.keys(componentFiles).reduce((modules, modulePath) => {
  const name = modulePath.split('/').at(-2)
  const value = componentFiles[modulePath]
  if (value && name) modules[name] = value
  return modules
}, {})
//#endregion
export default components

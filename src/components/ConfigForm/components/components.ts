// //#region webpack下
// // 单选
// const radioComponentFiles = require.context('./components/radioComponents/', true, /\.vue$/);
// // 复选框
// const checkboxComponentFiles = require.context('./components/checkboxComponents/', true, /\.vue$/);
// // 级联
// const cascaderComponentFiles = require.context('./components/cascaderComponents/', true, /\.vue$/);
// // 输入框
// const inputComponentFiles = require.context('./components/inputComponents/', true, /\.vue$/);
// // 时间选择器
// const timePickerCompoentFiles = require.context('./components/timePickerCompoents/', true, /\.vue$/);
// // 不常用组件
// const rarelyComponentFiles = require.context('./components/rarelyComponents/', true, /\.vue$/);
// // 其他组件
// const otherComponentFiles = require.context('./components/', true, /\.vue$/);
// /**
//  * 获取./component目录下的所有组件,命名需要小驼峰
//  * componentFiles.keys() 获取../components/ 路径下所有文件的文件路径组成的数组,eg:["./wlCheckbox/index.vue","./wlCheckboxGroup/index.vue"]
//  */
//
// const fileList = [
//   radioComponentFiles,
//   checkboxComponentFiles,
//   cascaderComponentFiles,
//   inputComponentFiles,
//   timePickerCompoentFiles,
//   rarelyComponentFiles,
//   otherComponentFiles,
// ];
//
// const components = fileList.reduce((p, componentFiles) => {
//   return componentFiles.keys().reduce((modules, modulePath) => {
//     const name = modulePath.split('/')[1];
//     const value = componentFiles(modulePath).default;
//     if (value) modules[name] = value;
//     return modules;
//   }, p);
// }, {});
// //#endregion

//#region vite下
import type { ComponentsType } from '@/components/ConfigForm/types'

const componentFiles = import.meta.glob('./components/**/*.vue')
const components: ComponentsType = Object.keys(componentFiles).reduce(
  (modules = {}, modulePath) => {
    const name = modulePath.split('/').at(-2)
    const value = componentFiles[modulePath]
    if (value && name) modules[name] = value
    return modules
  },
  {},
)
//#endregion
console.log('componentFiles', components)

//#region 全局注册组件
// const componentNames = Object.keys(components);
// components.install = function (Vue) {
//   componentNames.forEach(name => {
//     Vue.component(name, components[name]);
//   });
// };
//#endregion

export default components

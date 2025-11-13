// ConfigForm的main组件
import type { App } from 'vue'
// 直接导入 FormDesign 的 Flex 类
import _ from '@moluoxixi/components/FormDesign/src/utils/_'
import { defineAsyncComponent } from 'vue'
import Loading from './common/Loading.vue'
import { getFormConfig } from './utils/fieldConfig'
import './styles/index.scss'
// 注意：Element Plus 组件现在在组件内部直接从 'element-plus' 导入，不再全局注册
// 如果需要全局注册 Element Plus 组件，可以在应用入口使用：
// import ElementPlus from 'element-plus'
// app.use(ElementPlus)

const utilFuns: any = {}
const files: any = import.meta.glob(['./common/*', './components/*/*', './layout/*', '!./components/RichText/index.vue', '!./components/JsonEditor/index.vue', '!./components/Rule/index.vue', '!./common/formAction.vue'], { eager: true })
Object.keys(files).forEach((fileName) => {
  const result = files[fileName].default
  if (fileName.includes('.vue')) {
    utilFuns[result.ControlType] = result
  }
})
// 富文本
const RichText = defineAsyncComponent({
  loader: () => import('./components/RichText/index.vue'),
  loadingComponent: Loading,
})
RichText.ControlType = 'RichText' // 必须与文件名匹配
RichText.nameCn = '富文本'
RichText.icon = 'icon-textEdit'
RichText.formConfig = getFormConfig('RichText')
utilFuns[RichText.ControlType] = RichText
// json编辑器
const jsonEditor = defineAsyncComponent({
  loader: () => import('./components/JsonEditor/index.vue'),
  loadingComponent: Loading,
})
jsonEditor.ControlType = 'JsonEditor' // 必须与文件名匹配
jsonEditor.nameCn = 'JSON编辑'
jsonEditor.icon = 'icon-json-full'
jsonEditor.formConfig = getFormConfig('JsonEditor', [{ fieldName: 'default', component: 'JsonEditor' }])
jsonEditor.rule = _.getJsonValidate()
utilFuns[jsonEditor.ControlType] = jsonEditor

const formAction = defineAsyncComponent({
  loader: () => import('./common/formAction.vue'),
  loadingComponent: Loading,
})
formAction.ControlType = 'FormAction' // 必须与文件名匹配
formAction.isHide = true
utilFuns[formAction.ControlType] = formAction
// 规则
const Rule = defineAsyncComponent({
  loader: () => import('./components/Rule/index.vue'),
  loadingComponent: Loading,
})
Rule.ControlType = 'Rule' // 必须与文件名匹配
Rule.rule = _.getJsonValidate()
utilFuns[Rule.ControlType] = Rule

// 导出表单组件映射，供 ConfigForm 组件使用
export { utilFuns as formComponents }

function install(app: App) {
  // 注意：Element Plus 组件现在在组件内部直接从 'element-plus' 导入使用
  // 如果需要全局注册 Element Plus 组件（以便在模板中使用 <el-xxx>），
  // 可以在应用入口使用：
  // import ElementPlus from 'element-plus'
  // app.use(ElementPlus)

  // 注意：$Flex 和 $formcomponents 现在通过 FormDesignStore 在组件内部使用，不再需要全局注册
  // 全局注册所有表单组件，以便 <component :is> 可以解析
  for (const key in utilFuns) {
    if (utilFuns[key]) {
      app.component(key, utilFuns[key])
    }
  }
}
export const Dynamicform = defineAsyncComponent(() => import('./index.vue'))

export {
  install,
}
export default {
  install,
}

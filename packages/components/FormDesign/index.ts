import type { App } from 'vue'
import FormDesign from './src/index.vue'
import { defineAsyncComponent } from 'vue'
import Loading from './src/common/Loading.vue'
import ConfigForm from '@moluoxixi/components/ConfigForm'

// 导出组件
export default FormDesign
export { FormDesign }

// 安装函数
export function install(app: App) {
  // 注意：Element Plus 组件现在在组件内部直接从 'element-plus' 导入使用
  // 如果需要全局注册 Element Plus 组件（以便在模板中使用 <el-xxx>），
  // 可以在应用入口使用：
  // import ElementPlus from 'element-plus'
  // app.use(ElementPlus)

  // 注册 FormDesign 组件
  app.component('FormDesign', FormDesign)

  // 注册必要的内部组件
  const componentsToRegister = [
    {
      name: 'draggable',
      component: () => import('vuedraggable'),
    },
    {
      name: 'CustomDialog',
      component: () => import('./src/common/CustomDialog.vue'),
    },
    {
      name: 'ConditionSelect',
      component: () => import('./src/common/ConditionSelect.vue'),
    },
    {
      name: 'HighConditionSelect',
      component: () => import('./src/common/ConditionSelect/ConditionModule.vue'),
    },
    {
      name: 'Shape',
      component: () => import('./src/components/Shape.vue'),
    },
    {
      name: 'FormStyle',
      component: () => import('./src/common/formStyle.vue'),
    },
  ]

  componentsToRegister.forEach(({ name, component }) => {
    try {
      if (!app._context.components || !app._context.components[name]) {
        app.component(name, defineAsyncComponent({
          loader: component as any,
          loadingComponent: Loading,
        }) as any)
      }
    }
    catch (error) {
      console.warn(`FormDesign: 无法注册组件 ${name}`, error)
    }
  })

  app.use(ConfigForm)
}

// 为组件添加 install 方法，以便可以作为插件使用
FormDesign.install = install

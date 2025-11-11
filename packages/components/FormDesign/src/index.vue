<template>
  <Framework :header-show="headerShow">
    <template v-if="headerShow" #nav>
      <Nav />
    </template>
    <template #navlist>
      <NavList :menu="menu" />
    </template>
    <template #left>
      <ComponentList
        :basic-fields="basicFields"
        :layout-fields="layoutFields"
      />
    </template>
    <template #workspace>
      <Workspace ref="workspace" />
    </template>
    <template v-if="panel.length > 0" #propsPanel>
      <PropsPanel
        :column="menu.column"
        :panel="panel"
        @save="onSave"
      />
    </template>
    <template #other>
      <FormPreview ref="formPreview" />
    </template>
  </Framework>
</template>

<script setup lang="ts">
import {
  defineAsyncComponent,
  getCurrentInstance,
  onMounted,
  onUnmounted,
  provide,
  ref,
} from 'vue'
import Framework from './layouts/Framework.vue'
import NavList from './components/NavList.vue'
import Nav from './components/Nav.vue'
import ComponentList from './components/ComponentList.vue'
import Workspace from './components/Workspace.vue'
import PropsPanel from './components/PropsPanel.vue'
import uiControl from './controller/ui'
import hisContrl from './controller/history'
import formStore from './controller/form'
import actionContrl from './controller/action'
import store from './controller/shortcut'
import { listenGlobalKeyDown } from './utils/shortcutKey'
import formKeyconList from './utils/formKeycon'
import type { Controls } from './type'
import type { emitsType, propsType } from './_types'
import type KeyController from 'keycon'
import { FormDesignStore, FormDesignStoreKey } from './store'
import Loading from './common/Loading.vue'
import ConfigForm from '@moluoxixi/components/ConfigForm'
import './styles/index.scss'

// 初始化表单组件（同步导入 ConfigForm 组件）
// 直接导入 formComponents，确保组件列表立即可用
import { formComponents } from '@moluoxixi/components/ConfigForm/src/main'

defineOptions({
  name: 'FormDesign',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<propsType>(), {
  basicFields: () => [],
  layoutFields: () => [],
  shortcutDisabled: false,
  headerShow: true,
  menu: () => ({ left: [], right: [], column: true }),
  panel: () => ['form', 'json', 'global'],
})

const emits = defineEmits<emitsType>()

// 创建 FormDesign Store 实例
const formDesignStore = new FormDesignStore()

// 注意：不再设置 window.VueContext，应该使用 Store 模式
// controller 中的代码应该通过 inject('control') 获取 formStore，然后使用 formStore 的方法
if (formComponents) {
  formDesignStore.registerFormComponents(formComponents)
}

// 同时异步加载并注册 ConfigForm 组件到 Vue 应用（用于向后兼容）
const instance = getCurrentInstance()
if (instance) {
  const app = instance.appContext.app

  // 注册必要的组件到 Vue 应用
  const componentsToRegister = [
    {
      name: 'draggable',
      component: () => import('vuedraggable'),
    },
    {
      name: 'CustomDialog',
      component: () => import('./common/CustomDialog.vue'),
    },
    {
      name: 'ConditionSelect',
      component: () => import('./common/ConditionSelect.vue'),
    },
    {
      name: 'HighConditionSelect',
      component: () => import('./common/ConditionSelect/ConditionModule.vue'),
    },
    {
      name: 'Shape',
      component: () => import('./components/Shape.vue'),
    },
    {
      name: 'FormStyle',
      component: () => import('./common/formStyle.vue'),
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

  // 注册所有表单组件到 Vue 应用，以便 <component :is> 可以解析
  if (formComponents) {
    for (const key in formComponents) {
      if (formComponents[key] && !app._context.components?.[key]) {
        try {
          app.component(key, formComponents[key])
        }
        catch (error) {
          console.warn(`FormDesign: 无法注册表单组件 ${key}`, error)
        }
      }
    }
  }

  app.use(ConfigForm)
}

// 通过 provide 提供 Store 给子组件
provide(FormDesignStoreKey, formDesignStore)

const workspace = ref()
const formPreview = ref()
let dom: HTMLDivElement
function mouseenterHandler() {
  dom?.focus()
}

function mouseleaveHandler() {
  dom?.blur()
}
const control: Controls = {
  uiControl,
  hisContrl,
  formStore,
  actionContrl,
  store,
}
let keycons: KeyController

onMounted(() => {
  dom = workspace.value?.$el
  if (!props.shortcutDisabled && dom) {
    dom.addEventListener('mouseenter', mouseenterHandler)
    dom.addEventListener('mouseleave', mouseleaveHandler)
    keycons = listenGlobalKeyDown(formKeyconList, dom)
  }
})
onUnmounted(() => {
  if (!props.shortcutDisabled) {
    dom?.removeEventListener('mouseenter', mouseenterHandler)
    dom?.removeEventListener('mouseleave', mouseleaveHandler)
    keycons?.destroy()
  }
  // 清理 Store
  formDesignStore.cleanup()
})
provide('control', control)

function onSave() {
  emits('save', formStore?.get('AllFormResult'))
}

function getJson() {
  formDesignStore.$EventBus.emit('setSave')
}

function setJson(jsonList: any[]) {
  const newJson = jsonList.map((json: any) => {
    return formDesignStore.jsonToForm(json)
  })
  formStore.updateAllFormList(newJson)
  formStore?.set('save', true)
}

// 暴露方法供外部调用
defineExpose({
  getJson,
  setJson,
})
</script>

<!-- <style> -->
<!-- #app { -->
<!--  font-family: Avenir, Helvetica, Arial, sans-serif; -->
<!--  -webkit-font-smoothing: antialiased; -->
<!--  -moz-osx-font-smoothing: grayscale; -->
<!--  text-align: center; -->
<!-- } -->
<!-- </style> -->

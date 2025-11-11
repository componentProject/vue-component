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

<script lang="ts">
import type {
  PropType,
} from 'vue'
import {
  defineAsyncComponent,
  defineComponent,
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
// 根据编辑器判断,走不同的快捷键逻辑
import formKeyconList from './utils/formKeycon'
import type { Controls, MenuBarData } from './type'
import type KeyController from 'keycon'
import { FormDesignStore, FormDesignStoreKey } from './store'

export default defineComponent({
  name: 'StarfishEditor',
  components: {
    Framework,
    NavList,
    ComponentList,
    Workspace,
    PropsPanel,
    FormPreview: defineAsyncComponent(() => import('./components/FormPreview.vue')),
    // eslint-disable-next-line vue/no-reserved-component-names
    Nav,
  },
  props: {
    /**
     * 基础控件
     */
    basicFields: {
      type: Array,
      default() {
        return []
      },
    },
    /**
     * 布局控件
     */
    layoutFields: {
      type: Array,
      default() {
        return []
      },
    },
    /**
     * 是否禁用快捷键
     */
    shortcutDisabled: {
      type: Boolean,
      default: false,
    },
    /**
     * 导航头是否展示
     */
    headerShow: {
      type: Boolean,
      default: true,
    },
    /** 顶部工具栏配置 */
    menu: {
      type: Object as PropType<MenuBarData>,
      default: () => ({ left: [], right: [], column: true }),
    },
    // 右侧配置属性tab
    panel: {
      type: Array,
      default: () => ['form', 'json', 'global'],
    },
  },
  emits: ['save'],
  setup(props: any, { emit }) {
    // 创建 FormDesign Store 实例
    const formDesignStore = new FormDesignStore()

    // 注意：不再设置 window.VueContext，应该使用 Store 模式
    // controller 中的代码应该通过 inject('control') 获取 formStore，然后使用 formStore 的方法

    // 初始化表单组件（异步加载 ConfigForm 组件）
    const instance = getCurrentInstance()
    if (instance) {
      // const app = instance.appContext.app

      // 异步加载并注册 ConfigForm 组件
      import('@moluoxixi/components/ConfigForm/src/main').then((ConfigFormModule) => {
        // 如果模块导出了 formComponents，直接使用
        if (ConfigFormModule.formComponents) {
          formDesignStore.registerFormComponents(ConfigFormModule.formComponents)
        }
      }).catch((error) => {
        console.warn('FormDesign: 无法加载 ConfigForm 模块', error)
      })
    }

    // 通过 provide 提供 Store 给子组件
    provide(FormDesignStoreKey, formDesignStore)

    const workspace = ref()
    const formPreview = ref()
    let dom: HTMLDivElement
    const mouseenterHandler = () => {
      dom?.focus()
    }

    const mouseleaveHandler = () => {
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
      if (!props.shortcutDisabled) {
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
    return {
      workspace,
      formPreview,
      onSave() {
        emit('save', formStore?.get('AllFormResult'))
      },
      getJson() {
        formDesignStore.$EventBus.emit('setSave')
      },
      setJson(jsonList: any[]) {
        const newJson = jsonList.map((json: any) => {
          return formDesignStore.jsonToForm(json)
        })
        formStore.updateAllFormList(newJson)
        formStore?.set('save', true)
      },
    }
  },
})
</script>

<!-- <style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
</style> -->

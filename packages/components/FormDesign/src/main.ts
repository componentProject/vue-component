// FormDesign的main组件
import type { App } from 'vue'
import StarfishForm from 'starfish-form'
import { defineAsyncComponent } from 'vue'
import Loading from './common/Loading.vue'
import StarfishEditor from './starfish-editor.vue'

export default {
  install: (app: App) => {
    // 注意：$EventBus 和 $Flex 现在通过 Store 模式在组件内部使用，不再需要全局注册
    // FormDesign 组件使用 FormDesignStore，通过 provide/inject 共享 $EventBus 和 $Flex
    // 合并使用的
    app.use(StarfishForm)
    app.component(
      'CustomDialog',
      defineAsyncComponent(() => import('./common/CustomDialog.vue')),
    )
    app.component(
      'ConditionSelect',
      defineAsyncComponent(() => import('./common/ConditionSelect.vue')),
    )
    app.component(
      'HighConditionSelect',
      defineAsyncComponent(() => import('./common/ConditionSelect/ConditionModule.vue')),
    )
    app.component(
      'draggable',
      defineAsyncComponent({
        loader: () => import('vuedraggable'),
        loadingComponent: Loading,
      }),
    )
    app.component(
      'Shape',
      defineAsyncComponent(() => import('./components/Shape.vue')),
    )
    app.component(
      'FormStyle',
      defineAsyncComponent(() => import('./common/formStyle.vue')),
    )
    app.component('StarfishEditor', StarfishEditor)
  },
}
// app.mount("#app");

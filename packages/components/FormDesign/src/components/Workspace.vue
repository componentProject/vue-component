<template>
  <div class="editor_pages_center" tabindex="1" @click="onEditorCenter">
    <div
      ref="canvasBox"
      class="canvasBox"
      :class="[
        fullScreen ? 'fullScreenBox' : '',
        `${pageType}_layout`,
        globalDatas.csslist?.join(' '),
      ]"
      :style="`--scale:${scale} `"
    >
      <div
        ref="dragDom"
        class="draggable_container"
        @contextmenu="handleNoDraggable"
      >
        <div v-show="pasteShow" ref="editForm" class="editForm">
          <span @click="handlePaste">粘贴</span>
        </div>
        <Draggable
          v-model="allmainList"
          class="dragArea"
          animation="300"
          ghost-class="itemGhost"
          group="starfish-form"
          item-key="id"
          @add="addControl"
          @choose="chooseClick"
          @update="changePos"
        >
          <template #item="{ element, index }">
            <Shape
              :active="currentId == element.id"
              :current-index="index"
              :current-id="element.id"
              :item="element"
              :len="allmainList.length"
            >
              <component
                :is="element.ControlType"
                :drag="true"
                :item="element"
                :data="{}"
                v-bind="globalDatas"
              />
            </Shape>
          </template>
        </Draggable>
        <div v-if="allmainList.length == 0" class="form-empty">
          从左侧拖拽来添加字段
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  inject,
  nextTick,
  ref,
} from 'vue'
import { paste } from '../utils/formKeycon'
import type { AllFormItem, BaseFormConfig, Controls } from '../type'
import { useFormDesignStore } from '../composables/useFormDesignStore'
import Shape from './Shape.vue'
import Draggable from 'vuedraggable'

export default defineComponent({
  components: {
    Shape,
    Draggable,
  },
  setup() {
    const { uiControl, store, formStore } = inject<Controls>('control') || {}
    const formDesignStore = useFormDesignStore()
    const formcomponents = formDesignStore.$formcomponents.value
    // 画布dom
    const canvasBox = ref()
    // 页面默认大小
    const canvasSize = ref(1)
    // 移动的dom
    const dragDom = ref()
    // 粘贴模块是否显示
    const pasteShow = ref(false)
    const editForm = ref()

    const globalDatas = computed(() => formStore?.get('globalDatas'))

    const fullScreen = computed(() => uiControl?.get('isFullscreen'))

    const pageType = computed(() => uiControl?.get('pageType'))

    /**
     * dynamic: true
     * 代表全局配置可以定义到组件配置中
     */
    const dynamicList = computed(() =>
      formStore?.get('globalFormList')?.filter((item: BaseFormConfig) => {
        if (item.dynamic) {
          return item
        }
        else {
          return null
        }
      }),
    )

    const allmainList = computed({
      get() {
        return formStore?.get('allFormList')
      },
      set(value: AllFormItem[]) {
        // 防止引用类型污染
        const $Flex = formDesignStore.$Flex
        value = value.map((item: AllFormItem) => {
          console.log(formcomponents[item.ControlType as any])
          if (!item.data && !item.controlItems) {
            item = $Flex.deepClone(item)
            const currentComponent = formcomponents[item.ControlType as any]
            item.formConfig = currentComponent.formConfig
            item.data = item.formConfig.data()
            if (!item.data.fieldName) {
              item.data.fieldName
                = `${item.ControlType}_${$Flex.generateMixed()}`
            }
            item.id = $Flex.generateMixed()
            let controlItems = (
              item.formConfig.morenConfig() as Array<any>
            ).concat(dynamicList.value)
            /**
             * 兼容动作面板,不同表单可能需要的事件不一样
             */
            if (
              currentComponent.actionType
              && currentComponent.actionType.length > 0
            ) {
              console.log(controlItems)
              controlItems.forEach((item) => {
                if (item.ControlType == 'Action') {
                  item.data.formConfig = {
                    value: {},
                    items: [],
                  }
                  currentComponent.actionType.forEach(
                    (action: string, index: number) => {
                      item.data.formConfig.items.push({
                        label: action,
                        value: action,
                        id: index + 1,
                      })
                    },
                  )
                }
              })
            }
            else {
              controlItems = controlItems.filter((item) => {
                if (item.ControlType !== 'Action') {
                  return item
                }
                else {
                  return null
                }
              })
            }
            item.rules = $Flex.controlFormRule(controlItems, item)
            item.controlItems = controlItems
          }
          // delete item.formConfig;
          // delete item.icon;
          return item
        })
        formStore?.updateAllFormList(value)
      },
    })
    const currentId = computed(() => {
      console.log('aaaaaaa斤斤计较', formStore?.get('currentId'))
      return formStore?.get('currentId')
    })

    const handleCanvasScale = () => {
      // 处理页面的放大缩小
      canvasBox.value.style.transform = `scale(${canvasSize.value})`
    }
    const handleCanvasSize = (size: string) => {
      const $Flex = formDesignStore.$Flex
      if ($Flex.clickCountLimit()) {
        // 限制放大缩小指定范围
        if (size === 'add' && canvasSize.value < 1.5) {
          canvasSize.value = Number((canvasSize.value + 0.1).toFixed(2))
        }
        else if (size === 'cut' && canvasSize.value > 0.5) {
          canvasSize.value = Number((canvasSize.value - 0.1).toFixed(2))
        }
        else if (size === 'restore') {
          canvasSize.value = 1
        }
        handleCanvasScale()
      }
    }
    const chooseClick = (e: any) => {
      formStore?.setFormCurrentId(allmainList.value[e.oldIndex]?.id)
      formStore?.setFormCurrentIndex(e.oldIndex)
      store?.set('curList', allmainList.value)
    }
    const changePos = (e: any) => {
      formStore?.setFormCurrentId(allmainList.value[e.newIndex]?.id)
      formStore?.setFormCurrentIndex(e.newIndex)
      store?.set('curList', allmainList.value)
    }
    const addControl = (e: any) => {
      formStore?.setFormCurrentId(allmainList.value[e.newIndex]?.id)
      formStore?.setFormCurrentIndex(e.newIndex)
      store?.set('curList', allmainList.value)
    }
    const handlePaste = () => {
      pasteShow.value = false
      paste()
    }
    const handleNoDraggable = (e: any) => {
      if (pasteShow.value) {
        pasteShow.value = false
      }
      e.preventDefault()
      const path = e.path
      for (let i = 0; i < path?.length; i++) {
        if (
          path[i].getAttribute
          && path[i].getAttribute('class')
          && path[i].getAttribute('class').includes('shape')
        ) {
          return
        }
      }
      const x = e.offsetX
      const y = e.offsetY
      nextTick(() => {
        editForm.value.style.left = `${x}px`
        editForm.value.style.top = `${y}px`
        pasteShow.value = true
      })
    }
    return {
      scale: computed(() => uiControl?.get<number>('scale')),
      globalDatas,
      canvasBox,
      editForm,
      handleCanvasSize,
      pageType,
      canvasSize,
      dragDom,
      chooseClick,
      addControl,
      changePos,
      allmainList,
      currentId,
      handleNoDraggable,
      handlePaste,
      pasteShow,
      fullScreen,
      onEditorCenter: (e: any) => {
        if (e && e.path && e.path[0].className == 'editor_pages_center') {
          formStore?.setFormCurrentId('')
          pasteShow.value = false
        }
      },
    }
  },
})
</script>

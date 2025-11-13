<!-- FormDesign的ComponentList组件 -->
<template>
  <ElScrollbar class="editor_pages_left">
    <div class="filter">
      <ElInput
        v-model="filterContent"
        placeholder="请输入关键词进行过滤"
      />
    </div>
    <ElButton v-if="newcomponentlist.length > 0" text>
      基础控件
    </ElButton>
    <Draggable
      class="dragArea list-group"
      :list="newcomponentlist"
      :group="{ name: 'starfish-form', pull: 'clone', put: false }"
      :sort="false"
      item-key="id"
    >
      <template #item="{ element }">
        <div
          class="list-group-item"
          :alt="element.nameCn"
          @click.stop="clickAddControl(element)"
        >
          <div class="form-item">
            <ElIcon>
              <component :is="getIconComponent(element.icon)" />
            </ElIcon>
          </div>
          <div class="item-text">
            {{ element.nameCn }}
          </div>
        </div>
      </template>
    </Draggable>
    <ElButton v-if="layoutList.length > 0" text>
      布局控件
    </ElButton>
    <Draggable
      class="dragArea list-group"
      :list="layoutList"
      :group="{ name: 'starfish-form', pull: 'clone', put: false }"
      :sort="false"
      item-key="id"
    >
      <template #item="{ element }">
        <div
          class="list-group-item"
          :alt="element.nameCn"
          @click.stop="clickAddControl(element)"
        >
          <div class="form-item">
            <ElIcon>
              <component :is="getIconComponent(element.icon)" />
            </ElIcon>
          </div>
          <div class="item-text">
            {{ element.nameCn }}
          </div>
        </div>
      </template>
    </Draggable>
  </ElScrollbar>
</template>

<script lang="ts">
import type { Component } from 'vue'
import type { BaseComponentItem } from '../type'
import {
  Brush,
  Calendar,
  Clock,
  Document,
  DocumentChecked,
  Edit,
  Minus as ElMinus,
  Grid,
  Operation,
  SwitchButton,
  Warning,
} from '@element-plus/icons-vue'
import {
  ElButton,
  ElIcon,
  ElInput,
  ElScrollbar,
} from 'element-plus'
import { computed, defineComponent, ref } from 'vue'
import Draggable from 'vuedraggable'

import { useFormDesignStore } from '../composables/useFormDesignStore'
import formStore from '../controller/form'

export default defineComponent({
  components: {
    ElScrollbar,
    ElInput,
    ElButton,
    ElIcon,
    Draggable,
  },
  props: {
    basicFields: {
      type: Array,
      default() {
        return []
      },
    },
    layoutFields: {
      type: Array,
      default() {
        return []
      },
    },
  },
  setup(props) {
    const formDesignStore = useFormDesignStore()
    const filterContent = ref('')

    // 图标名到 Element Plus 图标组件的映射
    const iconMap: Record<string, Component> = {
      'icon-wenbenkuang': Edit,
      'icon-fuxuankuang_xuanzhong': DocumentChecked,
      'icon-danxuankuang': Operation,
      'icon-xuanzeqi': Operation,
      'icon-kaiguanguan': SwitchButton,
      'icon-24gl-calendar': Calendar,
      'icon-riqishijian': Clock,
      'icon-shijian': Clock,
      'icon-sen103': Brush,
      'icon-icon_huakuai': Operation,
      'icon-textarea': Edit,
      'icon-textEdit': Edit,
      'icon-json-full': Document,
      'icon-jinggao': Warning,
      'icon-35zhage': Grid,
      'icon-biaoge1': Grid,
      'icon-fengexian1': ElMinus,
      'icon-zhediemianban': Operation,
      'icon-jishuqi': Operation,
    }

    // 根据图标名获取图标组件
    const getIconComponent = (iconName: string): Component => {
      if (!iconName)
        return Operation
      return iconMap[iconName] || Operation
    }

    // 从 Store 获取表单组件
    const formcomponents = computed(() => {
      const components = formDesignStore.$formcomponents.value
      const lastFormComponents: BaseComponentItem[] = []

      for (const key in components) {
        const item = components[key]
        if (item.isHide) {
          continue
        }
        const model: BaseComponentItem & { rule?: any } = {
          ControlType: item.ControlType,
          icon: item.icon,
          nameCn: item.nameCn,
          layout: !!item.layout,
        }
        // 有json编辑器时，验证格式有固定的规则
        if (item.rule) {
          model.rule = item.rule
        }
        lastFormComponents.push(model as BaseComponentItem)
      }

      return lastFormComponents
    })

    const newcomponentlist = computed(() => {
      return formcomponents.value.filter((item: BaseComponentItem) => {
        if (
          item.nameCn
          && item.nameCn.includes(filterContent.value)
          && !item.layout
        ) {
          if ((props.basicFields as any[]).length == 0) {
            return true
          }
          else if ((props.basicFields as any[]).length > 0) {
            let isHave = false;
            (props.basicFields as any[]).forEach((fieldItem: any) => {
              if (
                fieldItem.toLocaleLowerCase()
                == (item.ControlType as string).toLocaleLowerCase()
              ) {
                isHave = true
                return fieldItem
              }
            })
            return isHave
          }
        }
        return null
      })
    })

    const layoutList = computed(() => {
      return formcomponents.value.filter((item: any) => {
        if (
          item.nameCn
          && item.nameCn.includes(filterContent.value)
          && item.layout
        ) {
          if ((props.layoutFields as any[]).length == 0) {
            return true
          }
          else if ((props.layoutFields as any[]).length > 0) {
            let isHave = false;
            (props.layoutFields as any[]).forEach((fieldItem: any) => {
              if (
                fieldItem.toLocaleLowerCase() == item.ControlType.toLocaleLowerCase()
              ) {
                isHave = true
                return fieldItem
              }
            })
            return isHave
          }
        }
        return null
      })
    })

    const clickAddControl = (item: any) => {
      formStore.setAllFormList(formDesignStore.jsonToForm(item))
    }

    return {
      filterContent,
      newcomponentlist,
      layoutList,
      clickAddControl,
      getIconComponent,
    }
  },
})
</script>

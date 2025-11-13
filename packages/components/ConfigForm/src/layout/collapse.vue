<!-- ConfigForm的collapse组件 -->
<template>
  <div class="collapse_box">
    <div class="control">
      <ElCollapse v-model="activeName" :accordion="item.data.accordion">
        <ElCollapseItem v-for="(colItem, index) in item.data.items" :key="index" :title="colItem.name" :name="colItem.name">
          <template v-if="drag">
            <Draggable v-model="colItem.list" class="draggable-box" animation="300" ghost-class="itemGhost" group="starfish-form" item-key="id" @add="addControl($event, colItem.list, index)" @choose="chooseClick($event, colItem.list)" @update="changePos($event, colItem.list)">
              <template #item="{ element, index: _index }">
                <Shape v-if="element.data" :active="currentId === element.id" :current-index="_index" :current-id="element.id" :len="colItem.list.length" :item="element">
                  <component :is="element.ControlType" :drag="true" :item="element" :data="{}" />
                </Shape>
              </template>
            </Draggable>
          </template>
          <template v-else-if="!drag && colItem.list.length > 0">
            <template v-for="listItem in colItem.list">
              <ElFormItem v-if="!listItem.layout" :key="listItem.id" :prop="listItem.data.fieldName">
                <!-- v-if="listItem.show" -->
                <component :is="listItem.ControlType" :item="listItem" :data="data || '{}'" :drag="false" @change="$emit('change')" />
              </ElFormItem>
              <template v-else>
                <component :is="listItem.ControlType" :key="listItem.id" :item="listItem" :data="data || '{}'" :drag="false" @change="$emit('change')" />
              </template>
            </template>
          </template>
        </ElCollapseItem>
      </ElCollapse>
    </div>
  </div>
</template>

<script lang="ts">
import { ElCollapse, ElCollapseItem, ElFormItem } from 'element-plus'
import { computed, defineComponent, getCurrentInstance, inject, ref } from 'vue'
import Draggable from 'vuedraggable'
import { getFlex, useWatch } from '../utils/customHooks'
import { getFormConfig } from '../utils/fieldConfig'
import fieldProps from '../utils/fieldProps'

export default defineComponent({
  components: {
    ElCollapse,
    ElCollapseItem,
    ElFormItem,
    Draggable,
  },
  ControlType: 'Collapse', // 必须与文件名匹配
  nameCn: '折叠面板',
  icon: 'icon-zhediemianban',
  layout: true,
  formConfig: getFormConfig('Collapse', [
    { fieldName: 'items', component: 'Panel', label: '折叠面板' },
    { fieldName: 'accordion', component: 'Switch', label: '手风琴模式' },
  ]),
  props: {
    ...fieldProps,
  },
  emits: ['change'],
  setup(props) {
    const activeName = ref(props.item.data.items[0].name)
    const { formStore, store } = inject('control') || {}
    const { proxy } = getCurrentInstance() as any
    const currentId = computed(() => {
      return formStore.get('currentId')
    })
    useWatch(props)
    return {
      activeName,
      currentId,
      addControl(e: any, list: any, index: number) {
        const $Flex = getFlex()
        // eslint-disable-next-line vue/no-mutating-props
        props.item.data.items[index].list = list.map((item: any) => {
          return $Flex.jsonToForm(item)
        })
        formStore.setFormCurrentId(props.item.data.items[index].list[e.newIndex].id)
        formStore.setFormCurrentIndex(e.newIndex)
        store.set('curList', props.item.data.items[index].list)
      },
      chooseClick(e: any, list: any) {
        formStore.setFormCurrentId(list[e.oldIndex].id)
        formStore.setFormCurrentIndex(e.oldIndex)
        store.set('curList', list)
      },
      changePos(e: any, list: any) {
        formStore.setFormCurrentId(list[e.newIndex]?.id)
        formStore.setFormCurrentIndex(e.newIndex)
        store.set('curList', list)
      },
    }
  },
})
</script>

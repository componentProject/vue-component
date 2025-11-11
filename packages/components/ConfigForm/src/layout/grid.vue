<template>
  <div class="starfish-grid_box">
    <ElRow :gutter="item.data.gutter">
      <template v-if="drag">
        <ElCol v-for="(colItem, index) in gridList" :key="index" class="grid-col" :span="colItem.span">
          <draggable v-model="colItem.list" class="draggable-box" animation="300" ghost-class="itemGhost" group="starfish-form" item-key="id" @add="addControl($event, index)" @choose="chooseClick($event, index)" @update="changePos($event, index)">
            <template #item="{ element, index: _index }">
              <Shape v-if="element.data" :active="currentId == element.id" :current-id="element.id" :current-index="_index" :list="colItem.list">
                <component :is="element.ControlType" :drag="true" :item="element" :data="{}" />
              </Shape>
            </template>
          </draggable>
        </ElCol>
      </template>
      <template v-else-if="!drag && item.data.columns.length > 0">
        <ElCol v-for="(colItem, index) in item.data.columns" :key="index" class="grid-col" :span="colItem.span">
          <template v-for="listItem in colItem.list">
            <ElFormItem v-if="!listItem.layout" :key="listItem.id" :prop="listItem.data.fieldName">
              <component :is="listItem.ControlType" :item="listItem" :data="data || '{}'" :drag="false" @change="$emit('change')" />
            </ElFormItem>
            <template v-else>
              <component :is="listItem.ControlType" :key="listItem.id" :item="listItem" :data="data || '{}'" :drag="false" @change="$emit('change')" />
            </template>
          </template>
        </ElCol>
      </template>
    </ElRow>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, getCurrentInstance, inject, nextTick } from 'vue'
import { getFormConfig } from '../utils/fieldConfig'
import fieldProps from '../utils/fieldProps'
import { getFlex, useWatch } from '../utils/customHooks'
import { ElCol, ElFormItem, ElRow } from 'element-plus'

export default defineComponent({
  components: {
    ElRow,
    ElCol,
    ElFormItem,
  },
  ControlType: 'Grid', // 必须与文件名匹配
  nameCn: '栅格布局',
  icon: 'icon-35zhage',
  layout: true,
  formConfig: getFormConfig(
    'Grid',
    [
      { fieldName: 'gutter', component: 'InputNumber' },
      { fieldName: 'columns', component: 'ListConfig' },
    ],
    ['required', 'rule', 'tip'],
  ),
  props: {
    ...fieldProps,
  },
  emits: ['change'],
  setup(props) {
    console.log(props)
    const gridList = computed(() => props.item.data.columns)
    const { proxy } = getCurrentInstance() as any
    const { formStore, store } = inject('control') || {}
    const chooseClick = (e: any, index: number) => {
      formStore.setFormCurrentId(gridList.value[index].list[e.oldIndex]?.id)
      formStore.setFormCurrentIndex(e.oldIndex)
      store.set('curList', gridList.value[index].list)
    }
    const currentId = computed(() => {
      return formStore.get('currentId')
    })
    useWatch(props)
    return {
      gridList,
      chooseClick,
      currentId,
      changePos(e: any, index: number) {
        formStore.setFormCurrentId(gridList.value[index].list[e.newIndex]?.id)
        formStore.setFormCurrentIndex(e.newIndex)
        store.set('curList', gridList.value[index].list)
      },
      async addControl(e: any, index: number) {
        const $Flex = getFlex()
        gridList.value.forEach((colItem: any) => {
          colItem.list = colItem.list.map((item: any) => {
            return $Flex.jsonToForm(item)
          })
        })
        await nextTick()
        formStore.setFormCurrentId(gridList.value[index].list[e.newIndex].id)
        formStore.setFormCurrentIndex(e.newIndex)
        store.set('curList', gridList.value[index].list)
      },
    }
  },
})
</script>

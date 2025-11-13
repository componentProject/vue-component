<template>
  <div class="starfish-table_box">
    <table class="table_layout" :class="item.data.borderShow ? 'table_layout_border' : ''">
      <tr v-for="(trItem, index) in item.data.trs" :key="index">
        <td v-for="(tdItem, tdIndex) in trItem.tds" :key="tdIndex">
          <template v-if="drag">
            <draggable v-model="tdItem.list" class="draggable-box" animation="300" ghost-class="itemGhost" group="starfish-form" item-key="id" @add="addControl($event, tdItem.list, index, tdIndex)" @choose="chooseClick($event, tdItem.list)" @update="changePos($event, tdItem.list)">
              <template #item="{ element, index: _index }">
                <Shape v-if="element.data" :active="currentId == element.id" :current-index="_index" :current-id="element.id" :len="tdItem.list.length" :item="element">
                  <component :is="element.ControlType" :drag="true" :item="element" :data="{}" />
                </Shape>
              </template>
            </draggable>
          </template>
          <template v-else-if="!drag && tdItem.list.length > 0">
            <template v-for="listItem in tdItem.list">
              <ElFormItem v-if="!listItem.layout" :key="listItem.id" :prop="listItem.data.fieldName">
                <component :is="listItem.ControlType" :item="listItem" :data="data || '{}'" :drag="false" @change="$emit('change')" />
              </ElFormItem>
              <template v-else>
                <component :is="listItem.ControlType" :key="listItem.id" :item="listItem" :data="data || '{}'" :drag="false" @change="$emit('change')" />
              </template>
            </template>
          </template>
        </td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
import { ElFormItem } from 'element-plus'
import { computed, defineComponent, getCurrentInstance, inject } from 'vue'
import { getFlex, useWatch } from '../utils/customHooks'
import { getFormConfig } from '../utils/fieldConfig'
import fieldProps from '../utils/fieldProps'

export default defineComponent({
  components: {
    ElFormItem,
  },
  ControlType: 'TableLayout',
  nameCn: '表格布局',
  icon: 'icon-biaoge1',
  layout: true,
  props: {
    ...fieldProps,
  },
  formConfig: getFormConfig(
    'TableLayout',
    [
      // { fieldName: "borderShow", component: "Switch", label: "是否显示边框" },
      // {fieldName: 'borderWidth', component: 'InputNumber', label: "边框宽度"}
    ],
    ['required', 'rule', 'tip'],
  ),
  emits: ['change'],
  setup(props) {
    const { proxy } = getCurrentInstance() as any
    const { formStore, store } = inject('control') || {}
    const currentId = computed(() => {
      return formStore.get('currentId')
    })
    useWatch(props)
    return {
      currentId,
      chooseClick(e: any, list: any[]) {
        formStore.setFormCurrentId(list[e.oldIndex].id)
        formStore.setFormCurrentIndex(e.oldIndex)
        store.set('curList', list)
      },
      changePos(e: any, list: any[]) {
        formStore.setFormCurrentId(list[e.newIndex]?.id)
        formStore.setFormCurrentIndex(e.newIndex)
        store.set('curList', list)
      },
      addControl(e: any, list: any[], trIndex: number, tdIndex: number) {
        const $Flex = getFlex()
        // eslint-disable-next-line vue/no-mutating-props
        props.item.data.trs[trIndex].tds[tdIndex].list = list.map((item: any) => {
          return $Flex.jsonToForm(item)
        })
        formStore.setFormCurrentId(props.item.data.trs[trIndex].tds[tdIndex].list[e.newIndex].id)
        formStore.setFormCurrentIndex(e.newIndex)
        store.set('curList', props.item.data.trs[trIndex].tds[tdIndex].list)
      },
    }
  },
})
</script>

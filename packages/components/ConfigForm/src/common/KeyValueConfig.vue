<template>
  <div class="starfish-formitem starfish-formitem-action" :class="{ 'formCover': drag, 'starfish-vertical': labelalign != 'top', [item.data.csslist?.join(' ')]: !!item.data.csslist }">
    <div class="label" :class="`label_${labelalign}`" :style="{ width: `${labelWidth}px` }">
      <label>{{ item.data.label }}{{ suffix }}</label>
      <span v-if="item.data.required" class="item_require">*</span>
      <ElTooltip v-if="item.data.tip" class="item" effect="dark" :content="item.data.tip" placement="top">
        <ElIcon class="tip">
          <QuestionFilled />
        </ElIcon>
      </ElTooltip>
    </div>
    <div class="control" :style="{ marginLeft: labelalign != 'top' ? `${labelWidth}px` : '' }">
      <div v-for="(items, index) in data[item.data.fieldName].items" :key="index" class="starfish-keyValueItem">
        <div class="keyValueSelect">
          <ElCheckbox v-model="items.select" @change="getChangeSelect(items)" />
        </div>
        <div class="keyValueInput">
          <div class="inputItem">
            <span>文本：</span>
            <div>
              <ElInput v-model="items.label" size="small" @input="getChangeValue(items)" />
            </div>
          </div>
          <div class="inputItem">
            <span>值：</span>
            <div>
              <ElInput v-model="items.value" size="small" @input="getChangeValue(items)" />
            </div>
          </div>
        </div>
        <div class="keyValueControl">
          <div class="add" @click="addItem(index)">
            <ElIcon><Plus /></ElIcon>
          </div>
          <div class="remove" @click="removeItem(index)">
            <ElIcon><Delete /></ElIcon>
          </div>
          <div class="top" @click="handleTop(index)">
            <ElIcon><ArrowUp /></ElIcon>
          </div>
          <div class="bottom" @click="handleBottom(index)">
            <ElIcon><ArrowDown /></ElIcon>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ArrowDown, ArrowUp, Delete, Plus, QuestionFilled } from '@element-plus/icons-vue'
import {
  ElCheckbox,
  ElIcon,
  ElInput,
  ElTooltip,
} from 'element-plus'
import { defineComponent } from 'vue'
import { getFormConfig } from '../utils/fieldConfig'
import fieldProps from '../utils/fieldProps'

export default defineComponent({
  ControlType: 'KeyValueConfig', // 必须与文件名匹配
  nameCn: '键值对匹配',
  icon: 'icon-danxuankuang',
  isHide: true,
  formConfig: getFormConfig('KeyValueConfig'),
  components: {
    ElCheckbox,
    ElIcon,
    ElInput,
    ElTooltip,
    QuestionFilled,
    Plus,
    Delete,
    ArrowUp,
    ArrowDown,
  },
  props: {
    ...fieldProps,
  },
  setup(props) {
    function getMaxId() {
      let maxId = 0
      const data: any = props.data
      const item: any = props.item
      const allItems = data[item.data.fieldName]
      allItems.items.forEach((item: any) => {
        maxId = Math.max(item.id, maxId)
      })
      return maxId + 1
    }
    return {
      getChangeValue(sitem: any) {
        const data: any = props.data
        const item: any = props.item
        const allItems = data[item.data.fieldName]
        allItems.value = sitem.value
        allItems.id = sitem.id
      },
      getChangeSelect(sitem: any) {
        const data: any = props.data
        const item: any = props.item
        const allItems = data[item.data.fieldName]
        if (sitem.select) {
          allItems.value = sitem.value
          allItems.id = sitem.id
          allItems.items.forEach((item: any) => {
            if (item.id !== sitem.id) {
              item.select = false
            }
          })
        }
        else {
          let isHave = false
          allItems.items.forEach((item: any) => {
            if (item.select) {
              isHave = true
            }
          })
          if (!isHave) {
            allItems.value = ''
            allItems.id = ''
          }
        }
      },
      removeItem(index: number) {
        const data: any = props.data
        const item: any = props.item
        const allItems = data[item.data.fieldName]
        if (allItems.items.length <= 1)
          return
        allItems.items.splice(index, 1)
      },
      handleTop(index: number) {
        if (index > 0) {
          const data: any = props.data
          const item: any = props.item
          const allItem = data[item.data.fieldName].items
          const newItem = allItem.splice(index, 1)[0]
          allItem.splice(index - 1, 0, newItem)
        }
      },
      handleBottom(index: number) {
        const data: any = props.data
        const item: any = props.item
        const allItem = data[item.data.fieldName].items
        if (index < allItem.length - 1) {
          const newItem = allItem.splice(index, 1)[0]
          allItem.splice(index + 1, 0, newItem)
        }
      },
      addItem(index: number) {
        const maxId = getMaxId()
        const data: any = props.data
        const item: any = props.item
        const allItems = data[item.data.fieldName]
        allItems.items.splice(index + 1, 0, {
          label: `选项${maxId}`,
          value: `选项${maxId}`,
          select: false,
          id: maxId,
        })
      },
    }
  },
})
</script>

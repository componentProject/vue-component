<template>
  <div class="starfish-formitem starfish-formitem-nomiddle" :class="{ 'formCover': drag, 'starfish-vertical': labelalign != 'top', [item.data.csslist?.join(' ')]: !!item.data.csslist }">
    <div class="label" :class="`label_${labelalign}`" :style="{ width: `${labelWidth}px` }">
      <label>{{ item.data.label }}{{ suffix }}</label>
    </div>
    <div class="control" :style="{ marginLeft: labelalign != 'top' ? `${labelWidth}px` : '' }">
      <ElRow v-for="(items, index) in data[item.data.fieldName]" :key="index" :gutter="10" style="margin-bottom: 10px;">
        <ElInputNumber v-model="items.span" :min="0" size="small" controls-position="right" />
        <ElButton type="danger" circle size="small" style="margin-left: 5px;" @click="onDelete(index)">
          <ElIcon><Delete /></ElIcon>
        </ElButton>
      </ElRow>
      <ElButton plain size="small" @click="onAdd">
        添加
      </ElButton>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import fieldProps from '../utils/fieldProps'
import { ElButton, ElIcon, ElInputNumber, ElRow } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'

export default defineComponent({
  ControlType: 'ListConfig', // 必须与文件名匹配
  nameCn: '栅格列表配置',
  isHide: true,
  components: {
    ElButton,
    ElIcon,
    ElInputNumber,
    ElRow,
    Delete,
  },
  props: {
    ...fieldProps,
  },
  setup(props: any) {
    return {
      onAdd() {
        // eslint-disable-next-line vue/no-mutating-props
        props.data[props.item.data.fieldName].push({
          span: 12,
          list: [],
        })
      },
      onDelete(index: number) {
        // eslint-disable-next-line vue/no-mutating-props
        props.data[props.item.data.fieldName].splice(index, 1)
      },
    }
  },
})
</script>

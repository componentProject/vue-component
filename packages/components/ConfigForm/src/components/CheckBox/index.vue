<!-- ConfigForm组件主文件 -->
<template>
  <div
    class="starfish-formitem"
    :class="{ 'formCover': drag, 'starfish-vertical': labelalign !== 'top', [item.data.csslist?.join(' ')]: !!item.data.csslist }"
  >
    <div class="label" :class="`label_${labelalign}`" :style="{ width: `${labelWidth}px` }">
      <label>{{ item.data.label }}{{ suffix }}</label>
      <span v-if="item.data.required" class="item_require">*</span>
      <ElTooltip
        v-if="item.data.tip" class="item" effect="dark" :content="item.data.tip"
        placement="top"
      >
        <ElIcon class="tip">
          <QuestionFilled />
        </ElIcon>
      </ElTooltip>
    </div>
    <div class="control" :style="{ marginLeft: labelalign !== 'top' ? `${labelWidth}px` : '' }">
      <ElCheckboxGroup
        v-if="!drag && data[item.data.fieldName]"
        v-model="data[item.data.fieldName]" :size="size"
      >
        <ElCheckbox
          v-for="(sitem, sindex) in item.data.itemConfig.items" :key="sindex"
          :label="sitem.value"
        >
          {{ sitem.label }}
        </ElCheckbox>
      </ElCheckboxGroup>
      <ElCheckboxGroup v-if="drag" v-model="item.data.itemConfig.value" :size="size">
        <ElCheckbox
          v-for="(sitem, sindex) in item.data.itemConfig.items" :key="sindex"
          :label="sitem.value"
        >
          {{ sitem.label }}
        </ElCheckbox>
      </ElCheckboxGroup>
    </div>
  </div>
</template>

<script lang="ts">
import { QuestionFilled } from '@element-plus/icons-vue'
import { ElCheckbox, ElCheckboxGroup, ElIcon, ElTooltip } from 'element-plus'
import { defineComponent } from 'vue'
import { useWatch } from '../../utils/customHooks'
import { getFormConfig } from '../../utils/fieldConfig'
import fieldProps from '../../utils/fieldProps'

export default defineComponent({
  components: {
    ElCheckbox,
    ElCheckboxGroup,
    ElTooltip,
    ElIcon,
    QuestionFilled,
  },
  ControlType: 'CheckBox', // 必须与文件名匹配
  nameCn: '复选框',
  icon: 'icon-fuxuankuang_xuanzhong',
  formConfig: getFormConfig('CheckBox', [{
    fieldName: 'itemConfig',
    component: 'KeyValueConfigMult',
  }]),
  props: {
    ...fieldProps,
  },
  actionType: ['onChange'],
  setup(props) {
    useWatch(props)
  },
})
</script>

<template>
  <div class="starfish-formitem" :class="{ 'formCover': drag, 'starfish-vertical': labelalign != 'top', [item.data.csslist?.join(' ')]: !!item.data.csslist }">
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
      <ElDatePicker v-if="drag" v-model="item.data.default" type="datetime" :placeholder="item.data.placeholder" :size="size" />
      <ElDatePicker v-if="!drag" v-model="data[item.data.fieldName]" type="datetime" :placeholder="item.data.placeholder" :size="size" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { getFormConfig } from '../../utils/fieldConfig'
import fieldProps from '../../utils/fieldProps'
import { useWatch } from '../../utils/customHooks'
import { ElDatePicker, ElIcon, ElTooltip } from 'element-plus'
import { QuestionFilled } from '@element-plus/icons-vue'

export default defineComponent({
  components: {
    ElDatePicker,
    ElTooltip,
    ElIcon,
    QuestionFilled,
  },
  ControlType: 'DateTime', // 必须与文件名匹配
  nameCn: '日期时间选择',
  icon: 'icon-riqishijian',
  formConfig: getFormConfig('DateTime', [
    { fieldName: 'default', component: 'DateTime' },
    { fieldName: 'placeholder', component: 'Text' },
  ]),
  actionType: ['onChange'],
  props: {
    ...fieldProps,
  },
  setup(props) {
    useWatch(props)
  },
})
</script>

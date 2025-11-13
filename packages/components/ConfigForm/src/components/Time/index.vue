<!-- ConfigForm组件主文件 -->
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
      <ElTimePicker v-if="drag" v-model="item.data.default" :size="size" :placeholder="item.data.placeholder" format="HH:mm" value-format="HH:mm" />
      <ElTimePicker v-if="!drag" v-model="data[item.data.fieldName]" :size="size" :placeholder="item.data.placeholder" format="HH:mm" value-format="HH:mm" />
    </div>
  </div>
</template>

<script lang="ts">
import { QuestionFilled } from '@element-plus/icons-vue'
import { ElIcon, ElTimePicker, ElTooltip } from 'element-plus'
import { defineComponent } from 'vue'
import { useWatch } from '../../utils/customHooks'
import { getFormConfig } from '../../utils/fieldConfig'
import fieldProps from '../../utils/fieldProps'

export default defineComponent({
  components: {
    ElTimePicker,
    ElTooltip,
    ElIcon,
    QuestionFilled,
  },
  ControlType: 'Time', // 必须与文件名匹配
  nameCn: '时间选择',
  icon: 'icon-shijian',
  formConfig: getFormConfig('DateTime', [
    { fieldName: 'default', component: 'Time' },
    { fieldName: 'placeholder', component: 'Text' },
  ]),
  props: {
    ...fieldProps,
  },
  setup(props) {
    useWatch(props)
  },
})
</script>

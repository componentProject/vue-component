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
      <ElSlider v-if="drag" v-model="item.data.default" :min="Number(item.data.min)" :max="Number(item.data.max)" :size="size" />
      <ElSlider v-if="!drag" v-model="data[item.data.fieldName]" :min="Number(item.data.min)" :max="Number(item.data.max)" :size="size" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { getFormConfig } from '../../utils/fieldConfig'
import fieldProps from '../../utils/fieldProps'
import { useWatch } from '../../utils/customHooks'
import { ElIcon, ElSlider, ElTooltip } from 'element-plus'
import { QuestionFilled } from '@element-plus/icons-vue'

export default defineComponent({
  components: {
    ElSlider,
    ElTooltip,
    ElIcon,
    QuestionFilled,
  },
  ControlType: 'Slider', // 必须与文件名匹配
  nameCn: '滑块',
  icon: 'icon-icon_huakuai',
  formConfig: getFormConfig('Slider', [
    { fieldName: 'default', component: 'InputNumber' },
    { fieldName: 'min', component: 'Text' },
    { fieldName: 'max', component: 'Text' },
  ]),
  props: {
    ...fieldProps,
  },
  actionType: ['onChange'],
  setup(props) {
    useWatch(props)
  },
})
</script>

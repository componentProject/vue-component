<template>
  <div class="starfish-formitem" :class="drag ? 'formCover' : ''">
    <div class="label">
      <label>{{ item.data.label }}</label>
      <span v-if="item.data.required" class="item_require">*</span>
      <ElTooltip v-if="item.data.tip" class="item" effect="dark" :content="item.data.tip" placement="top">
        <ElIcon class="tip">
          <QuestionFilled />
        </ElIcon>
      </ElTooltip>
    </div>
    <div class="control">
      <ElRadioGroup v-model="data[item.data.fieldName]" size="small">
        <ElRadioButton v-for="(sitem, sindex) in item.data.itemConfig.items" :key="sindex" :label="sitem.value" />
      </ElRadioGroup>
    </div>
  </div>
</template>

<script lang="ts">
import { QuestionFilled } from '@element-plus/icons-vue'
import { ElIcon, ElRadioButton, ElRadioGroup, ElTooltip } from 'element-plus'
import { defineComponent } from 'vue'
import { useWatch } from '../utils/customHooks'
import fieldProps from '../utils/fieldProps'

export default defineComponent({
  ControlType: 'RadioGroup', // 必须与文件名匹配
  isHide: true,
  components: {
    ElIcon,
    ElRadioButton,
    ElRadioGroup,
    ElTooltip,
    QuestionFilled,
  },
  props: {
    ...fieldProps,
  },
  setup(props) {
    useWatch(props)
  },
})
</script>

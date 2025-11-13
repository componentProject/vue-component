<!-- ConfigForm组件主文件 -->
<template>
  <div class="starfish-formitem" :class="{ 'formCover': drag, 'starfish-vertical': labelalign !== 'top', [item.data.csslist?.join(' ')]: !!item.data.csslist }">
    <div class="label" :class="`label_${labelalign}`" :style="{ width: `${labelWidth}px` }">
      <label>{{ item.data.label }}{{ suffix }}</label>
      <span v-if="item.data.required" class="item_require">*</span>
      <ElTooltip v-if="item.data.tip" class="item" effect="dark" :content="item.data.tip" placement="top">
        <ElIcon class="tip">
          <QuestionFilled />
        </ElIcon>
      </ElTooltip>
    </div>
    <div class="control" :style="{ marginLeft: labelalign !== 'top' ? `${labelWidth}px` : '' }">
      <div v-if="drag">
        <ElInput v-model="item.data.default" :placeholder="item.data.placeholder" size="small" style="width: 150px;" />
        <ElColorPicker v-model="item.data.default" show-alpha :size="size" />
      </div>
      <div v-if="!drag">
        <ElInput v-model="data[item.data.fieldName]" :placeholder="item.data.placeholder" size="small" style="width: 150px;" />
        <ElColorPicker v-model="data[item.data.fieldName]" show-alpha :size="size" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { QuestionFilled } from '@element-plus/icons-vue'
import { ElColorPicker, ElIcon, ElInput, ElTooltip } from 'element-plus'
import { defineComponent } from 'vue'
import { useWatch } from '../../utils/customHooks'
import { getFormConfig } from '../../utils/fieldConfig'
import fieldProps from '../../utils/fieldProps'

export default defineComponent({
  components: {
    ElInput,
    ElColorPicker,
    ElTooltip,
    ElIcon,
    QuestionFilled,
  },
  ControlType: 'ColorSelect', // 必须与文件名匹配
  nameCn: '颜色选择',
  icon: 'icon-sen103',
  formConfig: getFormConfig('ColorSelect', [{ fieldName: 'default', component: 'ColorSelect' }]),
  props: {
    ...fieldProps,
  },
  actionType: ['onChange'],
  setup(props) {
    useWatch(props)
  },
})
</script>

<style scoped lang="scss">
  .control {
  width: 240px;
  > div {
    display: flex;
    align-items: center;
  }
}
</style>

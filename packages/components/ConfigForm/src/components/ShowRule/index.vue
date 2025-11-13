<template>
  <div class="starfish-formitem starfish-editor-showrule" :class="{ 'formCover': drag, 'starfish-vertical': labelalign != 'top' }">
    <div class="label" :class="`label_${labelalign}`" :style="{ width: `${labelWidth}px` }">
      <label>{{ item.data.label }}</label>
      <span v-if="item.data.required" class="item_require">*</span>
      <ElTooltip v-if="item.data.tip" class="item" effect="dark" :content="item.data.tip" placement="top">
        <ElIcon class="tip">
          <QuestionFilled />
        </ElIcon>
      </ElTooltip>
    </div>
    <div class="control" :style="{ marginLeft: labelalign != 'top' ? `${labelWidth}px` : '' }">
      <ElButton v-if="data.showRule != '{}'" text type="primary" :size="size">
        已设置
      </ElButton>
      <ElButton v-else text type="primary" :size="size">
        未设置
      </ElButton>
      <div>
        <ElButton type="primary" :size="size" @click="onConditionSet">
          普通设置
        </ElButton>
        <ElButton type="primary" :size="size" @click="onHighConditionSet">
          高级设置
        </ElButton>
        <ConditionSelect ref="ConditionSelect" :data="data" :item="item" @change="dataChange" />
        <HighConditionSelect ref="highSelect" :data="data" :item="item" @change="dataChange" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { QuestionFilled } from '@element-plus/icons-vue'
import { ElButton, ElIcon, ElTooltip } from 'element-plus'
import { defineComponent, ref } from 'vue'
import { useWatch } from '../../utils/customHooks'
import fieldProps from '../../utils/fieldProps'

export default defineComponent({
  components: {
    ElButton,
    ElTooltip,
    ElIcon,
    QuestionFilled,
  },
  ControlType: 'ShowRule', // 必须与文件名匹配
  props: {
    ...fieldProps,
  },
  setup(props) {
    const ConditionSelect = ref()
    const highSelect = ref()
    useWatch(props)
    return {
      ConditionSelect,
      highSelect,
      onConditionSet() {
        ConditionSelect.value?.show()
      },
      onHighConditionSet() {
        highSelect.value?.show()
      },
      dataChange(result: any) {
        (props.data as any)[props.item?.data.fieldName] = result
      },
    }
  },
})
</script>

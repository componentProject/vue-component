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
      <ElRadioGroup v-if="!drag" v-model="data[item.data.fieldName]" :size="size">
        <ElRadio v-for="(sitem, sindex) in item.data.itemConfig.items" :key="sindex" :label="sitem.value">
          {{ sitem.label }}
        </ElRadio>
      </ElRadioGroup>
      <ElRadioGroup v-if="drag" v-model="item.data.itemConfig.value" :size="size">
        <ElRadio v-for="(sitem, sindex) in item.data.itemConfig.items" :key="sindex" :label="sitem.value">
          {{ sitem.label }}
        </ElRadio>
      </ElRadioGroup>
    </div>
  </div>
</template>

<script lang="ts">
import { QuestionFilled } from '@element-plus/icons-vue'
import { ElIcon, ElRadio, ElRadioGroup, ElTooltip } from 'element-plus'
import { defineComponent } from 'vue'
import { useWatch } from '../../utils/customHooks'
import { getFormConfig } from '../../utils/fieldConfig'
import fieldProps from '../../utils/fieldProps'

export default defineComponent({
  components: {
    ElRadio,
    ElRadioGroup,
    ElTooltip,
    ElIcon,
    QuestionFilled,
  },
  ControlType: 'Radio', // 必须与文件名匹配
  nameCn: '单选框',
  icon: 'icon-danxuankuang',
  formConfig: getFormConfig('Radio', [{ fieldName: 'itemConfig', component: 'KeyValueConfig' }]),
  props: {
    ...fieldProps,
  },
  actionType: ['onChange'],
  setup(props) {
    useWatch(props)
  },
})
</script>

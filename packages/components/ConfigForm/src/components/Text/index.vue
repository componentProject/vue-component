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
      <ElInput v-if="drag" v-model="item.data.default" :placeholder="item.data.placeholder" :size="size" clearable />
      <ElInput v-if="!drag" v-model="data[item.data.fieldName]" :placeholder="item.data.placeholder" :size="size" clearable @focus="execFunc('onFocus')" @blur="execFunc('onBlur')" />
    </div>
  </div>
</template>

<script lang="ts">
import type { ComponentInternalInstance } from 'vue'
import { QuestionFilled } from '@element-plus/icons-vue'
import { ElIcon, ElInput, ElTooltip } from 'element-plus'
import { defineComponent, getCurrentInstance } from 'vue'
import { getFlex, useWatch } from '../../utils/customHooks'
import { getFormConfig } from '../../utils/fieldConfig'
import fieldProps from '../../utils/fieldProps'

export default defineComponent({
  components: {
    ElInput,
    ElTooltip,
    ElIcon,
    QuestionFilled,
  },
  ControlType: 'Text', // 必须与文件名匹配
  nameCn: '文本框',
  icon: 'icon-wenbenkuang',
  formConfig: getFormConfig('Text', [
    { fieldName: 'default', component: 'Text' },
    { fieldName: 'placeholder', component: 'Text' },
  ]),
  actionType: ['onChange', 'onFocus', 'onBlur'],
  props: {
    ...fieldProps,
  },
  setup(props) {
    const vm = getCurrentInstance() as ComponentInternalInstance
    useWatch(props)
    return {
      execFunc(type: string) {
        if (props.item.data.action && props.item.data.action[type]) {
          const $Flex = getFlex()
          if ($Flex) {
            $Flex.funcExec(props.item.data.action[type], vm.proxy, [props.item.data.fieldName])
          }
        }
      },
    }
  },
})
</script>

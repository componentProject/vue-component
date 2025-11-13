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
      <ElSelect v-if="drag" v-model="item.data.itemConfig.value" :placeholder="item.data.placeholder" multiple :size="size">
        <ElOption v-for="items in item.data.itemConfig.items" :key="items.value" :label="items.label" :value="items.value" />
      </ElSelect>
      <ElSelect v-if="!drag" v-model="data[item.data.fieldName]" :placeholder="item.data.placeholder" multiple :size="size" @focus="execFunc('onFocus')" @blur="execFunc('onBlur')">
        <ElOption v-for="items in item.data.itemConfig.items" :key="items.value" :label="items.label" :value="items.value" />
      </ElSelect>
    </div>
  </div>
</template>

<script lang="ts">
import type { ComponentInternalInstance } from 'vue'
import { QuestionFilled } from '@element-plus/icons-vue'
import { ElIcon, ElOption, ElSelect, ElTooltip } from 'element-plus'
import { defineComponent, getCurrentInstance } from 'vue'
import { getFlex, useWatch } from '../../utils/customHooks'
import { getFormConfig } from '../../utils/fieldConfig'
import fieldProps from '../../utils/fieldProps'

export default defineComponent({
  components: {
    ElSelect,
    ElOption,
    ElTooltip,
    ElIcon,
    QuestionFilled,
  },
  ControlType: 'Selecteds', // 必须与文件名匹配
  nameCn: '选择器多选',
  icon: 'icon-xuanzeqi',
  formConfig: getFormConfig('Selecteds', [
    { fieldName: 'placeholder', component: 'Text' },
    { fieldName: 'itemConfig', component: 'KeyValueConfigMult' },
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

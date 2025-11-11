<template>
  <div class="starfish-formitem" :class="{ formCover: drag }">
    <div v-if="!item.data.labelShow" class="label">
      <label>{{ item.data.label }}</label>
      <ElTooltip
        v-if="item.data.tip"
        class="item"
        effect="dark"
        :content="item.data.tip"
        placement="top"
      >
        <ElIcon class="tip">
          <QuestionFilled />
        </ElIcon>
      </ElTooltip>
    </div>
    <div class="control">
      <ElAlert
        :title="item.data.title"
        :type="item.data.infotype"
        :effect="item.data.effect"
        :show-icon="item.data.showIcon"
        :closable="item.data.closable"
        :center="item.data.center"
        :description="item.data.desc"
        @close="execFunc('onClose')"
      />
    </div>
  </div>
</template>

<script lang="ts">
import type { ComponentInternalInstance } from 'vue'
import { defineComponent, getCurrentInstance } from 'vue'
import { getFormConfig } from '../utils/fieldConfig'
import fieldProps from '../utils/fieldProps'
import { getFlex, useWatch } from '../utils/customHooks'
import { ElAlert, ElIcon, ElTooltip } from 'element-plus'
import { QuestionFilled } from '@element-plus/icons-vue'

export default defineComponent({
  components: {
    ElTooltip,
    ElAlert,
    ElIcon,
    QuestionFilled,
  },
  ControlType: 'Info', // 必须与文件名匹配
  nameCn: '提示',
  icon: 'icon-jinggao',
  layout: true,
  formConfig: getFormConfig(
    'Info',
    [
      { fieldName: 'title', component: 'Text', label: '标题' },
      { fieldName: 'desc', component: 'Text', label: '文字描述' },
      { fieldName: 'labelShow', component: 'Switch', label: '标签隐藏' },
      { fieldName: 'center', component: 'Switch', label: '文字是否居中' },
      { fieldName: 'closable', component: 'Switch', label: '是否可关闭' },
      { fieldName: 'showIcon', component: 'Switch', label: '是否显示类型图标' },
      { fieldName: 'effect', component: 'Selected' },
      { fieldName: 'infotype', component: 'Selected' },
    ],
    ['required', 'tip', 'rule'],
  ),
  actionType: ['onClose'],
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

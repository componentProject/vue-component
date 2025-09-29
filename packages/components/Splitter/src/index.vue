<template>
  <ElSplitter v-bind="$attrs">
    <template v-for="(slotName, index) in slotNames" :key="slotName">
      <slot v-if="slotName === 'default'" name="default" />
      <ElSplitterPanel
        v-else
        :size="getPanelProp(slotName, 'size')"
        :min="getPanelProp(slotName, 'min')"
        :max="getPanelProp(slotName, 'max')"
        :resizable="getPanelProp(slotName, 'resizable', true)"
        :collapsible="getPanelProp(slotName, 'collapsible', false)"
      >
        <div class="bg-white w-full h-full">
          <slot :name="getPanelProp(index, 'slot', slotName)" />
        </div>
      </ElSplitterPanel>
    </template>
  </ElSplitter>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElSplitter, ElSplitterPanel } from 'element-plus'
import type { slotsType } from '@moluoxixi/components/_types'

// 面板配置接口
interface PanelConfig {
  slot?: string
  size?: string | number
  min?: string | number
  max?: string | number
  resizable?: boolean
  collapsible?: boolean
}

// 定义组件选项
defineOptions({
  name: 'Splitter',
  inheritAttrs: false,
})

// 定义属性和事件
const props = withDefaults(defineProps<{
  panels?: PanelConfig[]
  splitWidth?: number
}>(), {
  layout: 'horizontal',
  splitWidth: 8,
  panels: () => [],
})

// 获取可用的插槽名称
const slots = defineSlots<slotsType>()

// 获取插槽名称
const slotNames = computed<string[]>(() => Object.keys(slots) as string[])
// 获取指定面板的属性值
function getPanelProp<T>(slotName: string | number | undefined, prop: keyof PanelConfig, defaultValue?: T): T | undefined {
  const item = props.panels.find(item => item.slot === slotName)
  if (item) {
    return item[prop] as unknown as T
  }
  return defaultValue
}
</script>

<style scoped lang="scss">
@forward '@moluoxixi/components/_assets/styles/main.scss';
/* 自定义分割条样式 */
:deep(.el-splitter-bar) {
  .el-splitter-bar__dragger-horizontal {
    z-index: 2;

    &::before {
      width: v-bind('`${props.splitWidth}px`');
      background-color: #f1f2f4;
    }
  }

  .el-splitter-bar__dragger-vertical {
    z-index: 1;

    &::before {
      height: v-bind('`${props.splitWidth}px`');
      background-color: #f1f2f4;
    }
  }
}
</style>

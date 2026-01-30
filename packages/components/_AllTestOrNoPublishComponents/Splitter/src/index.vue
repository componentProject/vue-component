<!-- Splitter组件主文件 -->
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
          <slot :name="getPanelProp(index, 'slot', slotName) as string" />
        </div>
      </ElSplitterPanel>
    </template>
  </ElSplitter>
</template>

<script setup lang="ts">
import type { slotsType } from '@moluoxixi/components/types'
import type { propsType } from './types'
import { ElSplitter, ElSplitterPanel } from 'element-plus'
import { computed } from 'vue'

/**
 * 面板配置接口
 */
interface PanelConfig {
  slot?: string
  size?: string | number
  min?: string | number
  max?: string | number
  resizable?: boolean
  collapsible?: boolean
}

defineOptions({
  name: 'Splitter',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<propsType>(), {
  direction: 'horizontal',
  splitWidth: 8,
  panels: () => [],
})

// const emit = defineEmits<emitsType>()

const slots = defineSlots<slotsType>()

/**
 * 获取插槽名称列表
 */
const slotNames = computed<string[]>(() => Object.keys(slots) as string[])

/**
 * 获取指定面板的属性值
 * @param slotName - 插槽名称或索引
 * @param prop - 属性名
 * @param defaultValue - 默认值
 * @returns 属性值
 */
function getPanelProp<T>(slotName: string | number | undefined, prop: keyof PanelConfig, defaultValue?: T): T | undefined {
  const item = props.panels.find(item => item.slot === slotName)
  if (item) {
    return item[prop] as unknown as T
  }
  return defaultValue
}
</script>

<style scoped lang="scss">
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

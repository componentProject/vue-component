<!-- TsCheckbox组件主文件 -->
<template>
  <ElCheckboxGroup
    :id="checkboxId"
    v-model="data"
    :style="computedStyle"
    v-bind="$attrs"
    @change="handleCheckboxChange"
  >
    <ElCheckbox
      v-for="item in serverOrLocalOptions"
      :key="item[computedValue]"
      :label="item[computedValue]"
      :disabled="
        computedDisabledHandler({
          label: item[computedLabel],
          value: item[computedValue],
          data: item,
        })
      "
      v-bind="props.checkboxProps"
    >
      {{ item[computedLabel] }}
    </ElCheckbox>
  </ElCheckboxGroup>
</template>

<script setup lang="ts">
import type { emitsType, propsType, slotsType } from './_types'
import { ElCheckbox, ElCheckboxGroup } from 'element-plus'
import { computed } from 'vue'
import { useOptions } from '../../_hooks'

defineOptions({
  name: 'TsCheckbox',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<propsType>(), {
  layout: 'flex',
  xGap: 16,
  gridColumns: 4,
  label: 'label',
  value: 'value',
  disabledHandler: null,
  disabledValues: () => [],
  disabledLabels: () => [],
  options: () => [],
  requestMethod: 'POST',
  requestUrl: '',
  requestParams: () => ({}),
  requestParamsType: 'body',
  requestHeaders: () => ({}),
  responseDataPath: '',
  checkboxProps: () => ({}),
})

const emits = defineEmits<emitsType>()

// 获取插槽
const slots = defineSlots<slotsType>()

const computedLabel = computed(() => props.labelKey || props.label)
const computedValue = computed(() => props.valueKey || props.value)

const computedStyle = computed(() => {
  const baseStyle = {
    'column-gap': `${props.xGap}px`,
  }
  if (props.layout === 'grid') {
    return {
      ...baseStyle,
      'display': 'grid',
      'grid-template-columns': `repeat(${props.gridColumns}, minmax(max-content, 1fr))`,
    }
  }
  else {
    return {
      ...baseStyle,
      'display': 'flex',
      'flex-wrap': 'wrap',
    }
  }
})

const checkboxId = `checkbox-${Math.random().toString(36).substr(2, 9)}`
const data = defineModel<any[]>()

// 使用 useOptions hook 来处理 options 获取逻辑
const { options: serverOrLocalOptions } = useOptions(props)

// 直接使用 serverOrLocalOptions

/**
 * 默认禁用处理函数
 * @param label - 标签文本
 * @param value - 标签值
 * @returns 是否禁用
 */
function defaultDisabledHandler({ label, value }: { [label: string]: any }) {
  return props.disabledValues.includes(value) || props.disabledLabels.includes(label)
}

/**
 * 处理复选框变化事件
 * @param value - 选中的值数组
 */
function handleCheckboxChange(value: any) {
  emits('change', value)
}

/**
 * 计算禁用处理函数
 */
const computedDisabledHandler = computed(() => {
  return props.disabledHandler || defaultDisabledHandler
})
</script>

<style lang="scss" scoped>
</style>

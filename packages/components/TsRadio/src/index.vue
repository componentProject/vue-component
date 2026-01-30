<!-- TsRadio组件主文件 -->
<template>
  <ElRadioGroup
    :id="radioId"
    v-model="data"
    :style="computedStyle"
    v-bind="$attrs"
    @change="handleRadioChange"
  >
    <ElRadio
      v-for="(item) in serverOrLocalOptions"
      :key="item[computedValue]"
      :style="{
        'margin-right': '16px',
      }"
      :label="item[computedValue]"
      :disabled="
        computedDisabledHandler({
          label: item[computedLabel],
          value: item[computedValue],
          data: item,
        })
      "
      v-bind="props.radioProps"
    >
      {{ item[computedLabel] }}
    </ElRadio>
  </ElRadioGroup>
</template>

<script setup lang="ts">
import type { emitsType, propsType, slotsType } from './types'
import { ElRadio, ElRadioGroup } from 'element-plus'
import { computed } from 'vue'
import { useOptions } from '../../_hooks'

defineOptions({
  name: 'TsRadio',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<propsType>(), {
  layout: 'flex',
  xGap: 16,
  gridColumns: 4,
  label: 'label',
  value: 'value',
  disabledHandler: undefined,
  disabledValues: () => [],
  disabledLabels: () => [],
  options: () => [],
  requestMethod: 'POST',
  requestUrl: '',
  requestParams: () => ({}),
  requestParamsType: 'body',
  requestHeaders: () => ({}),
  responseDataPath: '',
  radioProps: () => ({}),
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
const radioId = `radio-${Math.random().toString(36).substr(2, 9)}`

const data = defineModel<any>()

// 使用 useOptions hook 来处理 options 获取逻辑
const { options: serverOrLocalOptions } = useOptions(props)

/**
 * 默认禁用处理函数
 * @param params
 * @param params.label - 标签文本
 * @param params.value - 标签值
 */
function defaultDisabledHandler({ label, value }: { label: any, value: any }) {
  return props.disabledValues.includes(value) || props.disabledLabels.includes(label)
}

/**
 * 处理单选框变化事件
 * @param value - 选中的值
 */
function handleRadioChange(value: any) {
  emits('change', value)
}

/**
 * 计算禁用处理函数
 */
const computedDisabledHandler = computed(() => {
  return props.disabledHandler || defaultDisabledHandler
})
</script>

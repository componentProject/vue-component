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
      :key="item[props.value]"
      :style="{
        'margin-right': '16px',
      }"
      :label="item[props.value]"
      :disabled="
        computedDisabledHandler({
          label: item[props.label],
          value: item[props.value],
          data: item,
        })
      "
      v-bind="props.radioProps"
    >
      {{ item[props.label] }}
    </ElRadio>
  </ElRadioGroup>
</template>

<script setup lang="ts">
import { computed, withDefaults } from 'vue'
import { ElRadio, ElRadioGroup } from 'element-plus'
import { getTypeDefault } from '@moluoxixi/utils/_utils'
import { useOptions } from '../../_hooks'
import type { emitsType, propsType } from './_types'

defineOptions({
  name: 'TsRadio',
})

const props = withDefaults(defineProps<propsType>(), {
  layout: 'flex',
  xGap: 16,
  gridColumns: 4,
  label: 'label',
  value: 'value',
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
const { options: serverOrLocalOptions } = useOptions({
  options: props.options,
  requestUrl: props.requestUrl,
  requestParams: props.requestParams,
  requestMethod: props.requestMethod,
  requestParamsType: props.requestParamsType,
  requestHeaders: props.requestHeaders,
  responseDataPath: props.responseDataPath,
})

function defaultDisabledHandler({ label, value }: { [label: string]: any }) {
  return props.disabledValues.includes(value) || props.disabledLabels.includes(label)
}

function handleRadioChange(value: any) {
  emits('change', value)
}

const computedDisabledHandler = computed(() => {
  return getTypeDefault(props.disabledHandler, 'function') || defaultDisabledHandler
})
</script>

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
import { computed } from 'vue'
import { ElCheckbox, ElCheckboxGroup } from 'element-plus'
import { useOptions } from '../../_hooks'
import type { emitsType, propsType, slotsType } from './_types'

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

function defaultDisabledHandler({ label, value }: { [label: string]: any }) {
  console.log('aaaaaaaa', props.disabledValues.includes(value), props.disabledLabels.includes(label))
  return props.disabledValues.includes(value) || props.disabledLabels.includes(label)
}

function handleCheckboxChange(value: any) {
  emits('change', value)
}

const computedDisabledHandler = computed(() => {
  return props.disabledHandler || defaultDisabledHandler
})
</script>

<style lang="scss" scoped>
</style>

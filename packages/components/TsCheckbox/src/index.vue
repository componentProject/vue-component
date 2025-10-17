<template>
  <ElCheckboxGroup
    :id="checkboxId"
    v-model="data"
    class="flex flex-wrap"
    v-bind="$attrs"
    @change="handleCheckboxChange"
  >
    <ElCheckbox
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
      v-bind="props.checkboxProps"
    >
      {{ item[props.label] }}
    </ElCheckbox>
  </ElCheckboxGroup>
</template>

<script setup lang="ts">
import { computed, withDefaults } from 'vue'
import { ElCheckbox, ElCheckboxGroup } from 'element-plus'
import { getTypeDefault } from '@moluoxixi/utils/_utils'
import { useOptions } from '../../_hooks'
import type { TsCheckboxEmits, TsCheckboxProps } from './_types'

defineOptions({
  name: 'TsCheckbox',
})

const props = withDefaults(defineProps<TsCheckboxProps>(), {
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
  checkboxProps: () => ({}),
})

const emits = defineEmits<TsCheckboxEmits>()

const checkboxId = `checkbox-${Math.random().toString(36).substr(2, 9)}`

const data = defineModel<any[]>()

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

// 直接使用 serverOrLocalOptions

function defaultDisabledHandler({ label, value }: { [label: string]: any }) {
  return props.disabledValues.includes(value) || props.disabledLabels.includes(label)
}

function handleCheckboxChange(value: any) {
  emits('change', value)
}

const computedDisabledHandler = computed(() => {
  return getTypeDefault(props.disabledHandler, 'function') || defaultDisabledHandler
})
</script>

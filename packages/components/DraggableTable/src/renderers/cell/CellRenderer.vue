<template>
  <div>
    <DateRangePicker
      v-if="dateType && DateRender"
      :format="valueFormat"
      :value-format="valueFormat"
      :type="dateType"
      v-bind="renderOptsProps"
      :model-value="currRow[currColumn.field]"
      @update:model-value="(val: string[]) => (currRow[currColumn.field] = val[0])"
    />
    <TsSelect
      v-else-if="renderOptsPropsType === 'select' && propsOptions && SelectRender"
      v-bind="renderOptsProps"
      v-model="currRow[currColumn.field]"
      class="w-full!"
      filterable
      automatic-dropdown
      :options="propsOptions"
    />
    <ElInput
      v-else-if="renderOptsPropsType === 'input' && InputRender"
      v-bind="renderOptsProps"
      v-model="inputValue"
      @blur="() => (currRow[currColumn.field] = inputValue)"
    />
    <ElSwitch
      v-else-if="renderOptsPropsType === 'switch' && SwitchRender"
      v-bind="renderOptsProps"
      v-model="currRow[currColumn.field]"
    />
    <ElProgress
      v-else-if="renderOptsPropsType === 'progress' && ProgressRender"
      v-bind="renderOptsProps"
      v-model="currRow[currColumn.field]"
    />
    <template v-else-if="renderOptsPropsType === 'tag' && TagRender">
      <ElTag
        v-for="item in propsOptions"
        v-if="propsOptions"
        :key="item.value"
        class="mr-8!"
        v-bind="item"
      >
        {{ item.label }}
      </ElTag>
      <ElTag
        v-else
        v-bind="renderOptsProps"
      >
        {{ currRow[currColumn.field] }}
      </ElTag>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { VxeTableDefines } from 'vxe-table'
import type { objType } from '@moluoxixi/components/_types'
import type { customCustomTypes } from '../../_types'
import type { cellRendererPropsType } from './_types'
import { ElInput, ElProgress, ElSwitch, ElTag } from 'element-plus'
import { computed, onMounted, ref, watch } from 'vue'
import { detectDateFormatByReplace } from '@moluoxixi/utils/_utils'

// 导入组件
import DateRangePicker from '@moluoxixi/components/DateRangePicker'
import TsSelect from '@moluoxixi/components/TsSelect'

const props = defineProps<cellRendererPropsType>()

const renderOptsProps = computed<objType>(() => props.renderOpts?.props || {})

const renderOptsPropsType = computed<customCustomTypes>(() => props.renderOpts?.props?.type)

const currColumn = ref<VxeTableDefines.ColumnInfo | objType>({})
const currRow = ref<objType>({})

function load() {
  const { renderParams } = props
  if (!renderParams)
    return
  const { row, column } = renderParams
  currRow.value = row
  currColumn.value = column
}

watch(() => [props.renderParams, props.renderOpts], load, {
  immediate: true,
})

const currentValue = computed<any>(() => {
  if (!currColumn.value || !currRow.value)
    return
  return currRow.value[currColumn.value.field]
})

const propsOptions = computed(() => renderOptsProps.value.options)
const valueFormat = computed(() => detectDateFormatByReplace(currentValue.value))

// 判断是否为日期类型
const dateType = computed(() => {
  return renderOptsPropsType.value === 'date' || renderOptsPropsType.value === 'datetime'
    ? renderOptsPropsType.value
    : ''
})

const DateRender = computed(() => {
  return dateType.value && currRow.value && currColumn.value
})

const SelectRender = computed(() => {
  return renderOptsPropsType.value === 'select' && propsOptions.value && currRow.value && currColumn.value
})

const inputValue = ref('')
onMounted(() => (inputValue.value = currRow.value[currColumn.value.field]))

const InputRender = computed(() => {
  return renderOptsPropsType.value === 'input' && currRow.value && currColumn.value
})

const SwitchRender = computed(() => {
  return renderOptsPropsType.value === 'switch' && currRow.value && currColumn.value
})

const ProgressRender = computed(() => {
  return renderOptsPropsType.value === 'progress' && currRow.value && currColumn.value
})

const TagRender = computed(() => {
  return renderOptsPropsType.value === 'tag' && currRow.value && currColumn.value
})
</script>

<style scoped lang="scss">
@forward '@moluoxixi/components/_assets/styles/tailwind.scss';
</style>

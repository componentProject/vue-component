<template>
  <div class="h-full flex items-center" style="align-items: center">
    <DateRangePicker
      v-if="isDateType && DateRender"
      :format="valueFormat"
      :value-format="valueFormat"
      size="small"
      :type="computedType"
      v-bind="renderOptsProps"
      :model-value="currRow[currColumn.field]"
      @update:model-value="(val: string[]) => {
        currRow[currColumn.field] = val[0]
        validateHandle()
      }"
    />
    <TsSelect
      v-else-if="propsOptions && SelectRender"
      class="w-full!"
      size="small"
      :options="propsOptions"
      v-bind="renderOptsProps"
      :teleported="false"
      filterable
      automatic-dropdown
      :model-value="currRow[currColumn.field]"
      @update:model-value="(val: any) => {
        currRow[currColumn.field] = val
        validateHandle()
      }"
    />
    <ElInput
      v-else-if="DefaultRender"
      size="small"
      v-bind="renderOptsProps"
      :model-value="currRow[currColumn.field]"
      @input="validateHandle"
      @update:model-value="(val: any) => {
        currRow[currColumn.field] = val
        validateHandle()
      }"
    />
  </div>
</template>

<script setup lang="ts">
import type { VxeTableDefines } from 'vxe-table'
import type { objType } from '@moluoxixi/components/_types'
import type { editRendererPropsType } from './_types'
import { ElInput } from 'element-plus'
import { computed, ref, watch } from 'vue'
import { detectDateFormatByReplace, getMomentIsValidIsNoNum } from '@moluoxixi/utils/_utils/date'

const props = defineProps<editRendererPropsType>()

const renderOptsProps = computed<objType>(() => props.renderOpts?.props || {})

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

function clearEdit() {
  const xTable = props.renderParams?.$grid
  if (xTable) {
    xTable.clearEdit()
  }
}

function validateHandle() {
  const xTable = props.renderParams?.$grid
  if (xTable) {
    xTable.validateField(currRow.value, currColumn.value.field).then()
  }
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
const computedType = computed(() => {
  if (valueFormat.value.includes('H')) {
    return 'datetime'
  }
  else {
    return 'date'
  }
})
// 判断是否为日期类型
const isDateType = computed(() => getMomentIsValidIsNoNum(currentValue.value))

const DateRender = computed(() => {
  return isDateType.value && currRow.value && currColumn.value
})

const SelectRender = computed(() => {
  return propsOptions.value && currRow.value && currColumn.value
})

const DefaultRender = computed(() => {
  return currRow.value && currColumn.value
})
</script>

<style scoped lang="scss">
@forward '@moluoxixi/components/_assets/styles/tailwind.scss';
</style>

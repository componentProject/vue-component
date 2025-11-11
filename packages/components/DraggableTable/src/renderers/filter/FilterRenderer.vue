<template>
  <div
    v-if="currOption"
    class="p-8 select-none flex-1-hidden flex flex-col"
  >
    <div class="flex flex-col flex-1-hidden">
      <div
        v-for="item in filterLayout"
        :key="item"
        class="py-4"
      >
        <!-- 搜索输入框 -->
        <div
          v-if="item === 'input'"
          class="py-4"
        >
          <ElInput
            v-if="currOption"
            v-model="currOption.data.sVal"
            placeholder="搜索"
            clearable
            @change="searchEvent"
          />
          <ElInput
            v-else
            disabled
            placeholder="搜索"
            clearable
          />
        </div>

        <!-- 复选框列表 -->
        <div
          v-if="item === 'checkbox'"
          class="px-8 flex-1-auto"
        >
          <div
            v-if="columnValList.length"
            class="flex flex-col"
          >
            <ElCheckbox
              v-model="isCheckedAll"
              @change="changeAllEvent"
            >
              全选
            </ElCheckbox>
            <ElCheckbox
              v-for="_item in columnValList"
              :key="_item.value"
              v-model="_item.checked"
            >
              {{ _item.formattedValue || _item.value }}
            </ElCheckbox>
          </div>
          <div
            v-else
            class="text-center py-5"
          >
            无匹配项
          </div>
        </div>
      </div>
    </div>
    <div class="flex justify-center py-8">
      <ElButton @click="resetFilterEvent">
        <span>重置</span>
      </ElButton>
      <ElButton
        type="primary"
        @click="confirmFilterEvent"
      >
        <span>确认</span>
      </ElButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { VxeTableDefines } from 'vxe-table'
import type { objType } from '@moluoxixi/components/_types'
import type { filterRendererPropsType } from './_types'
import { ElButton, ElCheckbox, ElInput } from 'element-plus'
import { groupBy } from 'lodash'
import { computed, ref, watch } from 'vue'
import { getTypeDefault } from '@moluoxixi/utils/_utils'

interface ColValItem {
  checked: boolean
  value: string
  formattedValue?: string
}

const props = defineProps<filterRendererPropsType>()

const renderOptsProps = computed<objType>(() => props.renderOpts?.props || {})

// 获取格式化函数
const formatter = computed(() => {
  const format = renderOptsProps.value.filterFormatter
  return typeof format === 'function' ? format : (obj: any) => obj.value
})

// 格式化显示值
function getFormattedValue(obj: any) {
  try {
    return formatter.value(obj)
  }
  catch (error) {
    console.warn('Filter format function error:', error)
    return obj.value
  }
}

const currOption = ref<VxeTableDefines.FilterOption>()
const isCheckedAll = ref(false)
const allValList = ref<ColValItem[]>([])
const columnValList = ref<ColValItem[]>([])

const checkList = computed(() => {
  return columnValList.value.filter(item => item.checked).map(item => item.value)
})

watch(
  () => checkList.value,
  (newVal) => {
    if (newVal.length === allValList.value.length && newVal.length)
      isCheckedAll.value = true
  },
)

function load() {
  const { renderParams } = props
  if (!renderParams)
    return
  const { $table, column } = renderParams
  const { fullData, tableData } = $table.getTableData()
  const option = column.filters[0]
  if (!option)
    return

  const { vals } = option.data
  const noValueField = ['null', 'undefined', '']
  const dataToProcess = renderOptsProps.value.filterType === 'full' ? fullData : tableData

  // 处理数据并格式化显示值
  const colValList = Object.keys(
    groupBy(dataToProcess, column.field),
  )
    .filter((val: any) => !noValueField.includes(val))
    .map(val => ({
      checked: vals.includes(val),
      value: val,
      formattedValue: getFormattedValue({ value: val, column }),
    }))

  currOption.value = option
  allValList.value = colValList
  columnValList.value = colValList
}

function searchEvent() {
  const option = currOption.value
  if (!option)
    return

  columnValList.value = option.data.sVal
    ? allValList.value.filter((item: any) => {
        // 同时在原始值和格式化值中搜索
        const searchVal = option.data.sVal.toString().toLowerCase()
        return item.value.toString().toLowerCase().includes(searchVal)
          || item.formattedValue?.toString().toLowerCase().includes(searchVal)
      })
    : allValList.value
}

function changeAllEvent() {
  columnValList.value.forEach((item: any) => {
    item.checked = isCheckedAll.value
  })
}

async function confirmFilterEvent() {
  const { renderParams } = props
  const option = currOption.value
  if (!renderParams || !option)
    return

  const { data } = option
  const { $table } = renderParams
  data.vals = columnValList.value.filter((item: any) => item.checked).map((item: any) => item.value)

  if (data.vals.length === 0) {
    await $table.resetFilterPanel()
  }
  else {
    await $table.updateFilterOptionStatus(option, true)
    await $table.saveFilterPanel()
  }
}

async function resetFilterEvent() {
  const { renderParams } = props
  if (renderParams) {
    const { $table } = renderParams
    await $table.resetFilterPanel()
  }
}

const filterLayout = computed(() => {
  return getTypeDefault(renderOptsProps.value.filterLayout, 'array')
})

watch(() => [props.renderParams, props.renderOpts], load, {
  immediate: true,
})
</script>

<style scoped lang="scss">

</style>

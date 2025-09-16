import type { VxeGlobalRendererHandles, VxeTableDefines } from 'vxe-table'
import type { objType } from '@moluoxixi/components/_types'
import { ElButton, ElCheckbox, ElInput } from 'element-plus'
import { groupBy } from 'lodash'
import type { PropType } from 'vue'
import { computed, defineComponent, ref, watch } from 'vue'
import { getTypeDefault } from '@moluoxixi/utils/_utils'

interface ColValItem {
  checked: boolean
  value: string
  formattedValue?: string
}

export default defineComponent({
  name: 'FilterRenderer',
  props: {
    renderParams: Object as PropType<VxeGlobalRendererHandles.RenderTableFilterParams>,
    renderOpts: Object as PropType<VxeGlobalRendererHandles.RenderTableFilterOptions>,
  },
  setup(props: {
    renderParams?: VxeGlobalRendererHandles.RenderTableFilterParams
    renderOpts?: VxeGlobalRendererHandles.RenderTableFilterOptions
  }) {
    const renderOptsProps = computed<objType>(() => props.renderOpts?.props || {})

    // 获取格式化函数
    const formatter = computed(() => {
      const format = renderOptsProps.value.filterFormatter
      return typeof format === 'function' ? format : (obj: any) => obj.value
    })

    // 格式化显示值
    const getFormattedValue = (obj: any) => {
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

    watch(() => [props.renderParams, props.renderOpts], load, {
      immediate: true,
    })

    const inputRender = computed(() => {
      return [
        <div class="py-4">
          {currOption.value
            ? (
                <ElInput
                  v-model={currOption.value.data.sVal}
                  placeholder="搜索"
                  clearable
                  onChange={searchEvent}
                />
              )
            : (
                <ElInput disabled placeholder="搜索" clearable />
              )}
        </div>,
      ]
    })
    const checkboxRender = computed(() => [
      <div class="px-8 flex-1-auto">
        {columnValList.value.length
          ? (
              <>
                <div class="flex flex-col">
                  <ElCheckbox v-model={isCheckedAll.value} onChange={changeAllEvent}>
                    全选
                  </ElCheckbox>
                  {columnValList.value.map(item => (
                    <ElCheckbox v-model={item.checked}>
                      {item.formattedValue || item.value}
                    </ElCheckbox>
                  ))}
                </div>
              </>
            )
          : (
              <div class="text-center py-5">无匹配项</div>
            )}
      </div>,
    ])
    const filterLayoutRender = computed(() => {
      return getTypeDefault(renderOptsProps.value.filterLayout, 'array')
        .map((item: string) => {
          switch (item) {
            case 'input':
              return inputRender.value
            case 'checkbox':
              return checkboxRender.value
            default:
              return null
          }
        })
        .filter(Boolean)
    })
    return () =>
      currOption.value && (
        <div
          class="p-8 select-none flex-1-hidden flex flex-col">
          <div class="flex flex-col flex-1-hidden">
            {filterLayoutRender.value}
          </div>
          <div class="flex justify-center py-8">
            <ElButton onClick={resetFilterEvent}>
              <span>重置</span>
            </ElButton>
            <ElButton type="primary" onClick={confirmFilterEvent}>
              <span>确认</span>
            </ElButton>
          </div>
        </div>
      )
  },
})

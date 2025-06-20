import { watch, ref, computed, defineComponent } from 'vue'
import { ElInput, ElCheckbox, ElButton } from 'element-plus'
import type { VxeGlobalRendererHandles, VxeTableDefines } from 'vxe-table'
import { groupBy } from 'lodash'
import { getTypeDefault } from '@/components/_utils'

interface ColValItem {
  checked: boolean
  value: string
}

export default defineComponent({
  name: 'CustomFilter',
  props: {
    renderParams: Object as PropType<VxeGlobalRendererHandles.RenderTableFilterParams>,
    renderOpts: Object as PropType<VxeGlobalRendererHandles.RenderTableFilterOptions>,
  },
  setup(props: {
    renderParams?: VxeGlobalRendererHandles.RenderTableFilterParams
    renderOpts?: VxeGlobalRendererHandles.RenderTableFilterOptions
  }) {
    const currOption = ref<VxeTableDefines.FilterOption>()
    const isCheckedAll = ref(false)
    const allValList = ref<ColValItem[]>([])
    const columnValList = ref<ColValItem[]>([])

    const checkList = computed(() => {
      return columnValList.value.filter((item) => item.checked).map((item) => item.value)
    })
    watch(
      () => checkList.value,
      (newVal) => {
        if (newVal.length === allValList.value.length && newVal.length) isCheckedAll.value = true
      },
    )

    function load() {
      const { renderParams } = props
      if (renderParams) {
        const { $table, column } = renderParams
        const { fullData, tableData } = $table.getTableData()
        const option = column.filters[0]
        const { vals } = option.data
        const colValList = Object.keys(
          groupBy(
            props.renderOpts?.props?.filterType === 'full' ? fullData : tableData,
            column.field,
          ),
        ).map((val) => {
          return {
            checked: vals.includes(val),
            value: val,
          }
        })
        currOption.value = option
        allValList.value = colValList
        columnValList.value = colValList
      }
    }

    function searchEvent() {
      const option = currOption.value
      if (option) {
        columnValList.value = option.data.sVal
          ? allValList.value.filter((item) => {
              return item.value
                .toString()
                .toLowerCase()
                .includes(option.data.sVal.toString().toLowerCase())
            })
          : allValList.value
      }
    }

    function changeAllEvent() {
      columnValList.value.forEach((item) => {
        item.checked = isCheckedAll.value
      })
    }

    async function confirmFilterEvent() {
      const { renderParams } = props
      const option = currOption.value
      if (renderParams && option) {
        const { data } = option
        const { $table } = renderParams
        data.vals = columnValList.value.filter((item) => item.checked).map((item) => item.value)
        if (data.vals.length === 0) {
          await $table.resetFilterPanel()
        } else {
          console.log('data.vals', data.vals)
          await $table.updateFilterOptionStatus(option, true)
          await $table.saveFilterPanel()
        }
      }
    }

    async function resetFilterEvent() {
      const { renderParams } = props
      if (renderParams) {
        const { $table } = renderParams
        await $table.resetFilterPanel()
      }
    }

    watch(
      () => [props.renderParams, props.renderOpts],
      () => {
        load()
      },
      {
        immediate: true,
      },
    )

    const inputRender = computed(() => {
      return [
        <div class="py-4">
          {currOption.value ? (
            <ElInput
              v-model={currOption.value.data.sVal}
              placeholder="搜索"
              clearable
              onChange={searchEvent}
            />
          ) : (
            <ElInput disabled placeholder="搜索" clearable />
          )}
        </div>,
      ]
    })
    const checkboxRender = computed(() => {
      return [
        <div class="px-8">
          {columnValList.value.length ? (
            <>
              <ul class="m-0 p-0 list-none">
                <li class="block">
                  <ElCheckbox v-model={isCheckedAll.value} onChange={changeAllEvent}>
                    全选
                  </ElCheckbox>
                </li>
              </ul>
              <ul class="m-0 p-0 list-none">
                {...columnValList.value.map((item) => (
                  <li class="block">
                    <ElCheckbox v-model={item.checked}>{item.value}</ElCheckbox>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div class="text-center py-5">无匹配项</div>
          )}
        </div>,
      ]
    })
    const filterLayoutRender = computed(() => {
      return getTypeDefault(props.renderOpts?.props?.filterLayout, 'array')
        .map((item: string) => {
          switch (item) {
            case 'input':
              return inputRender.value
            case 'checkbox':
              return checkboxRender.value
            case 'select':
              break
            default:
              break
          }
        })
        .filter(Boolean)
    })
    return () =>
      currOption.value && (
        <div class="p-8 select-none">
          <div>{filterLayoutRender.value}</div>
          <div class="flex justify-center">
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

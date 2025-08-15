import type { PropType } from 'vue'
import type { VxeGlobalRendererHandles, VxeTableDefines } from 'vxe-table'
import type { objType } from '@moluoxixi/components/_types'
import { ElInput } from 'element-plus'
import { computed, defineComponent, ref, watch } from 'vue'
import { detectDateFormatByReplace, getMomentIsValidIsNoNum } from '@moluoxixi/components/_utils'
import DateRangePicker from '@moluoxixi/components/DateRangePicker/index.ts'
import Select from '@moluoxixi/components/Select/index.ts'

export default defineComponent({
  name: 'EditRenderer',
  props: {
    renderParams: Object as PropType<VxeGlobalRendererHandles.RenderTableEditParams>,
    renderOpts: Object as PropType<VxeGlobalRendererHandles.RenderTableEditOptions>,
  },
  setup(props: {
    renderParams?: VxeGlobalRendererHandles.RenderTableEditParams
    renderOpts?: VxeGlobalRendererHandles.RenderTableEditOptions
  }) {
    const renderOptsProps = computed<objType>(() => props.renderOpts?.props || {})

    const currColumn = ref<VxeTableDefines.ColumnInfo | objType>({})
    const currRow = ref<objType>({})

    const load = () => {
      const { renderParams } = props
      if (!renderParams)
        return
      const { row, column } = renderParams
      currRow.value = row
      currColumn.value = column
    }

    function validateHandle() {
      console.log('props.renderParams', props.renderParams)
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
    // 判断是否为日期类型
    const isDateType = computed(() => getMomentIsValidIsNoNum(currentValue.value))

    const DateRender = computed(() => {
      return (
        isDateType.value && (
          <DateRangePicker
            format={valueFormat.value}
            value-format={valueFormat.value}
            type="date"
            {...renderOptsProps.value}
            modelValue={currRow.value[currColumn.value.field]}
            onUpdate:modelValue={(val: string[]) => {
              currRow.value[currColumn.value.field] = val[0]
              validateHandle()
            }}
          />
        )
      )
    })

    const SelectRender = computed(() => {
      return (
        propsOptions.value && (
          <Select
            class="w-full!"
            options={propsOptions.value}
            {...renderOptsProps.value}
            teleported={false}
            filterable
            automatic-dropdown
            modelValue={currRow.value[currColumn.value.field]}
            onUpdate:modelValue={(val: any) => {
              currRow.value[currColumn.value.field] = val
              validateHandle()
            }}
          />
        )
      )
    })

    const DefaultRender = computed(() => {
      return (
        <>
          <ElInput
            onInput={validateHandle}
            {...renderOptsProps.value}
            modelValue={currRow.value[currColumn.value.field]}
            onUpdate:modelValue={(val: any) => {
              currRow.value[currColumn.value.field] = val
              validateHandle()
            }}
          />
        </>
      )
    })

    return () => {
      return (
        <div>
          {currRow.value && currColumn.value
            ? DateRender.value || SelectRender.value || DefaultRender.value
            : null}
        </div>
      )
    }
  },
})

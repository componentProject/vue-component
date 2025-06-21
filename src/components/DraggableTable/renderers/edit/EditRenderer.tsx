import { computed, defineComponent, ref, watch } from 'vue'
import { getMomentIsValidIsNoNum, detectDateFormatByReplace } from '@/components/_utils'
import Select from '@/components/Select/index.vue'
import DateRangePicker from '@/components/DateRangePicker/index.vue'
import { ElInput } from 'element-plus'
import type { PropType } from 'vue'
import type { VxeTableDefines, VxeGlobalRendererHandles } from 'vxe-table'

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
    interface objType {
      [key: string]: any
    }

    const currColumn = ref<VxeTableDefines.ColumnInfo | objType>({})
    const currRow = ref<objType>({})

    const load = () => {
      const { renderParams } = props
      if (!renderParams) return
      const { row, column } = renderParams
      currRow.value = row
      currColumn.value = column
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
    const currentValue = computed<any>(() => {
      if (!currColumn.value || !currRow.value) return
      return currRow.value[currColumn.value.field]
    })
    const propsOptions = computed(() => {
      return props.renderOpts?.props?.options
    })
    const valueFormat = computed(() => {
      if (!currentValue.value) return
      return detectDateFormatByReplace(currentValue.value)
    })
    const inputValue = ref('')
    // 判断是否为日期类型
    const isDateType = computed(() => getMomentIsValidIsNoNum(currentValue.value))
    return () => {
      return (
        <div>
          {currRow.value && currColumn.value ? (
            isDateType.value ? (
              <DateRangePicker
                value-format={valueFormat.value}
                type="date"
                modelValue={currRow.value[currColumn.value.field]}
                onUpdate:modelValue={(val: string[]) =>
                  (currRow.value[currColumn.value.field] = val[0])
                }
              />
            ) : propsOptions.value ? (
              <Select
                teleported={false}
                class="w-full!"
                filterable
                v-model={currRow.value[currColumn.value.field]}
                options={propsOptions.value}
              />
            ) : (
              <ElInput
                v-model={inputValue.value}
                onFocus={() => (inputValue.value = currRow.value[currColumn.value.field])}
                onBlur={() => (currRow.value[currColumn.value.field] = inputValue.value)}
              />
            )
          ) : null}
        </div>
      )
    }
  },
})

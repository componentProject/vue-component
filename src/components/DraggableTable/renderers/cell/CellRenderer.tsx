import type { PropType } from 'vue'
import type { VxeGlobalRendererHandles, VxeTableDefines } from 'vxe-table'
import type { objType } from '@/components/_types'
import type { customCustomTypes } from '@/components/DraggableTable/_types'
import { ElInput, ElProgress, ElSwitch, ElTag } from 'element-plus'
import { computed, defineComponent, onMounted, ref, watch } from 'vue'
import { detectDateFormatByReplace } from '@/components/_utils'
import DateRangePicker from '@/components/DateRangePicker/index.vue'
import Select from '@/components/Select/index.vue'

export default defineComponent({
  name: 'CellRenderer',
  props: {
    renderParams: Object as PropType<VxeGlobalRendererHandles.RenderTableEditParams>,
    renderOpts: Object as PropType<VxeGlobalRendererHandles.RenderTableEditOptions>,
  },
  setup(props: {
    renderParams?: VxeGlobalRendererHandles.RenderTableEditParams
    renderOpts?: VxeGlobalRendererHandles.RenderTableEditOptions
  }) {
    const renderOptsProps = computed<objType>(() => props.renderOpts?.props || {})

    const renderOptsPropsType = computed<customCustomTypes>(() => props.renderOpts?.props?.type)

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
      return (
        dateType.value && (
          <DateRangePicker
            format={valueFormat.value}
            value-format={valueFormat.value}
            type={dateType.value}
            {...renderOptsProps.value}
            modelValue={currRow.value[currColumn.value.field]}
            onUpdate:modelValue={(val: string[]) =>
              (currRow.value[currColumn.value.field] = val[0])}
          />
        )
      )
    })

    const SelectRender = computed(() => {
      return (
        renderOptsPropsType.value === 'select'
        && propsOptions.value && (
          <Select
            class="w-full!"
            filterable
            automatic-dropdown
            {...renderOptsProps.value}
            v-model={currRow.value[currColumn.value.field]}
            options={propsOptions.value}
          />
        )
      )
    })
    const inputValue = ref('')
    onMounted(() => (inputValue.value = currRow.value[currColumn.value.field]))
    const InputRender = computed(() => {
      return (
        renderOptsPropsType.value === 'input' && (
          <ElInput
            {...renderOptsProps.value}
            v-model={inputValue.value}
            onBlur={() => (currRow.value[currColumn.value.field] = inputValue.value)}
          />
        )
      )
    })

    const SwitchRender = computed(() => {
      return (
        renderOptsPropsType.value === 'switch' && (
          <ElSwitch {...renderOptsProps.value} v-model={currRow.value[currColumn.value.field]} />
        )
      )
    })

    const ProgressRender = computed(() => {
      return (
        renderOptsPropsType.value === 'progress' && (
          <ElProgress {...renderOptsProps.value} v-model={currRow.value[currColumn.value.field]} />
        )
      )
    })

    const TagRender = computed(() => {
      return (
        renderOptsPropsType.value === 'tag'
        && (propsOptions.value
          ? (
              propsOptions.value.map((item: any) => (
                <ElTag class="mr-8!" {...item}>
                  {item.label}
                </ElTag>
              ))
            )
          : (
              <ElTag {...renderOptsProps.value}>{currRow.value[currColumn.value.field]}</ElTag>
            ))
      )
    })
    return () => {
      return (
        <div>
          {currRow.value && currColumn.value
            ? DateRender.value
            || SelectRender.value
            || InputRender.value
            || SwitchRender.value
            || ProgressRender.value
            || TagRender.value
            : null}
        </div>
      )
    }
  },
})

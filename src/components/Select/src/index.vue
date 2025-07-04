<template>
  <div>
    <el-select
      v-model="data"
      append-to="#app"
      :clearable="props.clearable"
      :filterable="props.filterable"
      :filter-method="computedFilterMethod"
      :collapse-tags="props.collapseTags"
      :tag-type="props.tagType"
      :teleported="props.teleported"
      :collapse-tags-tooltip="props.collapseTagsTooltip"
      v-bind="$attrs"
      @change="handleSelectChange"
    >
      <el-option
        v-for="(item) in computedOptions"
        :key="item[props.value]"
        :label="item[props.label]"
        :value="item[props.value]"
        :disabled="
          computedDisabledHandler({
            label: item[props.label],
            value: item[props.value],
            data: item,
          })
        "
      />
    </el-select>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import getServerOptions from '@/components/Select/src/uitls'
import type { objType } from '@/components/_types'
import { getType, getTypeDefault } from '@/components/_utils'

/**
 * 定义组件的props
 */
const props = defineProps({
  tagType: {
    type: String as () => 'success' | 'info' | 'warning' | 'danger',
    default: 'primary',
  },
  teleported: {
    type: Boolean,
    default: true,
  },
  clearable: {
    type: Boolean,
    default: true,
  },
  filterable: {
    type: Boolean,
    default: true,
  },
  filterMethod: {
    type: Function,
  },
  collapseTagsTooltip: {
    type: Boolean,
    default: true,
  },
  /**
   * 多选时是否将选中值按文字的形式展示
   */
  collapseTags: {
    type: Boolean,
    default: true,
  },
  /**
   * 展示下拉框的数据
   */
  label: {
    type: String,
    default: 'label',
  },
  /**
   * 下拉框选择的值
   */
  value: {
    type: String,
    default: 'value',
  },
  disabledValues: {
    type: Array,
    default: () => [],
  },
  disabledLabels: {
    type: Array,
    default: () => [],
  },
  disabledHandler: {
    type: Function,
  },
  /**
   * 下拉框数据
   */
  options: {
    type: Array,
    default: () => [],
  },
  filterFields: {
    type: Array,
    default: () => [],
  },
  /**
   * 是否启用远程搜索
   *
   */
  serverProps: {
    type: Object as PropType<objType | null>,
  },
})
const emits = defineEmits(['change'])
const data = defineModel<any>()
const keyword = ref('')
const allFilterFields = computed(() => {
  return Array.from(
    new Set(
      [
        ...getTypeDefault(props.filterFields, 'array'),
        'wbCode',
        'pyCode',
        'wbcode',
        'pycode',
        props.label,
        props.value,
      ].filter(item => item),
    ),
  )
})
const valueType = ref<string>()
const serverOrLocalOptions = ref<any[]>([])
watch(
  () => [props.serverProps, props.options],
  async ([newVal, newOptions]) => {
    if (newVal) {
      const { serverType = 'base', optionsParams = {} } = newVal as objType
      serverOrLocalOptions.value = await getServerOptions(serverType, optionsParams)
    }
    else {
      serverOrLocalOptions.value = newOptions as any[]
    }
    valueType.value = getType(serverOrLocalOptions.value[0]?.[props.value]) as string
  },
  {
    immediate: true,
    deep: true,
  },
)

const computedOptions = computed(() => {
  return getType(props.filterMethod, 'function')
    ? serverOrLocalOptions.value
    : serverOrLocalOptions.value.filter((item) => {
        return allFilterFields.value.some(field => item[field]?.toLowerCase().includes(keyword.value?.toLowerCase()))
      })
})

const computedFilterMethod = computed(() => {
  return props.filterMethod || defaultFilterMethod
})

function defaultFilterMethod(keywordStr: string) {
  keyword.value = keywordStr
}

function defaultDisabledHandler({ label, value }: { [label: string]: any }) {
  return props.disabledValues.includes(value) || props.disabledLabels.includes(label)
}

function handleSelectChange(value: any) {
  if (getType(value, valueType.value)) {
    emits('change', value)
  }
}

const computedDisabledHandler = computed(() => {
  return getTypeDefault(props.disabledHandler, 'function') || defaultDisabledHandler
})
</script>

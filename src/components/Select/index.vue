<template>
  <div>
    <el-select
      v-model="data"
      :clearable="props.clearable"
      :filterable="props.filterable"
      :filter-method="computedFilterMethod"
      :collapse-tags="props.collapseTags"
      :tag-type="props.tagType"
      :collapse-tags-tooltip="props.collapseTagsTooltip"
      v-bind="$attrs"
    >
      <el-option
        v-for="(item, index) in computedOptions"
        :key="index"
        :label="item[props.label]"
        :value="item[props.value]"
        :disabled="
          computedDisabledHandler({
            label: item[props.label],
            value: item[props.value],
            data: item,
          })
        "
      >
      </el-option>
    </el-select>
  </div>
</template>
<script setup>
import { computed, ref, watch } from 'vue'
import getServerOptions from '@/components/Select/uitls/index.js'

const data = defineModel()
/**
 * 定义组件的props
 */
const props = defineProps({
  tagType: {
    type: String,
    default: 'primary',
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
    type: Object,
  },
})

const keyword = ref('')
const allFilterFields = computed(() => {
  return Array.from(
    new Set(
      [
        ...getTypeDefault(props.filterFields, 'array'),
        'wbCode',
        'pyCode',
        props.label,
        props.value,
      ].filter((item) => item),
    ),
  )
})
const serverOrLocalOptions = ref([])

watch(
  () => props.serverProps,
  async (newVal) => {
    if (newVal) {
      const { serverType = 'base', optionsParams = {} } = newVal || {}
      serverOrLocalOptions.value = await getServerOptions(serverType, optionsParams)
    } else {
      serverOrLocalOptions.value = props.options
    }
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
        return allFilterFields.value.some((field) => item[field]?.includes(keyword.value))
      })
})

const computedFilterMethod = computed(() => {
  return props.filterMethod || defaultFilterMethod
})

function defaultFilterMethod(keywordStr) {
  keyword.value = keywordStr
}

function defaultDisabledHandler({ label, value }) {
  return props.disabledValues.includes(value) || props.disabledLabels.includes(label)
}

function getType(param, type) {
  return Object.prototype.toString.call(param).slice(8, -1).toLowerCase() === type.toLowerCase()
}

const typeDefaultMap = {
  string: '',
  number: 0,
  boolean: false,
  function: () => {},
  object: {},
  array: [],
  undefined: undefined,
  null: null,
}

function getTypeDefault(param, type) {
  return getType(param, type) ? param : typeDefaultMap[type]
}

const computedDisabledHandler = computed(() => {
  return getTypeDefault(props.disabledHandler, 'function') || defaultDisabledHandler
})
</script>

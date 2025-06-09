<template>
  <div class="date-range-picker">
    <el-date-picker
      ref="datePicker"
      v-bind="$attrs"
      v-model="localDateValue"
      :format="props.format"
      :placeholder="placeholder"
      :start-placeholder="startPlaceholder"
      :end-placeholder="endPlaceholder"
      :range-separator="rangeSeparator"
      :type="props.type"
      :disabledDate="disabledDateFn"
      @change="handleDateChange"
      :shortcuts="quickOptions ? shortcuts : []"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import moment from 'moment'

// 组件属性
const props = defineProps({
  // 绑定值
  modelValue: {
    type: Array,
    default: () => [],
  },
  // 日期选择类型，支持 date(单日期) 和 daterange(日期范围)
  type: {
    type: String,
    default: 'date',
    validator: (val) =>
      ['year', 'month', 'date', 'datetime', 'week', 'datetimerange', 'daterange'].includes(val),
  },
  // 显示在输入框中的格式
  format: {
    type: String,
    default: 'YYYY-MM-DD',
  },
  // 可选，绑定值的格式，对显示值无效
  valueFormat: {
    type: String,
    default: 'YYYY-MM-DD HH:mm:ss',
  },
  // 非范围选择时的占位内容
  placeholder: {
    type: String,
    default: '请选择日期',
  },
  // 范围选择时开始日期的占位内容
  startPlaceholder: {
    type: String,
    default: '开始日期',
  },
  // 范围选择时结束日期的占位内容
  endPlaceholder: {
    type: String,
    default: '结束日期',
  },
  rangeSeparator: {
    type: String,
    default: '至',
  },
  // date类型是否默认返回 [YYYY-MM-DD 00:00:00，YYYY-MM-DD 23:59:59] 格式，没有则取当前时间
  defaultDatetimeRange: {
    type: Boolean,
  },
  // 当无选定值时，是否默认返回今天的日期范围
  defaultToday: {
    type: Boolean,
    default: false,
  },
  // 设置日期范围
  // 可以是数字或数组
  // 正数表示当前日期往后n天
  // 负数表示往前n天
  // 数组[n,m]表示从前n天到后m天
  dateRange: {
    type: [Number, Array],
    default: null,
  },
  dateRangeType: {
    type: String,
    default: 'day',
  },
  // 最小可选日期
  minDate: {
    type: String,
    default: null,
  },
  // 最大可选日期
  maxDate: {
    type: String,
    default: null,
  },
  // 禁用日期范围，格式为 [minDate, maxDate]
  disabledDateRange: {
    type: Array,
    default: null,
  },
  // 是否显示快速选择选项
  quickOptions: {
    type: Boolean,
    default: false,
  },
})

// 定义emit
const emit = defineEmits(['update:modelValue', 'change'])

// 本地日期值，用于与el-date-picker交互
const localDateValue = ref(null)

/**
 * 日期选择器引用
 * @type {Element||import('element-plus').ElDatePicker}
 */
const datePicker = ref(null)

// 校验日期格式是否符合valueFormat
function isValidDateFormat(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return false
  return moment(dateStr, props.valueFormat, true).isValid()
}

// 校验日期范围格式
function validateDateRange(dateRange) {
  if (!dateRange) return false

  if (Array.isArray(dateRange)) {
    // 数组形式 [xxx, xxx]
    return dateRange.every((date) => isValidDateFormat(date))
  } else {
    // 单个日期值 xxx
    return isValidDateFormat(dateRange)
  }
}

// 禁用日期函数
function disabledDateFn(time) {
  const date = moment(time).format('YYYY-MM-DD')

  // 优先使用disabledDateRange
  if (props.disabledDateRange && props.disabledDateRange.length === 2) {
    const [min, max] = props.disabledDateRange
    if (min && moment(date).isBefore(moment(min).format('YYYY-MM-DD'))) {
      return true
    }
    if (max && moment(date).isAfter(moment(max).format('YYYY-MM-DD'))) {
      return true
    }
  } else {
    // 使用单独的minDate和maxDate
    if (props.minDate && moment(date).isBefore(moment(props.minDate).format('YYYY-MM-DD'))) {
      return true
    }
    if (props.maxDate && moment(date).isAfter(moment(props.maxDate).format('YYYY-MM-DD'))) {
      return true
    }
  }

  return false
}

// 根据dateRange生成初始日期范围
function generateDateRangeByConfig() {
  if (props.dateRange !== null) {
    let startDate, endDate

    if (Array.isArray(props.dateRange) && props.dateRange.length === 2) {
      // 数组形式 [n, m]
      const [startOffset, endOffset] = props.dateRange
      startDate = moment().add(+startOffset, props.dateRangeType)
      endDate = moment().add(+endOffset, props.dateRangeType)
    } else {
      // 数字形式
      if (+props.dateRange >= 0) {
        // 正数表示当前日期往后n天
        startDate = moment()
        endDate = moment().add(+props.dateRange, props.dateRangeType)
      } else {
        // 负数表示往前n天
        startDate = moment().add(+props.dateRange, props.dateRangeType)
        endDate = moment()
      }
    }

    if (startDate && endDate) {
      const range = formatDateRange([startDate, endDate])
      emit('update:modelValue', range)
      return range
    }
  }

  return null
}

// 快速选择选项
const shortcuts = [
  {
    text: '今天',
    value: () => {
      return [moment(), moment()]
    },
  },
  {
    text: '三天',
    value: () => {
      return [moment().subtract(2, 'days'), moment()]
    },
  },
  {
    text: '一周',
    value: () => {
      return [moment().subtract(6, 'days'), moment()]
    },
  },
  {
    text: '一个月',
    value: () => {
      return [moment().subtract(29, 'days'), moment()]
    },
  },
]
const computedDefaultDatetimeRange = computed(() => {
  return props.defaultDatetimeRange ?? props.type !== 'datetime'
})
// 判断一个日期字符串是否满足某个moment格式
function isValidMomentFormat(dateStr, format, type = 'startOf', dateType = 'day') {
  const momentDate = moment(dateStr, format, true)
  if (!momentDate.isValid()) return false

  const formatDateStr = momentDate.format(format)
  if (formatDateStr === dateStr || !computedDefaultDatetimeRange.value) return formatDateStr
  return momentDate[type](dateType).format(format)
}

// 格式化返回的日期范围
function formatDateRange(date) {
  if (Array.isArray(date) && date.length > 1) {
    const startDate = isValidMomentFormat(date[0], props.valueFormat)
    const endDate = isValidMomentFormat(date[1], props.valueFormat, 'endOf')
    if (startDate && endDate) {
      return [startDate, endDate]
    } else {
      console.error('日期格式不正确')
      return []
    }
  } else {
    const startDate = isValidMomentFormat(date, props.valueFormat)
    const endDate = isValidMomentFormat(date, props.valueFormat, 'endOf')

    if (startDate && endDate) {
      return [startDate, endDate]
    } else {
      console.error('日期格式不正确')
      return []
    }
  }
}
const singleDateTypes = ['date', 'datetime']
// 处理日期变化事件
const handleDateChange = (val) => {
  let formattedDates

  if (val) {
    formattedDates = formatDateRange(val)
  } else {
    formattedDates = []
  }

  emit('update:modelValue', formattedDates)
  emit('change', singleDateTypes.includes(props.type) ? formattedDates[0] : formattedDates)
}

function isEmpty(val) {
  if (Array.isArray(val)) {
    return val.length === 0
  } else {
    return !val
  }
}

function getLocalDateValue(date) {
  return singleDateTypes.includes(props.type) ? date[0] : date
}

let init = false
// 监听modelValue变化
watch(
  () => props.modelValue,
  (newVal) => {
    // 如果是空值，且是刚初始化
    if (isEmpty(newVal) && !init) {
      init = true
      // 如果没有传入modelValue:
      // 1.设置了dateRange，则使用dateRange配置生成初始值
      // 2.设置了defaultToday，则使用当前日期生成初始值
      const initialRange = generateDateRangeByConfig()
      if (initialRange && initialRange.length) {
        localDateValue.value = getLocalDateValue(initialRange)
      }
      // 如果defaultToday为true，则使用今天的日期
      else if (props.defaultToday) {
        const today = formatDateRange([moment(), moment()])
        emit('update:modelValue', today)
      } else {
        localDateValue.value = null
      }
    } else {
      // 如果满足日期格式，则更新localDateValue
      if (validateDateRange(newVal)) {
        localDateValue.value = getLocalDateValue(newVal)
      }
      // 如果不满足日期格式，则格式化日期
      else {
        const formattedDates = formatDateRange(newVal)
        console.log('formattedDates', formattedDates)
        emit('update:modelValue', formattedDates)
      }
    }
  },
  { deep: true, immediate: true },
)

// 暴露组件方法
defineExpose({
  focus: () => datePicker.value?.focus(),
  blur: () => datePicker.value?.blur(),
})
</script>

<style scoped>
.date-range-picker {
  display: inline-flex;
  width: 100%;
}
</style>

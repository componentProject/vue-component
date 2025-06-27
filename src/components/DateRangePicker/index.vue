<script lang="ts" setup>
import type { DatePickerProps } from 'element-plus'
import type { Moment, unitOfTime } from 'moment'
import type { PropType } from 'vue'
import { ElDatePicker } from 'element-plus'
import moment from 'moment'
import { isEmpty } from 'radash'
import { computed, ref, useTemplateRef, watch } from 'vue'
import { dateIsBefore, formatDateRange, getTypeDefault, validateDate } from '@/components/_utils'

defineOptions({
  name: 'DateRangePicker',
})
// 组件属性
const props = defineProps({
  // #region 透传给el-date-picker
  // 日期选择类型，支持 date(单日期) 和 daterange(日期范围)
  type: {
    type: String as () => DatePickerProps['type'],
    default: 'date',
    validator: (val: string) =>
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
  // #endregion
  // #region 默认值相关
  // 绑定值
  modelValue: {
    type: Array,
    default: () => [],
  },
  // date类型是否默认返回 [YYYY-MM-DD 00:00:00，YYYY-MM-DD 23:59:59] 格式，没有则取当前时间
  defaultDatetimeRange: {
    type: Boolean,
    default: null,
  },
  // 当无选定值时，是否默认返回今天的日期范围
  defaultToday: {
    type: Boolean,
    default: true,
  },
  /**
   * 日期范围，可以是数字或数组
   * 正数表示当前日期往后n天（dateRangeType）
   * 负数表示往前n天（dateRangeType）
   * 数组[n,m]表示从前n天到后m天（dateRangeType）
   */
  dateRange: {
    type: [Array, Number] as PropType<number[] | number>,
    default: null,
  },
  /**
   * 日期范围类型
   * @default day
   */
  dateRangeType: {
    type: String as () => unitOfTime.DurationConstructor,
    default: 'day',
  },
  /**
   * 日期范围的基准日期
   * @default 当前日期
   */
  dateRangeBaseDate: {
    type: [String, Object],
    default: moment(),
  },
  // #endregion
  // #region 禁用相关
  // 最小可选日期
  minDate: {
    type: [String, Object],
    default: null,
  },
  // 最大可选日期
  maxDate: {
    type: [String, Object],
    default: null,
  },
  // 禁用日期范围，格式为 [minDate, maxDate]
  disabledDateRange: {
    type: Array,
    default: null,
  },
  /**
   * datetime的时分秒禁用规则
   */
  datetimeDisableTypes: {
    type: Array,
    default: () => ['hours', 'minutes', 'seconds'],
  },
  // #endregion
  // 是否显示快速选择选项
  shortcuts: {
    type: [Boolean, Array],
    default: false,
  },
})

// 定义emit
const emit = defineEmits(['update:modelValue', 'change'])

// 本地日期值，用于与el-date-picker交互
const localDateValue = ref([])

const computedDefaultDatetimeRange = computed(() => {
  return props.defaultDatetimeRange ?? props.type !== 'datetime'
})

/**
 * 日期选择器引用
 */
const datePicker = useTemplateRef<typeof ElDatePicker>('datePicker')

// 禁用日期函数
function disabledDateFn(date: any) {
  const time = moment(date).format('YYYY-MM-DD')
  // 优先使用disabledDateRange
  const [min, max] = getTypeDefault(props.disabledDateRange, 'array')
  const minStr = min || props.minDate
  const maxStr = max || props.maxDate
  const minDay = minStr && moment(minStr).format('YYYY-MM-DD')
  const maxDay = maxStr && moment(maxStr).format('YYYY-MM-DD')
  return dateIsBefore(time, minDay) || dateIsBefore(maxDay, time)
}

// 其实是Dayjs | 'start' | 'end',但是不想装dayjs了
type DisabledTypes = any | 'start' | 'end'
type restParams = Array<any | DisabledTypes>
const hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]

// 禁用日期函数
function disabledHoursFn(type: DisabledTypes) {
  if (!props.datetimeDisableTypes.includes('hours'))
    return []
  // // 优先使用disabledDateRange
  const [min, max] = getTypeDefault(props.disabledDateRange, 'array')
  const minStr = min || props.minDate
  const maxStr = max || props.maxDate
  const minHour = minStr && moment(minStr).get('hour')
  const minDay = minStr && moment(minStr).get('day')
  const maxHour = maxStr && moment(maxStr).get('hour')
  const maxDay = maxStr && moment(maxStr).get('day')
  let minCurrentDay: number
  let maxCurrentDay: number
  if (Array.isArray(localDateValue.value)) {
    minCurrentDay = moment(localDateValue.value[0]).get('day')
    maxCurrentDay = moment(localDateValue.value[1]).get('day')
  }
  else {
    minCurrentDay = moment(localDateValue.value).get('day')
    maxCurrentDay = moment(localDateValue.value).get('day')
  }
  if (minHour && maxHour) {
    if (type === 'start') {
      return minCurrentDay === minDay ? hours.filter(h => h < minHour) : []
    }
    else if (type === 'end') {
      return maxCurrentDay === maxDay ? hours.filter(h => h > maxHour) : []
    }
  }
  else if (minHour) {
    return minCurrentDay === minDay ? hours.filter(h => h < minHour) : []
  }
  else if (maxHour) {
    return maxCurrentDay === maxDay ? hours.filter(h => h > maxHour) : []
  }
  return []
}

const minutesOrSeconds = [
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,
  25,
  26,
  27,
  28,
  29,
  30,
  31,
  32,
  33,
  34,
  35,
  36,
  37,
  38,
  39,
  40,
  41,
  42,
  43,
  44,
  45,
  46,
  47,
  48,
  49,
  50,
  51,
  52,
  53,
  54,
  55,
  56,
  57,
  58,
  59,
]

// 禁用日期函数
function disabledMinutesFn(_: number, type: DisabledTypes) {
  if (!props.datetimeDisableTypes.includes('minutes'))
    return []
  const [min, max] = getTypeDefault(props.disabledDateRange, 'array')
  const minStr = min || props.minDate
  const maxStr = max || props.maxDate
  const minMinute = minStr && moment(minStr).get('minutes')
  const minDay = minStr && moment(minStr).get('day')
  const maxMinute = maxStr && moment(maxStr).get('minutes')
  const maxDay = maxStr && moment(maxStr).get('day')
  let minCurrentDay: number
  let maxCurrentDay: number
  if (Array.isArray(localDateValue.value)) {
    minCurrentDay = moment(localDateValue.value[0]).get('day')
    maxCurrentDay = moment(localDateValue.value[1]).get('day')
  }
  else {
    minCurrentDay = moment(localDateValue.value).get('day')
    maxCurrentDay = moment(localDateValue.value).get('day')
  }
  if (minMinute && maxMinute) {
    if (type === 'start') {
      return minCurrentDay === minDay ? minutesOrSeconds.filter(m => m < minMinute) : []
    }
    else if (type === 'end') {
      return maxCurrentDay === maxDay ? minutesOrSeconds.filter(m => m > maxMinute) : []
    }
  }
  else if (minMinute) {
    return minCurrentDay === minDay ? minutesOrSeconds.filter(m => m < minMinute) : []
  }
  else if (maxMinute) {
    return maxCurrentDay === maxDay ? minutesOrSeconds.filter(m => m > maxMinute) : []
  }
  return []
}

// 禁用日期函数
function disabledSecondsFn(...rest: restParams) {
  if (!props.datetimeDisableTypes.includes('seconds'))
    return []
  const type: DisabledTypes = rest.at(2)
  const [min, max] = getTypeDefault(props.disabledDateRange, 'array')
  const minStr = min || props.minDate
  const maxStr = max || props.maxDate
  const minSecond = minStr && moment(minStr).get('seconds')
  const minDay = minStr && moment(minStr).get('day')
  const maxSecond = maxStr && moment(maxStr).get('seconds')
  const maxDay = maxStr && moment(maxStr).get('day')
  let minCurrentDay: number
  let maxCurrentDay: number
  if (Array.isArray(localDateValue.value)) {
    minCurrentDay = moment(localDateValue.value[0]).get('day')
    maxCurrentDay = moment(localDateValue.value[1]).get('day')
  }
  else {
    minCurrentDay = moment(localDateValue.value).get('day')
    maxCurrentDay = moment(localDateValue.value).get('day')
  }
  if (minSecond && maxSecond) {
    if (type === 'start') {
      return minCurrentDay === minDay ? minutesOrSeconds.filter(s => s < minSecond) : []
    }
    else if (type === 'end') {
      return maxCurrentDay === maxDay ? minutesOrSeconds.filter(s => s > maxSecond) : []
    }
  }
  else if (minSecond) {
    return minCurrentDay === minDay ? minutesOrSeconds.filter(s => s < minSecond) : []
  }
  else if (maxSecond) {
    return maxCurrentDay === maxDay ? minutesOrSeconds.filter(s => s > maxSecond) : []
  }
  return []
}

// 根据dateRange生成初始日期范围
function generateDateRangeByConfig() {
  if (props.dateRange !== null) {
    const baseDate = props.dateRangeBaseDate ? moment(props.dateRangeBaseDate) : moment()
    let startDate: Moment, endDate: Moment
    if (Array.isArray(props.dateRange)) {
      // 数组形式 [n, m]
      const [startOffset, endOffset] = props.dateRange
      startDate = moment(baseDate).add(+startOffset, props.dateRangeType)
      endDate = moment(baseDate).add(+endOffset, props.dateRangeType)
    }
    else {
      // 数字形式
      if (+props.dateRange >= 0) {
        // 正数表示当前日期往后n天
        startDate = moment(baseDate)
        endDate = moment(baseDate).add(+props.dateRange, props.dateRangeType)
      }
      else {
        // 负数表示往前n天
        startDate = moment(baseDate).add(+props.dateRange, props.dateRangeType)
        endDate = moment(baseDate)
      }
    }

    if (startDate && endDate) {
      const range = formatDateRange(
        [startDate, endDate],
        props.valueFormat,
        'day',
        !computedDefaultDatetimeRange.value,
      )
      emit('update:modelValue', range)
      return range
    }
  }

  return null
}

// 默认快速选择选项
const defaultShortcuts = [
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
      return [moment().subtract(1, 'week'), moment()]
    },
  },
  {
    text: '一个月',
    value: () => {
      return [moment().subtract(1, 'month'), moment()]
    },
  },
]
const computedShortcuts = computed(() => {
  return props.shortcuts === true ? defaultShortcuts : props.shortcuts || []
})

/**
 * value不为数组的日期类型
 */
const singleDateTypes: string[] = ['date', 'datetime']
// 处理日期变化事件
function handleDateChange(val: any) {
  const formattedDates = formatDateRange(
    val,
    props.valueFormat,
    'day',
    !computedDefaultDatetimeRange.value,
  )
  emit('update:modelValue', formattedDates)
  emit('change', singleDateTypes.includes(props.type) ? formattedDates[0] : formattedDates)
}

function getLocalDateValue(date: any[] | any) {
  return singleDateTypes.includes(props.type) ? (Array.isArray(date) ? date[0] : date) : date
}

let init = false
// 监听modelValue变化
watch(
  () => props.modelValue,
  (newVal: any) => {
    // 如果是空值，且是刚初始化
    // 1.设置了dateRange，则使用dateRange配置生成初始值
    // 2.设置了defaultToday，则使用当前日期生成初始值
    // 3.其他则保留空值
    if (isEmpty(newVal) && !init) {
      init = true
      // 如果没有传入modelValue:
      // 1.设置了dateRange，则使用dateRange配置生成初始值
      const initialRange = generateDateRangeByConfig()
      if (initialRange && initialRange.length) {
        localDateValue.value = getLocalDateValue(initialRange)
      }
      // 2.设置了defaultToday，则使用当前日期生成初始值
      else if (props.defaultToday) {
        const today = formatDateRange(
          [moment(), moment()],
          props.valueFormat,
          'day',
          !computedDefaultDatetimeRange.value,
        )
        emit('update:modelValue', today)
      }
      else {
        localDateValue.value = []
      }
    }
    // 如果不为空值
    // 1.如果满足日期格式，则更新localDateValue
    // 2.如果不满足日期格式，则格式化日期
    else {
      // 如果满足日期格式，则更新localDateValue
      if (validateDate(newVal, props.valueFormat, 'string')) {
        localDateValue.value = getLocalDateValue(newVal)
      }
      // 如果不满足日期格式，则格式化日期
      else {
        const formattedDates = formatDateRange(
          newVal,
          props.valueFormat,
          'day',
          !computedDefaultDatetimeRange.value,
        )
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

<template>
  <div class="w-full inline-block flex-1 overflow-hidden">
    <ElDatePicker
      ref="datePicker"
      v-bind="$attrs"
      v-model="localDateValue"
      style="width: 100%"
      :format="props.format"
      :placeholder="placeholder"
      :start-placeholder="startPlaceholder"
      :end-placeholder="endPlaceholder"
      :range-separator="rangeSeparator"
      :type="props.type"
      :disabled-date="disabledDateFn"
      :disabled-hours="disabledHoursFn"
      :disabled-minutes="disabledMinutesFn"
      :disabled-seconds="disabledSecondsFn"
      :shortcuts="computedShortcuts"
      @change="handleDateChange"
    />
  </div>
</template>

<style scoped></style>

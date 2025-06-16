<template>
  <div class="w-full inline-block">
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
      :shortcuts="computedShortcuts"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, useTemplateRef, watch } from 'vue'
import type { PropType } from 'vue'
import moment from 'moment'
import type { unitOfTime, Moment } from 'moment'
import { ElDatePicker } from 'element-plus'
import type { DatePickerProps } from 'element-plus'
import { dateIsBefore, formatDateRange, validateDate, getTypeDefault } from '@/components/_utils'
import { isEmpty } from 'radash'

// 组件属性
const props = defineProps({
  //#region 透传给el-date-picker
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
  //#endregion
  //#region 默认值相关
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
    default: false,
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
  //#endregion
  //#region 禁用相关
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
  //#endregion
  // 是否显示快速选择选项
  shortcuts: {
    type: [Boolean, Array],
    default: false,
  },
})

// 定义emit
const emit = defineEmits(['update:modelValue', 'change'])

// 本地日期值，用于与el-date-picker交互
const localDateValue = ref()

/**
 * 日期选择器引用
 */
const datePicker = useTemplateRef<typeof ElDatePicker>('datePicker')

// 禁用日期函数
function disabledDateFn(time: any) {
  // 优先使用disabledDateRange
  const [min = props.minDate, max = props.maxDate] = getTypeDefault(
    props.disabledDateRange,
    'array',
  )
  return dateIsBefore(time, min) || dateIsBefore(max, time)
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
    } else {
      // 数字形式
      if (+props.dateRange >= 0) {
        // 正数表示当前日期往后n天
        startDate = moment(baseDate)
        endDate = moment(baseDate).add(+props.dateRange, props.dateRangeType)
      } else {
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

const computedDefaultDatetimeRange = computed(() => {
  return props.defaultDatetimeRange ?? props.type !== 'datetime'
})

/**
 * value不为数组的日期类型
 */
const singleDateTypes: string[] = ['date', 'datetime']
// 处理日期变化事件
const handleDateChange = (val: any) => {
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
  return singleDateTypes.includes(props.type) ? date[0] : date
}

let init = false
// 监听modelValue变化
watch(
  () => props.modelValue,
  (newVal: any) => {
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
        const today = formatDateRange(
          [moment(), moment()],
          props.valueFormat,
          'day',
          !computedDefaultDatetimeRange.value,
        )
        emit('update:modelValue', today)
      } else {
        localDateValue.value = null
      }
    } else {
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

<style scoped></style>

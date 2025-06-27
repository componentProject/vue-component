# DateRangePicker 日期范围选择器组件

基于Element Plus DatePicker封装的增强型日期选择器组件，支持基础日期选择和日期范围选择。

## 功能特点

- 支持基础日期选择器和范围日期选择器
- 统一的日期格式化和处理
- 支持自动返回今日日期范围
- 灵活的日期范围限制
- 常用时间范围快捷选择

## 安装和引入

确保已安装相关依赖：

```bash
# 已在项目中安装
```

## 基本用法

```vue
<script setup>
import { ref } from 'vue'
import DateRangePicker from '@/components/DateRangePicker/index.vue'

// 日期范围数据
const dateRange = ref([])

// 监听日期变化
watch(dateRange, (newVal) => {
  console.log('日期范围变化:', newVal)
})
</script>

<template>
  <DateRangePicker
    v-model="dateRange"
    type="daterange"
    :default-today="true"
    :quick-options="true"
    :date-range="7"
    format="YYYY-MM-DD"
  />
</template>
```

## 组件属性（Props）

| 属性名            | 类型            | 默认值                | 说明                                                                                                  |
| ----------------- | --------------- | --------------------- | ----------------------------------------------------------------------------------------------------- |
| modelValue        | Array           | []                    | 绑定值，日期范围数组                                                                                  |
| type              | String          | 'date'                | 日期选择类型，支持 'date'(单日期) 和 'daterange'(日期范围)                                            |
| format            | String          | 'YYYY-MM-DD'          | 显示在输入框中的格式                                                                                  |
| valueFormat       | String          | 'YYYY-MM-DD HH:mm:ss' | 可选，绑定值的格式，对显示值无效                                                                      |
| placeholder       | String          | '请选择日期'          | 非范围选择时的占位内容                                                                                |
| startPlaceholder  | String          | '开始日期'            | 范围选择时开始日期的占位内容                                                                          |
| endPlaceholder    | String          | '结束日期'            | 范围选择时结束日期的占位内容                                                                          |
| defaultToday      | Boolean         | false                 | 当无选定值时，是否默认返回今天的日期范围                                                              |
| dateRange         | [Number, Array] | null                  | 设置日期范围，可以是数字或数组。正数表示当前日期往后n天，负数表示往前n天，数组[n,m]表示从前n天到后m天 |
| minDate           | String          | null                  | 最小可选日期                                                                                          |
| maxDate           | String          | null                  | 最大可选日期                                                                                          |
| disabledDateRange | Array           | null                  | 禁用日期范围，格式为 [minDate, maxDate]                                                               |
| quickOptions      | Boolean         | false                 | 是否显示快速选择选项（今天、三天、一周、一月）                                                        |
| disabled          | Boolean         | false                 | 是否禁用                                                                                              |
| clearable         | Boolean         | true                  | 是否可清空                                                                                            |
| size              | String          | 'default'             | 输入框尺寸                                                                                            |

## 事件（Events）

| 事件名            | 参数               | 说明                   |
| ----------------- | ------------------ | ---------------------- |
| update:modelValue | (dateRange: Array) | 日期范围更新事件       |
| change            | (dateRange: Array) | 用户确认选定的值时触发 |

## 方法（Methods）

| 方法名 | 参数 | 返回值 | 说明              |
| ------ | ---- | ------ | ----------------- |
| focus  | 无   | 无     | 使 input 获取焦点 |
| blur   | 无   | 无     | 使 input 失去焦点 |

## 快速选择项

当 `quickOptions` 设置为 `true` 时，会显示以下快速选择选项：

- 今天：当天的日期范围
- 三天：最近三天（今天和前两天）
- 一周：最近一周（今天和前六天）
- 一月：最近一个月（今天和前29天）

## 示例

参考 `DateRangePickerExample.vue` 文件，该文件展示了组件的完整用法示例。

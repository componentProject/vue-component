# DateRangePicker 日期范围选择器组件

基于Element Plus DatePicker封装的增强型日期选择器组件，支持基础日期选择和日期范围选择。

## 基础示例

```vue
<template>
  <DateRangePicker v-model="dateRange" type="daterange" :default-today="true" format="YYYY-MM-DD" />
</template>

<script setup>
import { ref } from 'vue'
const dateRange = ref<string[]>([])
</script>
```

## Props

| 属性名            | 类型            | 默认值                | 说明                                                                                                  |
| ----------------- | --------------- | --------------------- | ----------------------------------------------------------------------------------------------------- |
| modelValue        | Array           | []                    | 绑定值（单值返回字符串；范围返回字符串数组）                                                         |
| type              | String          | 'date'                | 'date' / 'datetime' / 'daterange' / 'datetimerange'                                                   |
| format            | String          | 'YYYY-MM-DD'          | 显示在输入框中的格式                                                                                  |
| valueFormat       | String          | 'YYYY-MM-DD HH:mm:ss' | 绑定值的格式（对显示无效）                                                                            |
| placeholder       | String          | '请选择日期'          | 非范围选择时的占位内容                                                                                |
| startPlaceholder  | String          | '开始日期'            | 范围选择时开始日期的占位内容                                                                          |
| endPlaceholder    | String          | '结束日期'            | 范围选择时结束日期的占位内容                                                                          |
| defaultDatetimeRange | Boolean      | null                  | 单值类型是否默认补齐 00:00:00/23:59:59                                                                |
| defaultToday      | Boolean         | true                  | 无选定值时默认返回今天的范围                                                                          |
| dateRange         | Number \| Number[] \| null | null       | 数字/区间：正数=今天到未来n；负数=过去n到今天；数组[-n,m]                                            |
| dateRangeType     | String          | 'day'                 | 偏移单位：day/week/month/year 等                                                                      |
| dateRangeBaseDate | String \| Object| 当前日期              | 计算偏移的基准日期                                                                                    |
| minDate           | String \| Object| null                  | 最小可选日期                                                                                          |
| maxDate           | String \| Object| null                  | 最大可选日期                                                                                          |
| disabledDateRange | Array           | null                  | 禁用区间：`[minDate, maxDate]`，优先于单独的 `minDate/maxDate`                                        |
| datetimeDisableTypes | Array<'hours'|'minutes'|'seconds'> | ['hours','minutes','seconds'] | 根据最小/最大边界禁用时分秒                                       |
| shortcuts         | Boolean \| Array| false                 | 是否显示快捷项或自定义快捷项                                                                           |

## Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 绑定值更新 | `(value: string[] | string) => void` |
| change | 用户确认选定时触发 | `(value: string[] | string) => void` |

## Slots

该组件不提供插槽。

## Expose

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| focus | 使 input 获取焦点 | `() => void` |
| blur | 使 input 失去焦点 | `() => void` |

---
title: 日历
description: Calendar 日历组件，用于显示日期和事件
date: 2025-01-27
tags:
  - 组件
---

# 日历组件

日历组件用于展示日期，支持国际化和自定义日期内容。

## 基础用法

基础的日历组件用法，支持语言切换。

:::demo
```vue
<template>
  <div class="calendar-demo">
    <div class="language-selector">
      <el-select v-model="locale" placeholder="选择语言" size="small">
        <el-option label="简体中文" value="zh-CN" />
        <el-option label="English" value="en-US" />
      </el-select>
    </div>
    <Calendar :locale="locale" />
  </div>
</template>
<script setup lang="ts">
  import { ref } from 'vue'

  const locale = ref('zh-CN')
</script>
<style scoped>
.calendar-demo {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.language-selector {
  display: flex;
  justify-content: flex-end;
}
</style>
```
:::

## 自定义日期内容

通过插槽可以自定义日期单元格的内容，实现更丰富的日历展示效果。

:::demo
```vue
<template>
  <div class="calendar-demo">
    <Calendar locale="zh-CN">
      <template #dateContent="{ date }">
        <div v-if="isSpecialDay(date)" class="special-day">
          {{ date.date() }}
          <div class="event-indicator"></div>
        </div>
      </template>
    </Calendar>
  </div>
</template>
<script setup lang="ts">
  import { Dayjs } from 'dayjs'
  
  // 判断是否为特殊日期(示例：每月1日和15日为特殊日期)
  const isSpecialDay = (date: Dayjs) => {
    return date.date() === 1 || date.date() === 15
  }
</script>
<style scoped>
.calendar-demo {
  width: 100%;
  max-width: 500px;
}
.special-day {
  position: relative;
  font-weight: bold;
  color: #409EFF;
}
.event-indicator {
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #409EFF;
}
</style>
```
:::

## 属性

| 属性名 | 说明 | 类型 | 可选值 | 默认值 |
| --- | --- | --- | --- | --- |
| modelValue | 默认展示的日期 | number \| Date \| Dayjs | — | 当前日期 |
| locale | 国际化设置 | string | zh-CN / en-US | zh-CN |
| className | 自定义类名 | string \| string[] | — | — |

## 插槽

| 插槽名 | 说明 | 参数 |
| --- | --- | --- |
| date | 自定义日期单元格 | { date: Dayjs } |
| dateContent | 自定义日期内容 | { date: Dayjs } |

## 事件

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| update:modelValue | 当前选中日期变更时触发 | Dayjs |
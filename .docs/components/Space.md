---
title: 间距
description: Space 间距组件，用于设置元素之间的间距
date: 2025-01-27
tags:
  - 组件
---

# 间距组件

Space 间距组件用于设置元素之间的间距，支持水平和垂直方向排列。

## 基础用法

基础的间距组件用法，默认为水平方向排列。

:::demo
```vue
<template>
  <Space>
    <div class="demo-box"></div>
    <div class="demo-box"></div>
    <div class="demo-box"></div>
  </Space>
</template>
<style scoped>
.demo-box {
  width: 50px;
  height: 50px;
  background-color: #409EFF;
  border-radius: 4px;
}
</style>
```
:::

## 垂直方向

通过设置 `direction` 属性为 `vertical` 可以使元素垂直排列。

:::demo
```vue
<template>
  <Space direction="vertical">
    <div class="demo-box"></div>
    <div class="demo-box"></div>
    <div class="demo-box"></div>
  </Space>
</template>
<style scoped>
.demo-box {
  width: 50px;
  height: 50px;
  background-color: #409EFF;
  border-radius: 4px;
}
</style>
```
:::

## 不同大小的间距

通过设置 `size` 属性可以调整元素之间的间距大小。

:::demo
```vue
<template>
  <div class="space-demo">
    <div class="space-control">
      <span>间距大小：</span>
      <el-radio-group v-model="size">
        <el-radio-button label="small">小</el-radio-button>
        <el-radio-button label="middle">中</el-radio-button>
        <el-radio-button label="large">大</el-radio-button>
      </el-radio-group>
    </div>
    <Space :size="size">
      <div class="demo-box"></div>
      <div class="demo-box"></div>
      <div class="demo-box"></div>
    </Space>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const size = ref('small')
</script>

<style scoped>
.space-demo {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.space-control {
  display: flex;
  align-items: center;
  gap: 10px;
}
.demo-box {
  width: 50px;
  height: 50px;
  background-color: #409EFF;
  border-radius: 4px;
}
</style>
```
:::

## 对齐方式

通过设置 `align` 属性可以调整元素的对齐方式。

:::demo
```vue
<template>
  <div class="space-demo">
    <div class="space-control">
      <span>对齐方式：</span>
      <el-radio-group v-model="align">
        <el-radio-button label="start">开始</el-radio-button>
        <el-radio-button label="center">居中</el-radio-button>
        <el-radio-button label="end">结束</el-radio-button>
        <el-radio-button label="baseline">基线</el-radio-button>
      </el-radio-group>
    </div>
    <Space :align="align">
      <div class="demo-box"></div>
      <div class="demo-box-tall"></div>
      <div class="demo-box"></div>
    </Space>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const align = ref('start')
</script>

<style scoped>
.space-demo {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.space-control {
  display: flex;
  align-items: center;
  gap: 10px;
}
.demo-box {
  width: 50px;
  height: 50px;
  background-color: #409EFF;
  border-radius: 4px;
}
.demo-box-tall {
  width: 50px;
  height: 100px;
  background-color: #67C23A;
  border-radius: 4px;
}
</style>
```
:::

## 自动换行

当 `wrap` 设置为 `true` 时，元素会在空间不足时自动换行。

:::demo
```vue
<template>
  <div class="space-demo">
    <Space :wrap="true" :size="[8, 16]" style="width: 300px; background-color: #F5F7FA; padding: 10px;">
      <div v-for="i in 10" :key="i" class="demo-box-small">{{ i }}</div>
    </Space>
  </div>
</template>

<style scoped>
.space-demo {
  display: flex;
  flex-direction: column;
}
.demo-box-small {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #409EFF;
  border-radius: 4px;
  color: white;
  font-weight: bold;
}
</style>
```
:::

## 属性

| 属性名 | 说明 | 类型 | 可选值 | 默认值 |
| --- | --- | --- | --- | --- |
| direction | 排列方向 | string | horizontal / vertical | horizontal |
| size | 间距大小 | string \| number \| [number, number] | small / middle / large / number | small |
| align | 对齐方式 | string | start / end / center / baseline | start |
| wrap | 是否自动换行 | boolean | — | false |
| className | 自定义类名 | string \| string[] | — | — |
| style | 自定义样式 | CSSProperties | — | {} | 
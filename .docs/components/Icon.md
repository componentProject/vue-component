---
title: 图标
description: Icon 图标组件，用于展示各种图标
date: 2025-01-27
tags:
  - 组件
---

# 图标组件

Icon 图标组件用于展示各种图标，支持多种图标来源和自定义样式。

## 基础用法

基础的图标组件用法，通过传入图标资源展示图标。

:::demo
```vue
<template>
  <div class="icon-demo">
    <Icon :icon="checkIcon" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
// 这里导入的是示例图标，实际使用时需要替换为自己的图标资源
const checkIcon = ref('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTkgMTYuMTcgNC44MyAxMmwtMS40MiAxLjQxTDkgMTkgMjEgN2wtMS40MS0xLjQxeiIvPjwvc3ZnPg==')
</script>

<style scoped>
.icon-demo {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}
</style>
```
:::

## 使用自定义颜色和大小

通过设置 `color` 和 `size` 属性可以自定义图标的颜色和大小。

:::demo
```vue
<template>
  <div class="icon-demo">
    <Icon :icon="checkIcon" color="#409EFF" size="32px" />
    <Icon :icon="checkIcon" color="#67C23A" size="40px" />
    <Icon :icon="checkIcon" color="#E6A23C" size="48px" />
    <Icon :icon="checkIcon" color="#F56C6C" size="56px" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
// 这里导入的是示例图标，实际使用时需要替换为自己的图标资源
const checkIcon = ref('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTkgMTYuMTcgNC44MyAxMmwtMS40MiAxLjQxTDkgMTkgMjEgN2wtMS40MS0xLjQxeiIvPjwvc3ZnPg==')
</script>

<style scoped>
.icon-demo {
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin: 20px 0;
}
</style>
```
:::

## 旋转图标

通过设置 `spin` 属性为 `true` 可以使图标旋转。

:::demo
```vue
<template>
  <div class="icon-demo">
    <Icon :icon="checkIcon" size="32px" />
    <Icon :icon="checkIcon" size="32px" spin />
  </div>
</template>

<script setup>
import { ref } from 'vue'
// 这里导入的是示例图标，实际使用时需要替换为自己的图标资源
const checkIcon = ref('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTkgMTYuMTcgNC44MyAxMmwtMS40MiAxLjQxTDkgMTkgMjEgN2wtMS40MS0xLjQxeiIvPjwvc3ZnPg==')
</script>

<style scoped>
.icon-demo {
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin: 20px 0;
}
</style>
```
:::

## 使用字体图标

通过设置 `scriptUrl` 和 `type` 属性可以使用字体图标库中的图标。

:::demo
```vue
<template>
  <div class="icon-demo">
    <Icon 
      scriptUrl="//at.alicdn.com/t/c/font_3590692_mp9kgduugne.js" 
      type="icon-zhangshangcaifuyemianshoujiban345" 
      size="32px" 
    />
  </div>
</template>

<style scoped>
.icon-demo {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px 0;
}
</style>
```
:::

## 直接使用 SVG 作为插槽

通过插槽可以直接传入 SVG 内容。

:::demo
```vue
<template>
  <div class="icon-demo">
    <Icon size="32px">
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
      </svg>
    </Icon>
  </div>
</template>

<style scoped>
.icon-demo {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px 0;
}
</style>
```
:::

## 属性

| 属性名 | 说明 | 类型 | 可选值 | 默认值 |
| --- | --- | --- | --- | --- |
| icon | 图标资源 | string \| SVGElement | — | — |
| color | 图标颜色 | string | — | 'currentColor' |
| size | 图标大小 | string \| number | — | '1em' |
| spin | 是否旋转 | boolean | true / false | false |
| type | iconfont 的 type | string | — | — |
| scriptUrl | iconfont 资源地址 | string | — | — |
| style | 自定义样式 | CSSProperties | — | {} |

## 插槽

| 插槽名 | 说明 | 参数 |
| --- | --- | --- |
| default | 图标内容 | — | 
# TsFooter 页脚组件

展示页面底部的版权信息、导航链接、联系方式等。

## 功能特点

- 文本与链接混排：数组元素支持字符串或对象 `{ text, link }`
- 三种对齐方式：left | center | right
- 纯样式无依赖，适配任意主题

## 安装与导入

```ts
import TsFooter from '@moluoxixi/components/Footer'
```

## 基本用法

```vue
<template>
  <TsFooter :items="items" align="center" />
  <div class="h-8" />
  <TsFooter :items="items" align="left" />
  <div class="h-8" />
  <TsFooter :items="items" align="right" />
  <div class="h-8" />
  <TsFooter :items="['© 2025 Company Inc.']" />
  <div class="h-8" />
  <TsFooter :items="[{ text: '官网', link: 'https://example.com' }]" />
  <div class="h-8" />
  <TsFooter :items="['服务热线：400-123-4567', { text: '隐私政策', link: 'https://example.com/privacy' }]" />
  <div class="h-8" />
  <TsFooter :items="['沪ICP备00000000号-1']" align="center" />
  <div class="h-8" />
  <TsFooter :items="['版权所有 © 2025 XXX 科技']" align="right" />
  <div class="h-8" />
  <TsFooter :items="items2" align="center" />
  <div class="h-8" />
  <TsFooter :items="items3" align="left" />
  <div class="h-8" />
  <TsFooter :items="items4" align="right" />
  <div class="h-8" />
  <TsFooter :items="['单条文本']" />
  <div class="h-8" />
  <TsFooter :items="[{ text: '联系我们', link: 'mailto:hi@example.com' }]" />
  <div class="h-8" />
  <TsFooter :items="[{ text: 'GitHub', link: 'https://github.com' }, ' ｜ ', { text: '文档', link: 'https://docs.example.com' }]" />
  <div class="h-8" />
  <TsFooter :items="['公司地址：上海市静安区XX路99号', '｜', { text: '地图', link: 'https://maps.example.com' }]" />
  <div class="h-8" />
  <TsFooter :items="['服务热线：400-123-4567']" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TsFooter from '@moluoxixi/components/Footer'

const items = ref([
  '© 2025 Trasen',
  { text: '官网', link: 'https://example.com' },
  { text: '帮助中心', link: 'https://help.example.com' },
])
const items2 = ref(['沪ICP备00000000号-1'])
const items3 = ref([{ text: 'GitHub', link: 'https://github.com' }])
const items4 = ref(['服务热线：400-123-4567'])
</script>
```

## Props

| 属性名 | 类型     | 默认值                              | 说明     |
| ------ | -------- | ----------------------------------- | -------- | ------------------ | ------------ |
| items  | `(string | { text: string; link?: string })[]` | `[]`     | 显示的文本或链接项 |
| align  | `'left'  | 'center'                            | 'right'` | `'center'`         | 内容对齐方式 |

## 事件

无

## 插槽

无

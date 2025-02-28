---
title: 日历
description: Calendar
date: 2025-01-27
tags:
  - 组件
---
:::demo
```vue

<template>
  <Calendar :locale="locale" />
</template>
<script setup lang="ts">
  import { ref } from 'vue'

  const locale = ref('zh-CN')
</script>
```
:::
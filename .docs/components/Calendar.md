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
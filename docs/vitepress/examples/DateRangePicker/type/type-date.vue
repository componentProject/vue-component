<!-- type-date.vue文件 -->
<template>
  <ElConfigProvider :locale="zhCn" :empty-values="[undefined, [], '']">
    <DateRangePicker v-model="val" type="date" placeholder="请选择日期" />
  </ElConfigProvider>
</template>

<script setup lang="ts">
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import { ref } from 'vue'

const val = ref<string[]>([])
</script>

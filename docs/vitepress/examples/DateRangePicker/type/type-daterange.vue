<template>
  <ElConfigProvider :locale="zhCn" :empty-values="[undefined, [], '']">
    <DateRangePicker
      v-model="val"
      type="daterange"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
    />
  </ElConfigProvider>
</template>

<script setup lang="ts">
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import { ref } from 'vue'

const val = ref<string[]>([])
</script>

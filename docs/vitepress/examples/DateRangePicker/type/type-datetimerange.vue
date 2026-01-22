<template>
  <ElConfigProvider :locale="zhCn" :empty-values="[undefined, [], '']">
    <DateRangePicker v-model="val" type="datetimerange" start-placeholder="开始时间" end-placeholder="结束时间" />
  </ElConfigProvider>
</template>

<script setup lang="ts">
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import { ref } from 'vue'

const val = ref<string[]>([])
</script>

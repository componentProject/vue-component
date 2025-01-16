<template>
  <el-config-provider :locale="zhCn" :empty-values="[undefined, '']">
    <Suspense>
      <RouterView />
      <template #fallback> 正在加载中..... </template>
    </Suspense>
  </el-config-provider>
</template>
<script lang="ts" setup>
import { RouterView } from 'vue-router'
import { Suspense } from 'vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

console.log('Suspense', Suspense)
</script>
<style scoped></style>

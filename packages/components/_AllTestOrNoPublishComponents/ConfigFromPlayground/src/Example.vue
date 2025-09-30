<template>
  <div class="p-4 h-full flex flex-col">
    <div class="mt-4 flex gap-2">
      <ElButton type="primary" @click="handleExport">
        导出配置
      </ElButton>
    </div>
    <pre class="mt-4">{{ exported }}</pre>
    <div class="flex-1-hidden">
      <ConfigFromPlayground ref="pgRef" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElButton } from 'element-plus'
import ConfigFromPlayground from './index.vue'

const pgRef = ref<InstanceType<typeof ConfigFromPlayground>>()
const exported = ref('')

function handleExport() {
  const rule = pgRef.value?.getRule() || []
  const option = pgRef.value?.getOption() || {}
  exported.value = JSON.stringify({ rule, option }, null, 2)
}
</script>

<style lang="scss" scoped>
pre {
  white-space: pre-wrap;
}
</style>

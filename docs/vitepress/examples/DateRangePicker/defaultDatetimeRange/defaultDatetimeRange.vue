<template>
  <ElConfigProvider :locale="zhCn" :empty-values="[undefined, [], '']">
    <div class="container">
      <DateRangePicker v-model="val" type="date" :default-datetime-range="false" />
      <div class="value">
        v-model：{{ val }}
      </div>
    </div>
  </ElConfigProvider>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import { ElConfigProvider } from 'element-plus'

const val = ref<string[]>([])
</script>

<style scoped>
.container > * + * {
  margin-top: 12px;
}
.value {
  font-size: 12px;
  color: #555;
}
</style>

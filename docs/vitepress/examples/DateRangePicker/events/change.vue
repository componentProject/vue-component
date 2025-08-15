<template>
  <ElConfigProvider :locale="zhCn" :empty-values="[undefined, [], '']">
    <div class="container">
      <DateRangePicker v-model="val" type="daterange" @change="last = $event" />
      <div class="value">
        最后一次 change：{{ last }}
      </div>
    </div>
  </ElConfigProvider>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import { ElConfigProvider } from 'element-plus'

const val = ref<string[]>([])
const last = ref<any>(null)
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

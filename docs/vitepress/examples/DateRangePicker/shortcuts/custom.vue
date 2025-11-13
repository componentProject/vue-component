<!-- custom.vue文件 -->
<template>
  <ElConfigProvider :locale="zhCn" :empty-values="[undefined, [], '']">
    <div class="container">
      <DateRangePicker v-model="val" type="daterange" :shortcuts="customShortcuts" />
      <div class="value">
        v-model：{{ val }}
      </div>
    </div>
  </ElConfigProvider>
</template>

<script setup lang="ts">
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import moment from 'moment'
import { ref } from 'vue'

const val = ref<string[]>([])
const customShortcuts = [
  { text: '昨天', value: () => [moment().subtract(1, 'day'), moment().subtract(1, 'day')] },
  { text: '最近3天', value: () => [moment().subtract(2, 'days'), moment()] },
]
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

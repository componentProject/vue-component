<template>
  <ElConfigProvider :locale="zhCn" :empty-values="[undefined, [], '']">
    <div class="container">
      <DateRangePicker
        v-model="val"
        type="datetimerange"
        :datetime-disable-types="['minutes']"
        :min-date="min"
        :max-date="max"
      />
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
const now = new Date()
const yyyy = now.getFullYear()
const mm = String(now.getMonth() + 1).padStart(2, '0')
const dd = String(now.getDate()).padStart(2, '0')
const min = `${yyyy}-${mm}-${dd} 10:30:00`
const max = `${yyyy}-${mm}-${dd} 10:45:00`
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

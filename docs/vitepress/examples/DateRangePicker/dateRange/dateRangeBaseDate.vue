<!-- dateRangeBaseDate.vue文件 -->
<template>
  <ElConfigProvider :locale="zhCn" :empty-values="[undefined, [], '']">
    <div class="container">
      <DateRangePicker
        v-model="val"
        type="daterange"
        :date-range-base-date="yesterday"
        :date-range="-7"
      />
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
const yesterday = moment().subtract(1, 'day')
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

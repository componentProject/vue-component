<!-- focus.vue文件 -->
<template>
  <ElConfigProvider :locale="zhCn" :empty-values="[undefined, [], '']">
    <div class="container">
      <div>
        <ElButton size="small" type="primary" class="btn" @click="picker?.focus()">
          focus
        </ElButton>
        <ElButton size="small" class="btn" @click="picker?.blur()">
          blur
        </ElButton>
      </div>
      <div>
        <DateRangePicker ref="picker" v-model="val" type="daterange" />
      </div>
    </div>
  </ElConfigProvider>
</template>

<script setup lang="ts">
import { ElButton, ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import { ref } from 'vue'

const val = ref<string[]>([])
const picker = ref<{ focus: () => void, blur: () => void } | null>(null)
</script>

<style scoped>
.container > * + * {
  margin-top: 12px;
}
.btn {
  margin-left: 8px;
}
</style>

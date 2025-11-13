<!-- change.vue文件 -->
<template>
  <div class="container">
    <TsSelect
      v-model="value"
      :options="options"
      label="label"
      value="value"
      @change="handleChange"
    />
    <div class="value">
      <div v-if="lastChange">
        最后一次 change：{{ lastChange }}
        <br>
        触发时间：{{ changeTime }}
      </div>
      <div v-else>
        选择选项查看 change 事件
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref('')
const options = ref([
  { label: '选项1', value: '1' },
  { label: '选项2', value: '2' },
  { label: '选项3', value: '3' },
])
const lastChange = ref<any>(null)
const changeTime = ref('')

function handleChange(val: any) {
  lastChange.value = val
  changeTime.value = new Date().toLocaleTimeString()
  console.log('change 事件:', val)
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.value {
  font-size: 14px;
  color: #666;
  min-height: 60px;
}
</style>

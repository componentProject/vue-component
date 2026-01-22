<template>
  <div class="container">
    <Tabs
      v-model="active"
      :tab-list="tabList"
      @tab-change="handleTabChange"
    >
      <template #A>
        <div class="panel-content">
          面板 A
        </div>
      </template>
      <template #B>
        <div class="panel-content">
          面板 B
        </div>
      </template>
    </Tabs>
    <div class="value">
      <div v-if="lastChange !== null">
        最近一次 tabChange：{{ lastChange }}
        <br>
        触发时间：{{ changeTime }}
      </div>
      <div v-else>
        切换标签页查看 tabChange 事件
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const active = ref('A')
const lastChange = ref<any>(null)
const changeTime = ref('')
const tabList = ref([
  { label: 'A', name: 'A' },
  { label: 'B', name: 'B' },
])

function handleTabChange(val: any) {
  lastChange.value = val
  changeTime.value = new Date().toLocaleTimeString()
  console.log('tabChange 事件:', val)
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.panel-content {
  padding: 20px;
  min-height: 200px;
}

.value {
  font-size: 14px;
  color: #666;
  min-height: 60px;
}
</style>

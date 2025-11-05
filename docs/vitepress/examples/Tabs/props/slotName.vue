<template>
  <div class="container">
    <Tabs v-model="active" :tab-list="tabList">
      <template #panel1>
        <div class="panel-content">
          通过 slot='panel1' 指定插槽
        </div>
      </template>
      <template #默认>
        <div class="panel-content">
          通过 label 名称作为插槽
        </div>
      </template>
    </Tabs>
    <div class="value">
      第一个标签使用 slot='panel1' 指定插槽名
      <br>
      第二个标签使用 label 作为插槽名
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const active = ref('panel1')
const tabList = ref([
  { label: '默认', name: 'panel1', slot: 'panel1' },
  { label: '默认', name: 'default' },
])
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
}
</style>

<template>
  <div style="height: 420px" class="p-8">
    <div class="h-full flex justify-between">
      <div class=" flex flex-col">
        <h4 class="title">
          用户A
        </h4>
        <div class="flex-1-hidden">
          <DraggableTable
            id="identity-demo"
            v-model="tableDataA"
            :columns="columns"
            page-id="page-identity"
            user-id="user-A"
            save-type="server"
            :get-config="getConfig"
            :set-config="setConfig"
            :show-pagination="false"
          />
        </div>
      </div>
      <div class="flex flex-col">
        <h4 class="title">
          用户B
        </h4>
        <div class="flex-1-hidden">
          <DraggableTable
            id="identity-demo"
            v-model="tableDataB"
            :columns="columns"
            page-id="page-identity"
            user-id="user-B"
            save-type="server"
            :get-config="getConfig"
            :set-config="setConfig"
            :show-pagination="false"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const PREFIX = 'demo_identity__'

function getKey(cfg: any) {
  return `${PREFIX}${cfg?.pageId || ''}__${cfg?.widgetId || ''}__${cfg?.userId || ''}`
}

async function getConfig(cfg: any) {
  const k = getKey(cfg)
  const txt = localStorage.getItem(k) || '[]'
  try {
    return JSON.parse(txt)
  }
  catch { return [] }
}

async function setConfig(cfg: any, columns: any[]) {
  const k = getKey(cfg)
  localStorage.setItem(k, JSON.stringify(columns))
}

function baseRows() {
  return [
    { id: 1, name: 'A-张三', score: 88 },
    { id: 2, name: 'A-李四', score: 92 },
  ]
}

const tableDataA = ref(baseRows())
const tableDataB = ref([
  { id: 1, name: 'B-王五', score: 70 },
  { id: 2, name: 'B-赵六', score: 85 },
])

const columns = ref([
  { field: 'id', title: 'ID', width: 70 },
  { field: 'name', title: '姓名', width: 130 },
  { field: 'score', title: '分数', width: 100 },
])
</script>

<style scoped>
</style>
